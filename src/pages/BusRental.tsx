

import React, { useState, useRef, useMemo, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate, useLocation } from "react-router-dom"; 
import { 
    calculateTotalCost, 
    isWeekend, 
    SECURITY_DEPOSIT 
} from "../utils/pricing"; 


interface Reservation {
    start: string;
    end: string;
    color: string;
    display: string;
}

interface Bus {
    id: number;
    name: string;
    reservations: Reservation[];
}

interface TempReservationData {
    'bus-id': string;
    'bus-quantity': string;
    'start-date': string;
    'end-date': string;
    'total-cost': string;
    'cost': number;
    'deposit': number;
}

const API_URL = "http://localhost:3001/api"; 

const BusRental: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [busData, setBusData] = useState<Bus[]>([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [requiredQuantity, setRequiredQuantity] = useState(1); 
    const [totalBuses, setTotalBuses] = useState(0); 
    const [startDateForm, setStartDateForm] = useState('');
    const [endDateForm, setEndDateForm] = useState('');
    const [calculatedCost, setCalculatedCost] = useState(0); 


    const calendarRef = useRef<FullCalendar>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const navigate = useNavigate(); 
    const location = useLocation(); 

    const fetchBusData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL + '/buses/reservations'); 
            
            if (!response.ok) {
                throw new Error(`Błąd HTTP: ${response.status}`);
            }
            
            const data: { buses: Bus[], total: number } = await response.json();
            setBusData(data.buses);
            setTotalBuses(data.total);
        } catch (error) {
            console.error("Błąd podczas pobierania danych busów:", error);
            alert(`Nie udało się załadować kalendarza. Upewnij się, że serwer działa na ${API_URL}`);
        } finally {
            setIsLoading(false);
        }
    };

 
    useEffect(() => {
        fetchBusData();
    }, []); 
    
   
    useEffect(() => {
        if (location.state?.reservationSuccess) {
            fetchBusData();
            setStartDateForm('');
            setEndDateForm('');
            setCalculatedCost(0);
            
            navigate(location.pathname, { replace: true, state: {} }); 
        }
    }, [location.state, navigate, location.pathname]);


    const getAvailabilityEvents = (required: number) => {
        if (totalBuses === 0) return [];
        
        const reservedMap: { [date: string]: number } = {};
        const startPeriod = new Date();
        startPeriod.setHours(0, 0, 0, 0); 
        startPeriod.setMonth(startPeriod.getMonth() - 1);
        const endPeriod = new Date();
        endPeriod.setMonth(endPeriod.getMonth() + 4); 
        
        const activeBuses = busData.slice(0, totalBuses);

        activeBuses.forEach(bus => {
            bus.reservations.forEach(range => {
                let currentDate = new Date(range.start);
                const endDate = new Date(range.end); 
                
                while (currentDate <= endDate) {
                    const dateStr = currentDate.toISOString().slice(0, 10);
                    reservedMap[dateStr] = (reservedMap[dateStr] || 0) + 1;
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            });
        });
        
        const events: any[] = [];
        let checkDate = new Date(startPeriod);
        
        while (checkDate <= endPeriod) {
            const dateStr = checkDate.toISOString().slice(0, 10);
            const reservedCount = reservedMap[dateStr] || 0;

            if (reservedCount > 0) {
                const freeCount = totalBuses - reservedCount;
                
                if (freeCount < required) {
                    events.push({
                        start: dateStr,
                        end: dateStr,
                        color: '#d9534f',
                        display: 'background',
                    });
                } 
            }
            checkDate.setDate(checkDate.getDate() + 1);
        }

        return events;
    };

    const availabilityEvents = useMemo(() => getAvailabilityEvents(requiredQuantity), [busData, totalBuses, requiredQuantity]);

    useEffect(() => {
        const cost = calculateTotalCost(startDateForm, endDateForm, requiredQuantity);
        setCalculatedCost(cost);
    }, [startDateForm, endDateForm, requiredQuantity]);

    const handleDateSelect = (info: any) => {
        const calendarApi = calendarRef.current?.getApi();
        const startStr = info.startStr.split("T")[0];
        const endDate = new Date(info.endStr);
        endDate.setDate(endDate.getDate() - 1);
        const finalEndStr = endDate.toISOString().slice(0, 10);
        
        const selectedStart = new Date(startStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedStart < today) {
            alert("Nie możesz rezerwować w przeszłości. Wybierz daty od dnia dzisiejszego.");
            calendarApi?.unselect();
            return;
        }
        
        if (isWeekend(startStr) || isWeekend(finalEndStr)) {
            alert("Odbiór i zwrot busa możliwy jest tylko w dni robocze (poniedziałek - piątek).");
            calendarApi?.unselect();
            return;
        }
        
        setStartDateForm(startStr);
        setEndDateForm(finalEndStr);
        setShowForm(true); 
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleCalendarSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formElement = event.currentTarget as HTMLFormElement; 
        const formData = new FormData(formElement);
        const data = Object.fromEntries(formData.entries());
        
        const requiredFields = ['start-date', 'end-date'];
        for (const field of requiredFields) {
            if (!data[field] || String(data[field]).trim() === "") {
                alert(`Wymagane pole ${field} jest puste.`);
                return; 
            }
        }
        
        const quantityStr = String(data['bus-quantity']);
        const requiredQuantityFromForm = Number(quantityStr);
        const dateStartStr = String(data['start-date']);
        const dateEndStr = String(data['end-date']);

        if (isWeekend(dateStartStr) || isWeekend(dateEndStr)) {
            alert("Odbiór i zwrot busa możliwy jest tylko w dni robocze (poniedziałek - piątek).");
            return;
        }
        
        const selectedStart = new Date(dateStartStr);
        const finalEnd = new Date(dateEndStr);
        
        if (requiredQuantityFromForm > totalBuses) {
            alert(`Maksymalna dostępna liczba busów to ${totalBuses}. Zmień ilość.`);
            return;
        }
        
        const finalCost = calculatedCost; 
        if (finalCost === 0) {
              alert("Błąd obliczania kosztu. Wybierz daty.");
              return;
        }
        
        const activeBuses = busData.slice(0, totalBuses);

        const isBusReserved = (bus: Bus) => { 
            return bus.reservations.some((range) => {
                const resStart = new Date(range.start);
                const resEnd = new Date(range.end); 
                return (resStart <= finalEnd) && (resEnd >= selectedStart); 
            });
        };
        const freeBuses = activeBuses.filter(bus => !isBusReserved(bus)); 

        if (freeBuses.length < requiredQuantityFromForm) {
            alert(`Błąd: W wybranym terminie dostępnych jest tylko ${freeBuses.length} z ${requiredQuantityFromForm} żądanych busów. Zmień datę lub ilość.`);
            return;
        }
        
        const assignedBus = freeBuses[0]; 
        
        const reservationData: TempReservationData = {
            'bus-id': String(assignedBus.id),
            'bus-quantity': quantityStr,
            'start-date': dateStartStr,
            'end-date': dateEndStr,
            'total-cost': String(finalCost),
            'cost': finalCost,
            'deposit': SECURITY_DEPOSIT,
        };

       
        navigate('/rezerwacja', { state: { initialReservationData: reservationData } });
    };

 
    return (
        <main className="rental-main max-w-[1200px] mx-auto p-0 sm:p-[2em] text-[#ddd]">
            <section className="bus-card bg-[rgba(0,0,0,0.4)] p-[20px] rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)] mt-[100px]">
                <h2 className="section-title text-center text-[#c9302c] text-[2.2em] font-bold mb-[0.2em] inline-block border-b-[3px] border-[#c9302c] pb-[0.2em] mx-auto">
                    Rezerwacja busa
                </h2>
                
                <div className="calendar-section my-[20px]">
                    <h3 className="text-2xl text-center mb-4">
                        Sprawdź dostępność i zarezerwuj busa (dostępnych busów: {totalBuses})
                    </h3>

                    <div className="flex justify-center items-center mb-6 p-4 bg-[rgba(255,255,255,0.1)] rounded-lg">
                        <label htmlFor="bus-quantity" className="text-[#ddd] mb-1 font-bold mr-4 text-xl">
                            Ile busów potrzebujesz?
                        </label>
                        <select
                            id="bus-quantity"
                            name="bus-quantity" 
                            required
                            value={requiredQuantity} 
                            onChange={(e) => setRequiredQuantity(Number(e.target.value))}
                            className="p-3 rounded border border-[#ccc] text-black text-lg" 
                        >
                            <option value="1">1 Bus</option>
                            <option value="2">2 Busy</option>
                            <option value="3">3 Busy</option>
                        </select>
                    </div>
                    
                    {isLoading ? (
                        <p className="text-center text-yellow-400 font-bold">Ładowanie danych kalendarza...</p>
                    ) : (
                        <p className="text-center text-red-400 mb-4 font-bold">
                            Czerwone tło oznacza brak możliwości rezerwacji żądanej ilości busów. Odbiór i zwrot tylko w dni robocze (Pn-Pt).
                        </p>
                    )}
                    
                    <div className="p-4 rounded-xl shadow-lg">
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            locale="pl"
                            height="auto"
                            headerToolbar={{
                                left: "prev,next today",
                                center: "title",
                                right: "",
                            }}
                            buttonText={{
                                today: 'Dzisiaj'
                            }}
                            selectable={!isLoading}
                            events={availabilityEvents} 
                            select={handleDateSelect}
                            longPressDelay={0}
                            dayCellContent={(arg) => {
                                return (
                                    <div className="flex flex-col h-full justify-between items-start relative">
                                        <div className="text-sm font-semibold p-[2px] w-full text-center z-10">{arg.dayNumberText}</div> 
                                    </div>
                                );
                            }}
                            dayHeaderClassNames="bg-black text-white"
                        />
                    </div>
                </div>
                
                <form
                    id="reservation-form"
                    ref={formRef}
                    onSubmit={handleCalendarSubmit}
                    className={`flex flex-col gap-[10px] mt-[20px] border-t-[2px] border-t-[#ccc] pt-[20px] transition-opacity duration-500 ease-in-out ${
                        showForm ? "opacity-100 visible" : "opacity-0 hidden"
                    }`}
                >
                    <h3 className="text-2xl text-center mb-4">Wybierz Termin</h3>
                    
                    <input type="hidden" name="bus-quantity" value={requiredQuantity} />
                    
                    <label htmlFor="start-date" className="block text-[#ddd] mb-1 font-bold">
                        Data odbioru:
                    </label>
                    <input
                        type="date"
                        id="start-date"
                        name="start-date"
                        required
                        value={startDateForm}
                        onChange={(e) => {
                            setStartDateForm(e.target.value);
                            (formRef.current!.querySelector("#start-date") as HTMLInputElement).value = e.target.value;
                        }}
                        className="p-[10px] rounded border border-[#ccc] bg-gray-300 text-black" 
                    />
                    <label htmlFor="end-date" className="block text-[#ddd] mb-1 font-bold">
                        Data zwrotu:
                    </label>
                    <input
                        type="date"
                        id="end-date"
                        name="end-date"
                        required
                        value={endDateForm}
                        onChange={(e) => {
                            setEndDateForm(e.target.value);
                            (formRef.current!.querySelector("#end-date") as HTMLInputElement).value = e.target.value;
                        }}
                        className="p-[10px] rounded border border-[#ccc] bg-gray-300 text-black" 
                    />
                    {calculatedCost > 0 && (
                        <div className="mt-4 p-3 bg-red-800 rounded text-center text-xl font-bold">
                            CAŁKOWITY KOSZT REZERWACJI: {calculatedCost} zł (+ Kaucja {SECURITY_DEPOSIT} zł)
                        </div>
                    )}
                    <button
                        type="submit"
                        className="btn inline-block bg-[#c9302c] text-white py-3 px-6 rounded-md transition-colors duration-300 hover:bg-[#a52623] mt-6 uppercase font-bold w-full"
                    >
                        Przejdź do Podsumowania i Danych Najemcy
                    </button>
                </form>
            </section>
        </main>
    );
};

export default BusRental;