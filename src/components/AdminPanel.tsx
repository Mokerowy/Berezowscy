import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/api"; 

interface Reservation {
    start: string;
    end: string;
    is_paid: number; 
}

interface BusData {
    id: number;
    name: string;
    reservations: Reservation[];
}

interface AdminData {
    buses: BusData[];
    total: number;
}


const AdminPanel: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState("");
    const [token, setToken] = useState<string | null>(null); 
    
    const [busData, setBusData] = useState<BusData[]>([]);
    const [totalBuses, setTotalBuses] = useState(0); 
    const [newTotal, setNewTotal] = useState(0); 

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const getAuthHeaders = () => {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    };

    const getDisplayEndDate = (endStr: string): string => {
        return endStr.slice(0, 10);
    };


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        try {
            const response = await fetch(API_URL + '/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Błąd logowania.");
            }

            const data = await response.json();
            setToken(data.token); 
            setIsLoggedIn(true);
            fetchAdminData(data.token); 
            setPassword(''); 
        } catch (err) {
            setError(`Błąd: ${(err as Error).message}`);
        }
    };
    
    const fetchAdminData = async (sessionToken: string | null = token) => {
        if (!sessionToken) return;

        setIsLoading(true);
        setError("");
        try {
            const response = await fetch(API_URL + '/admin/reservations', {
                headers: { 'Authorization': `Bearer ${sessionToken}` } 
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 401 || response.status === 403) {
                     setToken(null);
                     setIsLoggedIn(false);
                     throw new Error("Sesja wygasła. Zaloguj się ponownie.");
                }
                throw new Error(errorData.message || "Błąd podczas pobierania danych administratora.");
            }
            
            const data: AdminData = await response.json();
            setBusData(data.buses);
            setTotalBuses(data.total); 
            setNewTotal(data.total); 
        } catch (err) {
            setError(`Błąd: ${(err as Error).message}. Spróbuj ponownie.`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn && token) {
            fetchAdminData(token);
        }
    }, [isLoggedIn, token]);


    const handleDelete = async (busId: number, start: string, endStored: string) => {
        const displayEndDate = getDisplayEndDate(endStored);

        if (!window.confirm(`Czy na pewno chcesz usunąć rezerwację dla Bus ID ${busId} w terminie ${start} - ${displayEndDate}?`)) {
            return;
        }
        
        try {
            const response = await fetch(API_URL + '/reservations', {
                method: 'DELETE',
                headers: getAuthHeaders(),
                body: JSON.stringify({ 
                    'bus-id': String(busId),
                    'start-date': start,
                    'end-date': endStored,
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Błąd serwera: ${response.status}`);
            }
            
            alert("Rezerwacja usunięta pomyślnie.");
            fetchAdminData();
        } catch (err) {
            setError(`Błąd usuwania: ${(err as Error).message}`);
        }
    };

    const handleTotalBusesChange = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newTotal < 1) {
            alert("Liczba busów musi być większa niż 0.");
            return;
        }

        if (!window.confirm(`Czy na pewno chcesz zmienić całkowitą liczbę aktywnych busów na ${newTotal}?`)) {
            return;
        }

        try {
            const response = await fetch(API_URL + '/admin/total-buses', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ 
                    newTotal: newTotal
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Błąd serwera: ${response.status}`);
            }
            
            alert(`Liczba aktywnych busów zmieniona na ${newTotal}.`);
            fetchAdminData();

        } catch (err) {
            setError(`Błąd zmiany liczby busów: ${(err as Error).message}`);
        }
    };


    if (!isLoggedIn) {
        return (
            <div className="max-w-md mx-auto mt-[150px] p-6 bg-gray-800 rounded-lg shadow-xl text-[#ddd]">
                <h2 className="text-2xl font-bold mb-4 text-center">Panel Administratora</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="password">Hasło:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 mt-1 rounded text-black"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="w-full bg-[#c9302c] text-white p-2 rounded hover:bg-[#a52623] transition">
                        Zaloguj
                    </button>
                </form>
            </div>
        );
    }

    return (
        <main className="max-w-[1200px] mx-auto p-4 sm:p-8 text-[#ddd]">
            <div className="mt-[100px] bg-gray-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-6 border-b pb-2">Panel Rezerwacji (Admin)</h2>
                <button 
                    onClick={() => {
                        setIsLoggedIn(false);
                        setToken(null);
                    }} 
                    className="mb-4 bg-gray-600 p-2 rounded hover:bg-gray-700 transition"
                >
                    Wyloguj
                </button>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleTotalBusesChange} className="mb-8 p-4 border border-gray-600 rounded bg-gray-700">
                    <h3 className="text-xl font-semibold mb-3">Zarządzanie Dostępnością Busów</h3>
                    <p className="mb-2">Aktualna liczba **aktywnych** busów dostępnych do rezerwacji: **{totalBuses}**</p>
                    <label htmlFor="newTotal" className="block text-[#ddd] mb-1">
                        Nowa całkowita liczba aktywnych busów:
                    </label>
                    <div className="flex gap-4">
                        <input
                            type="number"
                            id="newTotal"
                            value={newTotal}
                            onChange={(e) => setNewTotal(parseInt(e.target.value) || 0)}
                            min="1"
                            required
                            className="p-2 rounded text-black w-32"
                        />
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                            Ustaw
                        </button>
                    </div>
                </form>


                {isLoading ? (
                    <p>Ładowanie rezerwacji...</p>
                ) : (
                    busData.map((bus) => (
                        <div key={bus.id} className="mb-8 border p-4 rounded bg-gray-700">
                            <h3 className="text-xl font-semibold mb-3">{bus.name} (ID: {bus.id})</h3>
                            {bus.reservations.length === 0 ? (
                                <p className="text-green-400">Brak aktywnych rezerwacji.</p>
                            ) : (
                                <ul>
                                    {bus.reservations.map((res, index) => (
                                        <li 
                                            key={index} 
                                            className={`flex justify-between items-center py-2 border-b last:border-b-0 ${!res.is_paid ? 'bg-yellow-900/50 border-yellow-700' : ''}`}
                                        >
                                            <span>
                                                Termin: 
                                                <strong className="ml-2">
                                                    {res.start} - {getDisplayEndDate(res.end)} 
                                                </strong>
                                                <span 
                                                    className={`ml-4 px-2 py-1 text-xs rounded font-semibold ${res.is_paid ? 'bg-green-600' : 'bg-red-600'}`}
                                                >
                                                    {res.is_paid ? 'OPŁACONA' : 'NIEOPŁACONA'}
                                                </span>
                                            </span>
                                            <button
                                                onClick={() => handleDelete(bus.id, res.start, res.end)}
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                            >
                                                Usuń
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))
                )}
            </div>
        </main>
    );
};

export default AdminPanel;