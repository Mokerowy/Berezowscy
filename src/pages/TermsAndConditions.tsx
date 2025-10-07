import React from 'react';


const COMPANY_NAME = "Autoserwis Berezowscy";
const COMPANY_ADDRESS = "Kozarzewek 1, 62-530 Kazimierz Biskupi, Poland"; 
const COMPANY_WEBSITE = "https://www.berezowscy.pl"; 


const TermsAndConditions: React.FC = () => {
    return (
        <main className="max-w-[900px] mx-auto p-4 sm:p-8 text-[#ddd]  mb-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold mb-6 text-[#c9302c] border-b pb-2">
                    Regulamin / Ogólne Warunki Najmu Busów
                </h1>
                <p className="mb-6 text-sm italic">
                    Dotyczy rezerwacji online dokonywanych za pośrednictwem strony {COMPANY_WEBSITE}.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-3 text-white">
                    1. Postanowienia Ogólne i Definicje
                </h2>
                <ul className="list-disc list-inside ml-4 space-y-2 mb-4">
                    <li>
                        <strong>Wynajmujący:</strong> {COMPANY_NAME}, {COMPANY_ADDRESS}, zwany dalej Wynajmującym.
                    </li>
                    <li>
                        <strong>Najemca:</strong> Osoba fizyczna lub prawna dokonująca rezerwacji i zawierająca umowę najmu Pojazdu.
                    </li>
                    <li>
                        <strong>Pojazd:</strong> Bus osobowy marki Renault Trafic (9-osobowy) lub inny, szczegółowo opisany w potwierdzeniu rezerwacji.
                    </li>
                    <li>
                        <strong>Umowa Najmu:</strong> Umowa zostaje zawarta z chwilą opłacenia rezerwacji online.
                    </li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-3 text-white">
                    2. Zasady Rezerwacji, Cena i Płatność
                </h2>
                <ul className="list-disc list-inside ml-4 space-y-2 mb-4">
                    <li>
                        Proces Rezerwacji: Wybór Pojazdu skutkuje Wstępną Rezerwacją. Termin jest tymczasowo blokowany na czas 30 minut do momentu opłacenia.
                    </li>
                    <li>
                        Zawarcie Umowy: Umowa jest wiążąca z chwilą otrzymania przez Wynajmującego pełnej płatności za najem.
                    </li>
                    <li>
                        Płatność: Opłata za najem jest dokonywana z góry za pośrednictwem Operatorów Płatności Online (BLIK, przelewy, karty).
                    </li>
                    <li>
                        Cena: Obejmuje wynajem Pojazdu, ubezpieczenie OC/AC oraz podstawowy limit kilometrów [WSTAW LIMIT KM/DOBĘ, np. 300 km/dobę]. Przekroczenie limitu podlega dodatkowej opłacie.
                    </li>
                    <li>
                        Wymogi Najemcy: Najemca musi posiadać ukończone [WSTAW WIEK, np. 21] lat oraz ważne prawo jazdy kat. B (min. od 1 roku).
                    </li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-3 text-white">
                    3. Kaucja Gwarancyjna
                </h2>
                <ul className="list-disc list-inside ml-4 space-y-2 mb-4">
                    <li>
                        Wysokość Kaucji: Najemca zobowiązany jest do wpłaty zwrotnej Kaucji Gwarancyjnej w stałej wysokości 1000 PLN.
                    </li>
                    <li>
                        Cel Kaucji: Zabezpieczenie na pokrycie ewentualnych szkód, brakującego paliwa, mandatów lub innych opłat dodatkowych.
                    </li>
                    <li>
                        Płatność Kaucji: Kaucja jest płatna gotówką w dniu odbioru Pojazdu.
                    </li>
                    <li>
                        Zwrot Kaucji: Kaucja jest zwracana (lub odblokowywana) w terminie do 14 dni roboczych od daty zwrotu Pojazdu, po pozytywnym Protokołach Zdawczo-Odbiorczym.
                    </li>
                </ul>
                
                <h2 className="text-2xl font-semibold mt-6 mb-3 text-white">
                    4. Anulowanie Rezerwacji i Zwroty
                </h2>
                <ul className="list-disc list-inside ml-4 space-y-2 mb-4">
                    <li>
                        Anulowanie Płatności: Płatność za rezerwację jest wiążąca. W przypadku rezygnacji, obowiązują następujące zasady zwrotu opłaty za najem:
                        <ul className="list-circle list-inside ml-6">
                            <li>Rezygnacja na więcej niż 30 dni przed odbiorem: Zwrot 100% opłaty za najem.</li>
                            <li>Rezygnacja od 14 do 30 dni przed odbiorem: Zwrot 50% opłaty za najem.</li>
                            <li>Rezygnacja na mniej niż 14 dni przed odbiorem: Opłata za najem nie podlega zwrotowi.</li>
                        </ul>
                    </li>
                    <li>
                        Wygaśnięcie Wstępnej Rezerwacji: Jeśli płatność nie zostanie dokonana w wyznaczonym czasie, Wstępna Rezerwacja wygasa, a termin staje się dostępny dla innych Najemców.
                    </li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-3 text-white">
                    5. Postanowienia Końcowe
                </h2>
                <p className="mb-4">
                    W sprawach nieuregulowanych niniejszym Regulaminem mają zastosowanie przepisy prawa polskiego, w szczególności Kodeksu Cywilnego. Wszelkie spory będą rozstrzygane przez sąd właściwy dla siedziby Wynajmującego.
                </p>

                <div className="border-t border-gray-600 mt-8 pt-4 text-center text-gray-400">
                    <p>Autoserwis Berezowscy – dbamy o Twoje bezpieczeństwo i jasne zasady najmu.</p>
                </div>
            </div>
        </main>
    );
};

export default TermsAndConditions;