const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require('moment-timezone');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

const { 
    addReservation, 
    confirmPayment, 
    deleteReservation, 
    getBusData,
    setActiveBusCount 
} = require("./reservationService"); 

const app = express();
const PORT = 3001;
const CLIENT_URL = "http://localhost:5173"; 

const ADMIN_PASSWORD = "admin123";
const ADMIN_SESSION_TOKEN = crypto.randomBytes(32).toString('hex'); 

const POLISH_TIMEZONE = 'Europe/Warsaw'; 

const corsOptions = {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const loginLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 5, 
    message: { message: "Zbyt wiele prób logowania z tego IP, spróbuj ponownie za 2 minuty." },
    standardHeaders: true,
    legacyHeaders: false,
});

const createDateObjectInPolishTimezone = (dateStr) => {
    return moment.tz(dateStr, 'YYYY-MM-DD', POLISH_TIMEZONE).toDate();
};

const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Błąd autoryzacji. Brak tokenu sesji." });
    }

    const token = authHeader.split(' ')[1];
    if (token === ADMIN_SESSION_TOKEN) {
        next(); 
    } else {
        return res.status(403).json({ message: "Błąd autoryzacji. Sesja nieprawidłowa lub wygasła." });
    }
};



app.post("/api/admin/login", loginLimiter, (req, res) => {
    const { password } = req.body;

    if (password === ADMIN_PASSWORD) {
        res.json({ token: ADMIN_SESSION_TOKEN, message: "Logowanie pomyślne." });
    } else {
        res.status(401).json({ message: "Nieprawidłowe hasło." });
    }
});



app.get("/api/buses/reservations", async (req, res) => {
    try {
        const { buses, total } = await getBusData(); 
        res.json({ buses, total }); 
    } catch (error) {
        console.error("Błąd bazy danych przy GET:", error);
        res.status(500).json({ message: "Błąd serwera podczas pobierania danych." });
    }
});


app.get("/api/admin/reservations", authenticateAdmin, async (req, res) => {
    try {
        const { buses, total } = await getBusData(); 
        res.json({ buses, total }); 
    } catch (error) {
        console.error("Błąd bazy danych przy GET admin:", error);
        res.status(500).json({ message: "Błąd serwera podczas pobierania danych administratora." });
    }
});



app.post("/api/reservations", async (req, res) => {
    const { 
        "bus-quantity": quantityStr, 
        "start-date": startDate, 
        "end-date": endDate, 
        name, 
        email,
        "total-cost": totalCostStr,
    } = req.body;
    
    if (!startDate || !endDate || !name || !email || !quantityStr || !totalCostStr) {
        return res.status(400).json({ message: "Brakuje wymaganych pól." });
    }
    
    const requiredQuantity = Number(quantityStr);
    const totalCost = Number(totalCostStr);

    if (!Number.isInteger(requiredQuantity) || requiredQuantity < 1) { 
        return res.status(400).json({ message: "Nieprawidłowa ilość busów." }); 
    }
    if (!Number.isInteger(totalCost) || totalCost <= 0) {
        return res.status(400).json({ message: "Nieprawidłowy koszt całkowity." });
    }
    
    const start = createDateObjectInPolishTimezone(startDate);
    const end = createDateObjectInPolishTimezone(endDate);

    const { buses: busData, total: totalBuses } = await getBusData(); 
    
    if (requiredQuantity > totalBuses) {
        return res.status(400).json({ message: `Maksymalna dostępna liczba busów to ${totalBuses}. Zmień ilość.` });
    }

    const activeBusPool = busData.slice(0, totalBuses);
    
    const isBusReserved = (bus, start, end) => {
        return bus.reservations.some(range => {
            const resStart = createDateObjectInPolishTimezone(range.start);
            const resEnd = createDateObjectInPolishTimezone(range.end);
            
            return (resStart <= end) && (resEnd >= start);
        });
    };
    
    const freeBuses = activeBusPool.filter(bus => !isBusReserved(bus, start, end));
    
    if (freeBuses.length < requiredQuantity) {
        return res.status(409).json({ message: `Dostępnych jest tylko ${freeBuses.length} z ${requiredQuantity} żądanych busów w tym terminie.` });
    }

    const busesToReserve = freeBuses.slice(0, requiredQuantity);
    let reservedBusIds = [];
    let initialReservationId = null;

    try {
        for (const bus of busesToReserve) {
            initialReservationId = await addReservation(bus.id, start, end, name, email, totalCost);
            reservedBusIds.push(bus.id);
            if (!initialReservationId) { break; } 
        }
    } catch (error) {
        console.error("Błąd zapisu do bazy danych:", error);
        return res.status(500).json({ message: "Wystąpił błąd podczas wstępnej rezerwacji." });
    }
    
    console.log(`-> UTWORZONO WSTĘPNĄ (${requiredQuantity}) REZERWACJĘ dla busów ID: ${reservedBusIds.join(', ')}. Oczekuje na płatność (Blokada: 30 sek).`);
    
    res.status(201).json({ 
        message: `Wstępna rezerwacja przyjęta. Oczekuje na płatność.`,
        reservationId: initialReservationId,
        totalCost: totalCost 
    });
});



app.post("/api/reservations/confirm-payment", async (req, res) => {
    const { reservationId } = req.body;
    
    if (!reservationId || !Number.isInteger(Number(reservationId))) {
        return res.status(400).json({ message: "Brak wymaganego ID rezerwacji." });
    }
    
    try {
        const result = await confirmPayment(reservationId);
        
        if (!result.success) {
            if (result.conflict) {
                 return res.status(409).json({ message: result.message + " Musisz zacząć proces rezerwacji od nowa." });
            }
            if (result.expired) {
                 return res.status(410).json({ message: result.message + " Rozpocznij rezerwację od nowa." });
            }
            return res.status(404).json({ message: "Rezerwacja nie znaleziona lub jest już opłacona/wystąpił błąd." });
        }
        
        console.log(`-> PŁATNOŚĆ POTWIERDZONA dla Rezerwacji ID: ${reservationId}. Status zmieniony na OPŁACONA.`);
        res.status(200).json({ message: result.message + " Rezerwacja jest aktywna." });
        
    } catch (error) {
        console.error("Błąd podczas potwierdzania płatności:", error);
        res.status(500).json({ message: "Błąd serwera podczas finalizacji płatności." });
    }
});



app.delete("/api/reservations", authenticateAdmin, async (req, res) => {
    const { "bus-id": busIdStr, "start-date": startDateStr, "end-date": endDateStr } = req.body;
    const busId = Number(busIdStr);

    if (!Number.isInteger(busId) || busId < 1 || !startDateStr || !endDateStr) {
        return res.status(400).json({ message: "Brakuje wymaganych pól lub ID busa jest nieprawidłowe." });
    }
    
    try {
        const startDate = createDateObjectInPolishTimezone(startDateStr);
        const endDate = createDateObjectInPolishTimezone(endDateStr);
        
        await deleteReservation(busId, startDate, endDate); 

        console.log(`-> Usunięto rezerwację dla Bus ID ${busId} w dniach ${startDateStr} - ${endDateStr}`);
        res.status(200).json({ message: "Rezerwacja została pomyślnie usunięta." });
    } catch (error) {
        console.error("Błąd usuwania z bazy danych:", error);
        res.status(500).json({ message: "Błąd serwera podczas usuwania danych." });
    }
});



app.post("/api/admin/total-buses", authenticateAdmin, async (req, res) => {
    const { newTotal } = req.body; 

    if (!Number.isInteger(newTotal) || newTotal < 1) {
        return res.status(400).json({ message: "Nieprawidłowa nowa liczba busów (musi być liczbą całkowitą > 0)." });
    }
    
    try {
        await setActiveBusCount(newTotal); 
        return res.status(200).json({ message: `Liczba aktywnych busów ustawiona na ${newTotal}.` });

    } catch (error) {
        console.error("Błąd ustawiania liczby busów:", error);
        res.status(500).json({ message: "Błąd serwera podczas aktualizacji konfiguracji." });
    }
});


app.listen(PORT, () => {
    console.log(`Serwer API działa na porcie ${PORT}.`);
});