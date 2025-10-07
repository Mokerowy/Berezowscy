const pool = require("./db");
const moment = require('moment-timezone');

const POLISH_TIMEZONE = 'Europe/Warsaw';
const TIME_TO_PAY_MINUTES = 0.5; 
const MAX_PAYMENT_WINDOW_HOURS = 12; 

const formatDateStringInPolishTimezone = (dateObj) => {
    return moment(dateObj).tz(POLISH_TIMEZONE).format('YYYY-MM-DD');
};

const getActiveBusCount = async () => {
    try {
        const [rows] = await pool.execute(
            `SELECT value_data FROM settings WHERE key_name = 'active_buses_count'`
        );
        return rows.length > 0 ? rows[0].value_data : 3; 
    } catch (error) {
        console.error("Błąd podczas pobierania aktywnej liczby busów:", error);
        return 3; 
    }
};

const setActiveBusCount = async (newTotal) => {
    const [result] = await pool.execute(
        `INSERT INTO settings (key_name, value_data) 
         VALUES ('active_buses_count', ?) 
         ON DUPLICATE KEY UPDATE value_data = ?`,
        [newTotal, newTotal]
    );
    return result.affectedRows;
};


const countReservedBuses = async (start, end) => {
    const startDateStr = formatDateStringInPolishTimezone(start);
    const endDateStr = formatDateStringInPolishTimezone(end);

    const expiredCutoff = moment().subtract(TIME_TO_PAY_MINUTES, 'minutes').tz(POLISH_TIMEZONE).format('YYYY-MM-DD HH:mm:ss');

    const [rows] = await pool.execute(
        `SELECT COUNT(DISTINCT bus_id) AS reserved_count 
        FROM reservations 
        WHERE (is_paid = 1 OR (is_paid = 0 AND created_at > ?)) AND start_date <= ? AND end_date >= ?`,
        [expiredCutoff, endDateStr, startDateStr]
    );

    return rows[0].reserved_count;
};


const addReservation = async (busId, start, end, name, email, totalCost) => {
    const startDateStr = formatDateStringInPolishTimezone(start);
    const endDateStr = formatDateStringInPolishTimezone(end);

    const [result] = await pool.execute(
        `INSERT INTO reservations (bus_id, start_date, end_date, client_name, client_email, total_cost, is_paid)
        VALUES (?, ?, ?, ?, ?, ?, 0)`, 
        [busId, startDateStr, endDateStr, name, email, totalCost]
    );

    return result.insertId;
};


const confirmPayment = async (reservationId) => {
 
    const [reservationRows] = await pool.execute(
        `SELECT bus_id, start_date, end_date, is_paid, created_at FROM reservations WHERE reservation_id = ?`,
        [reservationId]
    );

    if (reservationRows.length === 0) {
        return { success: false, message: "Rezerwacja nie istnieje." };
    }

    const res = reservationRows[0];
    if (res.is_paid === 1) {
        return { success: false, message: "Rezerwacja jest już opłacona." };
    }


    const hardExpirationCutoff = moment(res.created_at).add(MAX_PAYMENT_WINDOW_HOURS, 'hours');
    if (moment().isAfter(hardExpirationCutoff)) {
        return { success: false, message: `Płatność odrzucona: Minął maksymalny czas (${MAX_PAYMENT_WINDOW_HOURS}h) na opłacenie rezerwacji.`, expired: true };
    }


    const temporaryBlockExpiredCutoff = moment(res.created_at).add(TIME_TO_PAY_MINUTES, 'minutes');
    const isTemporaryBlockExpired = moment().isAfter(temporaryBlockExpiredCutoff);

    if (isTemporaryBlockExpired) {
    
        const [conflictRows] = await pool.execute(
            `SELECT reservation_id FROM reservations 
            WHERE bus_id = ? 
            AND is_paid = 1 
            AND reservation_id != ?
            AND start_date <= ? AND end_date >= ?`,
            [res.bus_id, reservationId, res.end_date, res.start_date]
        );
        
        if (conflictRows.length > 0) {
        
            return { success: false, message: "Płatność odrzucona: Termin został zajęty przez inną rezerwację.", conflict: true };
        }
    }
    

    const [result] = await pool.execute(
        `UPDATE reservations SET is_paid = 1 WHERE reservation_id = ? AND is_paid = 0`,
        [reservationId]
    );

    if (result.affectedRows === 1) {
        return { success: true, message: "Płatność pomyślnie potwierdzona." };
    } else {
        return { success: false, message: "Błąd aktualizacji statusu płatności." };
    }
};

const deleteReservation = async (busId, startDate, endDate) => {
    const startDateStr = formatDateStringInPolishTimezone(startDate);
    const endDateStr = formatDateStringInPolishTimezone(endDate);

    const [result] = await pool.execute(
        `DELETE FROM reservations 
        WHERE bus_id = ? AND start_date = ? AND end_date = ?`,
        [busId, startDateStr, endDateStr]
    );

    return result.affectedRows;
};

const getBusData = async () => {
    const [mockBusesResult] = await pool.execute(
        `SELECT id, name FROM buses ORDER BY id ASC`
    );

    const [reservations] = await pool.execute(
        `SELECT reservation_id, bus_id, start_date, end_date, is_paid, total_cost, created_at FROM reservations`
    );

    const busMap = new Map(
        mockBusesResult.map((bus) => [bus.id, { ...bus, reservations: [] }])
    );
    
    const now = moment().tz(POLISH_TIMEZONE); 

    reservations.forEach((res) => {
        if (busMap.has(res.bus_id)) {
            const startStr = moment(res.start_date).tz(POLISH_TIMEZONE).format('YYYY-MM-DD');
            const endStr = moment(res.end_date).tz(POLISH_TIMEZONE).format('YYYY-MM-DD');
            
            const totalCost = res.total_cost || 0; 
            const isPaid = res.is_paid || 0;
            
         
            let isBlockActive = false;
            if (isPaid === 1) {
                isBlockActive = true;
            } else {
                const createdTime = moment(res.created_at).tz(POLISH_TIMEZONE);
                const expiredCutoff = createdTime.add(TIME_TO_PAY_MINUTES, 'minutes');
                
                if (now.isBefore(expiredCutoff)) {
                    isBlockActive = true; 
                }
            }


            if (isBlockActive) {
                busMap.get(res.bus_id).reservations.push({
                    id: res.reservation_id, 
                    start: startStr,
                    end: endStr,
                    is_paid: isPaid,
                    total_cost: totalCost,
                    color: isPaid ? "#ff9f89" : "#ffcc00", 
                    display: "background",
                });
            }
        }
    });

    const activeCount = await getActiveBusCount();
    
    return { 
        buses: Array.from(busMap.values()), 
        total: activeCount 
    };
};

module.exports = {
    countReservedBuses,
    addReservation,
    confirmPayment,
    deleteReservation,
    getBusData,
    setActiveBusCount,
};