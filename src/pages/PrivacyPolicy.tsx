import React from 'react';


const COMPANY_NAME = "Autoserwis Berezowscy";
const COMPANY_ADDRESS = "Kozarzewek 1, 62-530 Kazimierz Biskupi, Poland"; 
const COMPANY_EMAIL = "berezowskiz@wp.pl"; 
const COMPANY_WEBSITE = "https://www.berezowscy.pl"; 


const PrivacyPolicy: React.FC = () => {
    return (
        <main className="max-w-[900px] mx-auto p-4 sm:p-8 text-[#ddd]  mb-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold mb-6 text-[#c9302c] border-b pb-2">
                    Polityka Prywatności
                </h1>
                <p className="mb-6 text-sm italic">
                    Ostatnia aktualizacja: Październik 2025
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-3 text-white">
                    1. Administrator Danych Osobowych
                </h2>
                <p className="mb-4">
                    Administratorem Państwa danych osobowych jest:
                    <br />
                    <strong>{COMPANY_NAME}</strong>
                    <br />
                    Adres: {COMPANY_ADDRESS}
                    <br />
                    Adres e-mail: {COMPANY_EMAIL}
                    <br />
                    (zwany dalej „Administratorem”).
                </p>
                <p className="mb-4">
                    Administrator przetwarza dane osobowe zgodnie z wymogami Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO).
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-3 text-white">
                    2. Cel i Podstawa Przetwarzania Danych
                </h2>
                <p className="mb-4">
                    Państwa dane są przetwarzane głównie w celu realizacji umowy wynajmu busa, którą zawierają Państwo, dokonując rezerwacji w serwisie {COMPANY_WEBSITE}.
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 mb-6">
                    <li>
                        <strong>Realizacja Umowy (Art. 6 ust. 1 lit. b RODO):</strong> Przetwarzamy Imię, Nazwisko, Adres e-mail oraz szczegóły rezerwacji (daty, ID busa) w celu wykonania usługi najmu.
                    </li>
                    <li>
                        <strong>Obsługa Płatności (Art. 6 ust. 1 lit. b RODO):</strong> Dane transakcyjne (kwota, status płatności) są przetwarzane w celu przyjęcia płatności.
                    </li>
                    <li>
                        <strong>Obowiązek Prawny (Art. 6 ust. 1 lit. c RODO):</strong> Przetwarzamy dane w celach księgowych i podatkowych zgodnie z obowiązującymi przepisami prawa.
                    </li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-3 text-white">
                    3. Zakres Zbieranych Danych
                </h2>
                <p className="mb-4">
                    Zbieramy wyłącznie dane niezbędne do prawidłowego przebiegu procesu rezerwacji i płatności, w tym:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 mb-6">
                    <li>Imię i nazwisko</li>
                    <li>Adres e-mail</li>
                    <li>Daty wynajmu (Start/Koniec)</li>
                    <li>Kwota i status płatności (is_paid, total_cost)</li>
                </ul>

                <h2 className="2xl font-semibold mt-6 mb-3 text-white">
                    4. Odbiorcy Danych
                </h2>
                <p className="mb-4">
                    Państwa dane osobowe mogą być przekazywane następującym kategoriom podmiotów:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 mb-6">
                    <li>Firmom świadczącym usługi księgowe i prawne.</li>
                    <li>Dostawcom systemów informatycznych i hostingodawcom.</li>
                    <li>Dostawcom Usług Płatniczych (PSP), takim jak Przelewy24, PayU, Stripe – w zakresie niezbędnym do przetworzenia Państwa płatności online.</li>
                </ul>

                <h2 className="2xl font-semibold mt-6 mb-3 text-white">
                    5. Okres Przechowywania Danych
                </h2>
                <p className="mb-4">
                    Dane dotyczące rezerwacji i transakcji będą przechowywane przez okres 5 lat, licząc od końca roku kalendarzowego, w którym nastąpiła realizacja usługi, co jest zgodne z obowiązującymi przepisami podatkowymi.
                </p>

                <h2 className="2xl font-semibold mt-6 mb-3 text-white">
                    6. Prawa Użytkownika
                </h2>
                <p className="mb-4">
                    Mają Państwo prawo do: dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych, wniesienia sprzeciwu oraz wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (UODO).
                </p>

                <h2 className="2xl font-semibold mt-6 mb-3 text-white">
                    7. Bezpieczeństwo Danych
                </h2>
                <p className="mb-4">
                    Administrator stosuje zaawansowane środki techniczne, takie jak szyfrowanie połączenia (HTTPS), Tokeny Sesji dla Panelu Admina oraz instrukcje przygotowane (prepared statements) w bazie danych, aby chronić Państwa dane przed nieautoryzowanym dostępem.
                </p>
            </div>
        </main>
    );
};

export default PrivacyPolicy;