import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const API_URL = "http://localhost:3001/api"; 
const SECURITY_DEPOSIT = 1000;

const ReviewPage: React.FC = () => {
    const navigate = useNavigate();
    const [reservationData, setReservationData] = useState<any>(null);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
    

    const [paymentStage, setPaymentStage] = useState(false);
    const [currentReservation, setCurrentReservation] = useState<any>(null); 

  
    useEffect(() => {
        const storedData = localStorage.getItem('tempReservationData');
        if (storedData) {
            setReservationData(JSON.parse(storedData));
        } else {
          
            alert("Brak danych rezerwacji. Rozpocznij proces od początku.");
            navigate('/wynajem-busow'); 
        }
        
       
        return () => {
             
             if (!paymentStage) { 
                 localStorage.removeItem('tempReservationData');
             }
        };
    }, [navigate, paymentStage]);


 
    const handleFormalSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!reservationData) return;

       
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
        
        const finalCost = reservationData.cost;
        
        if (!window.confirm(`Potwierdź rezerwację. Koszt najmu: ${finalCost} zł. Kaucja: ${SECURITY_DEPOSIT} zł. Kontynuować do płatności?`)) {
            return;
        }
        
  
        const fullReservationData = {
            ...reservationData,
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
           
            localStorage.removeItem('tempReservationData');
            setPaymentStage(true);

        } catch (error) {
            alert(`Błąd rezerwacji: ${(error as Error).message}`);
        } finally {
            submitButton?.removeAttribute('disabled');
        }
    };


   
    if (paymentStage && currentReservation) {

          return (
             <main className="max-w-[800px] mx-auto p-4 sm:p-8 text-[#ddd] mt-[150px]">
                 <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
                     <h2 className="text-4xl font-bold mb-6 text-green-400">Przekierowanie do Płatności...</h2>
                     <p className="text-xl mb-4">
                         Twoja wstępna rezerwacja (ID: {currentReservation.id}) została utworzona.
                     </p>
                     <p className="text-3xl font-extrabold mb-8 text-[#c9302c]">
                         KWOTA DO ZAPŁATY: {currentReservation.cost} zł
                     </p>
                     <p className="mb-4">W tym miejscu nastąpiłoby przekierowanie do bramki płatniczej BLIK/PayPal.</p>
                     
                     <button 
                         onClick={() => navigate('/wynajem-busow')}
                         className="mt-6 w-full bg-[#c9302c] text-white py-3 rounded hover:bg-[#a52623] transition"
                     >
                         Wróć do kalendarza
                     </button>
                 </div>
             </main>
         );
    }
    
   
    if (!reservationData) return <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-xl text-[#ddd] mt-[150px] text-center">Ładowanie danych rezerwacji...</div>;
    
    const { 'start-date': start, 'end-date': end, cost, deposit, 'bus-quantity': quantity } = reservationData;
    const totalObligation = cost + deposit;

    return (
        <main className="max-w-[800px] mx-auto p-4 sm:p-8 text-[#ddd] mt-[150px]">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-green-400 border-b pb-2">
                    Krok 2: Podsumowanie i Dane Najemcy
                </h2>
                
               
                <div className="mb-8 border border-gray-600 p-4 rounded-lg">
                    <p className="text-xl font-semibold mb-3">Podsumowanie rezerwacji:</p>
                    <ul className="space-y-1">
                        <li><strong>Okres:</strong> {start} do {end}</li>
                        <li><strong>Ilość busów:</strong> {quantity} szt.</li>
                        <li><strong>Koszt najmu (Płatne teraz):</strong> {cost} zł</li>
                        <li><strong>Kaucja (Płatna przy odbiorze):</strong> {deposit} zł</li>
                        <li className="text-2xl font-bold pt-2 border-t border-gray-600 mt-2 text-[#c9302c]">
                            CAŁKOWITE ZOBOWIĄZANIE: {totalObligation} zł
                        </li>
                    </ul>
                </div>

         
                <form onSubmit={handleFormalSubmit} className="space-y-4">
                    <h3 className="text-2xl font-semibold mb-4 text-white">Wprowadź Dane Kontaktowe</h3>
                    
                    <label htmlFor="client-name" className="block text-[#ddd] mb-1 font-bold">
                        Imię i nazwisko (Najemcy):
                    </label>
                    <input type="text" id="client-name" name="client-name" required className="w-full p-3 rounded text-black" />
                    
                    <label htmlFor="email" className="block text-[#ddd] mb-1 font-bold">
                        E-mail (do potwierdzenia i kontaktu):
                    </label>
                    <input type="email" id="email" name="email" required className="w-full p-3 rounded text-black" />

                    <label htmlFor="invoice-info" className="block text-[#ddd] mb-1 font-bold pt-4">
                        Informacje dodatkowe / Dane do faktury (Opcjonalnie):
                    </label>
                    <textarea id="invoice-info" name="invoice-info" rows={3} placeholder="NIP, Nazwa firmy, Adres, jeśli potrzebujesz faktury." className="w-full p-3 rounded text-black bg-gray-700"></textarea>

                  
                    <div className="mt-6 space-y-3 pt-4 border-t border-gray-600">
                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="terms-accept"
                                checked={isTermsAccepted}
                                onChange={(e) => setIsTermsAccepted(e.target.checked)}
                                className="mt-1 h-4 w-4 text-[#c9302c] bg-gray-600 border-gray-500 rounded focus:ring-[#c9302c]"
                            />
                            <label htmlFor="terms-accept" className="ml-3 text-sm text-[#ddd]">
                                Oświadczam, że przeczytałem i akceptuję 
                                <Link to="/regulamin" target="_blank" className="text-[#c9302c] hover:underline ml-1">Regulamin / Ogólne Warunki Najmu</Link>.
                            </label>
                        </div>
                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="privacy-accept"
                                checked={isPrivacyAccepted}
                                onChange={(e) => setIsPrivacyAccepted(e.target.checked)}
                                className="mt-1 h-4 w-4 text-[#c9302c] bg-gray-600 border-gray-500 rounded focus:ring-[#c9302c]"
                            />
                            <label htmlFor="privacy-accept" className="ml-3 text-sm text-[#ddd]">
                                Zapoznałem/am się z 
                                <Link to="/polityka-prywatnosci" target="_blank" className="text-[#c9303c] hover:underline ml-1">Polityką Prywatności</Link>.
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn inline-block bg-green-600 text-white py-3 px-6 rounded-md transition-colors duration-300 hover:bg-green-700 mt-6 uppercase font-bold w-full"
                    >
                        DOKONAJ PŁATNOŚCI ZA NAJEM ({cost} zł)
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/wynajem-busow')}
                        className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700 transition"
                    >
                        Wróć do wyboru dat
                    </button>
                </form>
            </div>
        </main>
    );
};

export default ReviewPage;