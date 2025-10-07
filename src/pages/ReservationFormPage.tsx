import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { SECURITY_DEPOSIT } from "../utils/pricing"; 


interface TempReservationData {
    'bus-id': string;
    'bus-quantity': string;
    'start-date': string;
    'end-date': string;
    'total-cost': string;
    'cost': number;
    'deposit': number;
}

interface CurrentReservation {
    id: number;
    cost: number;
    deposit: number;
}

interface ReservationFormPageProps {} 

const API_URL = "http://localhost:3001/api"; 

const ReservationFormPage: React.FC<ReservationFormPageProps> = () => {
    const location = useLocation(); 
    const navigate = useNavigate(); 

    const [reviewStage, setReviewStage] = useState(false);
    const [paymentStage, setPaymentStage] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
    const [currentReservation, setCurrentReservation] = useState<CurrentReservation | null>(null); 
    const [tempReservationData, setTempReservationData] = useState<TempReservationData | null>(null);

    const handleFormPageClose = (success = false) => {
        navigate('/wynajem-busow', { state: { reservationSuccess: success } }); 
    };

    useEffect(() => {
        const initialReservationData = location.state?.initialReservationData as TempReservationData | undefined;

        if (initialReservationData) {
            setTempReservationData(initialReservationData);
            setReviewStage(true);
        } else {
            handleFormPageClose(false); 
        }
    }, [location.state, navigate]); 

    const handleFormalSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!tempReservationData) return;

        const formalFormData = new FormData(event.currentTarget as HTMLFormElement); 
        const formalData = Object.fromEntries(formalFormData.entries());
        
        const formalRequiredFields = ['client-name', 'email'];
        for (const field of formalRequiredFields) {
             if (!formalData[field] || String(formalData[field]).trim() === "") {
                 alert(`Wymagane pole ${field} jest puste.`);
                 return; 
             }
        }
        
        if (!isTermsAccepted) {
            alert("Musisz przeczytać i zaakceptować Regulamin, aby kontynuować.");
            return;
        }
        if (!isPrivacyAccepted) {
            alert("Musisz zapoznać się z Polityką Prywatności, aby kontynuować.");
            return;
        }
        
        const finalCost = tempReservationData.cost;
        
        if (!window.confirm(`Potwierdź rezerwację. Koszt najmu: ${finalCost} zł. Kaucja: ${SECURITY_DEPOSIT} zł. Kontynuować do płatności?`)) {
            return;
        }
        
        const fullReservationData = {
            ...tempReservationData,
            'name': formalData['client-name'],
            'email': formalData['email'],
            'invoice-info': formalData['invoice-info'] || 'Brak',
        };

        const submitButton = event.currentTarget.querySelector('button[type="submit"]');

        try {
            submitButton?.setAttribute('disabled', 'true');
            
            const response = await fetch(API_URL + '/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fullReservationData), 
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = `Błąd serwera: ${response.status}`;
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) { /* ignore */ }
                throw new Error(errorMessage);
            }

            const responseData = await response.json();
            
            setCurrentReservation({
                id: responseData.reservationId, 
                cost: finalCost,
                deposit: SECURITY_DEPOSIT 
            });
            setReviewStage(false);
            setPaymentStage(true);
            
        } catch (error) {
            alert(`Błąd rezerwacji: ${(error as Error).message}`);
        } finally {
            submitButton?.removeAttribute('disabled');
        }
    };


    const handlePaymentConfirmation = async () => {
        if (!currentReservation) return;

        try {
            const response = await fetch(API_URL + '/reservations/confirm-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reservationId: currentReservation.id }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = "Błąd potwierdzenia płatności.";

                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) { /* ignore */ }
                
                if (response.status === 410 || response.status === 409) { 
                    alert(errorMessage);
                    setPaymentStage(false);
                    setCurrentReservation(null);
                    handleFormPageClose(true);
                    return; 
                }
                
                throw new Error(errorMessage);
            }
            
            alert(`Płatność za najem (${currentReservation.cost} zł) została pomyślnie przetworzona. Kaucja (${currentReservation.deposit} zł) zostanie pobrana przy odbiorze. Rezerwacja POTWIERDZONA!`);
            
            setPaymentStage(false);
            setCurrentReservation(null);
            handleFormPageClose(true); 
            
        } catch (error) {
            alert(`Błąd płatności: ${(error as Error).message}`);
        }
    };


    
    if (reviewStage && tempReservationData) {
        const { 'start-date': start, 'end-date': end, cost, deposit, 'bus-quantity': quantity } = tempReservationData;
        const totalObligation = cost + deposit;
        
        return (
         
            <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-start pt-10 sm:pt-20 pb-10">
                <div className="max-w-4xl mx-auto p-4 sm:p-8 dark:text-gray-100 text-gray-900 w-full">
                    <div className="dark:bg-gray-900 bg-white p-6 sm:p-8 rounded-xl shadow-2xl dark:border dark:border-gray-700 border border-gray-200">
                        <h2 className="text-2xl sm:text-3xl font-extrabold mb-5 sm:mb-6 dark:text-indigo-400 text-indigo-600 dark:border-b dark:border-gray-700 border-b border-gray-300 pb-3">
                            Krok 2: Podsumowanie i Dane Najemcy
                        </h2>
                        
                      
                        <div className="mb-8 dark:border-gray-600 border-gray-300 border p-4 sm:p-5 rounded-lg dark:bg-gray-800/70 bg-gray-50">
                            <p className="text-lg sm:text-xl font-semibold mb-3 dark:text-white text-gray-800">Szczegóły transakcji:</p>
                            <ul className="space-y-3">
                                <li className="flex justify-between items-center text-base sm:text-lg flex-wrap">
                                    <span className="w-full sm:w-auto dark:text-gray-300 text-gray-600">Okres najmu:</span>
                                    <strong className="dark:text-indigo-300 text-indigo-700 text-right w-full sm:w-auto">{start} do {end}</strong>
                                </li>
                                <li className="flex justify-between items-center text-base sm:text-lg">
                                    <span className="dark:text-gray-300 text-gray-600">Ilość busów:</span>
                                    <strong>{quantity} szt.</strong>
                                </li>
                                
                                <li className="flex justify-between items-center pt-2 dark:border-t dark:border-gray-700 border-t border-gray-300 flex-wrap">
                                    <span className="text-lg w-full sm:w-auto dark:text-white text-gray-900">Koszt najmu (Płatne teraz):</span>
                                    <strong className="text-2xl sm:text-3xl font-bold dark:text-indigo-400 text-indigo-600 mt-1 sm:mt-0">{cost} zł</strong>
                                </li>
                                <li className="flex justify-between items-center text-base sm:text-lg">
                                    <span className="dark:text-gray-300 text-gray-600">Kaucja (Płatna przy odbiorze):</span>
                                    <strong className="text-lg dark:text-indigo-400 text-indigo-600 whitespace-nowrap">{deposit} zł</strong>
                                </li>
                                
                                <li className="flex justify-between items-center text-lg sm:text-xl font-extrabold pt-3 dark:border-t dark:border-gray-600 border-t border-gray-300 mt-2 dark:text-white text-gray-900 flex-wrap">
                                    <span className="w-full sm:w-auto">CAŁKOWITE ZOBOWIĄZANIE:</span>
                                    <span className="text-2xl sm:text-3xl dark:text-indigo-400 text-indigo-600 mt-1 sm:mt-0">{totalObligation} zł</span>
                                </li>
                            </ul>
                        </div>

                    
                        <form onSubmit={handleFormalSubmit} className="space-y-5">
                            <h3 className="text-xl sm:text-2xl font-semibold mb-4 dark:text-white text-gray-800 dark:border-b dark:border-gray-700 border-b border-gray-300 pb-2">Dane Kontaktowe</h3>
                            
                            <div>
                                <label htmlFor="client-name" className="block dark:text-gray-300 text-gray-700 mb-1 font-medium">
                                    Imię i nazwisko (Najemcy):
                                </label>
                                <input type="text" id="client-name" name="client-name" required 
                                    className="w-full p-3.5 rounded-lg border dark:border-gray-600 border-gray-300 dark:bg-gray-800 bg-white dark:text-white text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 transition-colors" />
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block dark:text-gray-300 text-gray-700 mb-1 font-medium">
                                    E-mail (do potwierdzenia i kontaktu):
                                </label>
                                <input type="email" id="email" name="email" required 
                                    className="w-full p-3.5 rounded-lg border dark:border-gray-600 border-gray-300 dark:bg-gray-800 bg-white dark:text-white text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 transition-colors" />
                            </div>

                            <div>
                                <label htmlFor="invoice-info" className="block dark:text-gray-300 text-gray-700 mb-1 font-medium pt-2">
                                    Informacje dodatkowe / Dane do faktury (Opcjonalnie):
                                </label>
                                <textarea id="invoice-info" name="invoice-info" rows={3} placeholder="NIP, Nazwa firmy, Adres, jeśli potrzebujesz faktury." 
                                    className="w-full p-3 rounded-lg border dark:border-gray-600 border-gray-300 dark:bg-gray-800 bg-white dark:text-white text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"></textarea>
                            </div>

                       
                            <div className="mt-6 space-y-4 pt-4 dark:border-t dark:border-gray-700 border-t border-gray-300">
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="terms-accept"
                                        checked={isTermsAccepted}
                                        onChange={(e) => setIsTermsAccepted(e.target.checked)}
                                        className="mt-1 h-5 w-5 text-indigo-600 dark:bg-gray-700 bg-gray-200 dark:border-gray-500 border-gray-400 rounded focus:ring-indigo-500 flex-shrink-0"
                                    />
                                    <label htmlFor="terms-accept" className="ml-3 text-sm sm:text-base dark:text-gray-300 text-gray-700">
                                        Oświadczam, że przeczytałem i akceptuję 
                                        <Link to="/regulamin" target="_blank" className="dark:text-indigo-400 text-indigo-600 hover:underline ml-1 font-semibold">Regulamin / Ogólne Warunki Najmu</Link>.
                                    </label>
                                </div>
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="privacy-accept"
                                        checked={isPrivacyAccepted}
                                        onChange={(e) => setIsPrivacyAccepted(e.target.checked)}
                                        className="mt-1 h-5 w-5 text-indigo-600 dark:bg-gray-700 bg-gray-200 dark:border-gray-500 border-gray-400 rounded focus:ring-indigo-500 flex-shrink-0"
                                    />
                                    <label htmlFor="privacy-accept" className="ml-3 text-sm sm:text-base dark:text-gray-300 text-gray-700">
                                        Zapoznałem/am się z 
                                        <Link to="/polityka-prywatnosci" target="_blank" className="dark:text-indigo-400 text-indigo-600 hover:underline ml-1 font-semibold">Polityką Prywatności</Link>.
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="inline-block bg-indigo-600 text-white py-3 sm:py-4 px-6 rounded-lg transition-colors duration-300 hover:bg-indigo-700 mt-6 uppercase font-extrabold w-full text-base sm:text-lg shadow-lg dark:shadow-indigo-900/50 shadow-indigo-500/50 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                            >
                                DOKONAJ PŁATNOŚCI ZA NAJEM ({cost} zł)
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFormPageClose(false)} 
                                className="w-full dark:bg-gray-700 bg-gray-300 dark:text-gray-300 text-gray-700 p-3 rounded-lg hover:dark:bg-gray-600 hover:bg-gray-400 transition font-semibold text-sm sm:text-base"
                            >
                                Wróć do wyboru dat (Anuluj etap rezerwacji)
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        );
    }


    if (paymentStage && currentReservation) {
        return (
          
            <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-start pt-10 sm:pt-20 pb-10">
                <div className="max-w-xl mx-auto p-4 dark:text-gray-100 text-gray-900 w-full mt-16 sm:mt-24">
                    <div className="dark:bg-gray-900 bg-white p-6 sm:p-8 rounded-xl shadow-2xl text-center dark:border dark:border-gray-700 border border-gray-200">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-5 sm:mb-6 dark:text-indigo-400 text-indigo-600">Płatność za Rezerwację</h2>
                        <p className="text-lg sm:text-xl mb-4 dark:text-gray-300 text-gray-700">
                            Twoja **wstępna rezerwacja** (ID: {currentReservation.id}) czeka na opłacenie.
                        </p>
                        
                       
                        <div className="mx-auto w-full max-w-sm dark:border-gray-600 border-gray-300 border p-5 rounded-lg dark:bg-gray-800 bg-gray-50 mb-8">
                            <div className="flex flex-col sm:flex-row justify-between text-lg sm:text-xl mb-2">
                                <span className="font-semibold text-left sm:text-center w-full sm:w-auto dark:text-gray-300 text-gray-700">Koszt Najmu (Płatne teraz):</span>
                                <span className="font-extrabold dark:text-indigo-400 text-indigo-600 text-2xl sm:text-3xl mt-1 sm:mt-0 w-full sm:w-auto text-right">
                                    {currentReservation.cost} zł
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between text-sm sm:text-lg dark:text-indigo-400 text-indigo-600 dark:border-t dark:border-gray-700 border-t border-gray-300 pt-2 mt-2">
                                <span className="text-left w-full sm:w-auto dark:text-gray-300 text-gray-700">Kaucja zwrotna (Płatna przy odbiorze):</span>
                                <span className="font-bold text-right w-full sm:w-auto whitespace-nowrap">{currentReservation.deposit} zł</span>
                            </div>
                        </div>
                        
                        <p className="mb-8 font-light dark:text-gray-400 text-gray-600 italic text-sm sm:text-base">
                            Poniższe przyciski symbolizują metody płatności.
                        </p>

                        <div className="flex flex-col gap-4">
                            <button 
                                onClick={handlePaymentConfirmation}
                                className="bg-indigo-600 text-white py-3 sm:py-4 rounded-lg font-bold hover:bg-indigo-700 transition uppercase shadow-md text-base sm:text-lg"
                            >
                                Płać KARTĄ / BLIK / Szybki Przelew
                            </button>
                            <button 
                                onClick={handlePaymentConfirmation}
                                className="dark:bg-gray-600 bg-gray-400 text-white py-3 sm:py-4 rounded-lg font-bold hover:dark:bg-gray-700 hover:bg-gray-500 transition uppercase shadow-md text-base sm:text-lg"
                            >
                                Płać przez PayPal
                            </button>
                        </div>

                        <button 
                            onClick={() => { 
                                setPaymentStage(false); 
                                setReviewStage(true);
                            }}
                            className="mt-6 w-full dark:bg-gray-700 bg-gray-300 dark:text-gray-300 text-gray-700 p-3 rounded-lg hover:dark:bg-gray-600 hover:bg-gray-400 transition font-semibold text-sm sm:text-base"
                        >
                            Wróć do podsumowania i edycji danych
                        </button>
                    </div>
                </div>
            </main>
        );
    }

   
    return (
      
        <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center">
            <div className="max-w-md mx-auto p-4 dark:text-gray-100 text-gray-900 w-full text-center">
                <div className="dark:bg-gray-900 bg-white p-6 sm:p-8 rounded-xl shadow-2xl dark:border dark:border-gray-700 border border-gray-200">
                    <h2 className="text-xl sm:text-3xl font-bold dark:text-yellow-400 text-yellow-600">Trwa ładowanie danych rezerwacji...</h2>
                    <button 
                        onClick={() => handleFormPageClose(false)}
                        className="mt-6 dark:bg-gray-600 bg-gray-400 text-white py-3 px-6 rounded-md hover:dark:bg-gray-700 hover:bg-gray-500 font-semibold text-sm sm:text-base"
                    >
                        Wróć do kalendarza
                    </button>
                </div>
            </div>
        </main>
    );
};

export default ReservationFormPage;