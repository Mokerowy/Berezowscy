
import React from "react";
import carMechanic from "../assets/mechanic.webp";
import { useContact } from "../context/ContactContext";

const CarMechanics: React.FC = () => {
  const { telefon, telefonUrl, adres, adresUrl } = useContact();
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-8"
      style={{
        backgroundImage: `url(${carMechanic})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-70" />

      <main className="relative z-10 w-full max-w-5xl space-y-10 my-12">
        <section
          className="bg-opacity-70 p-8 rounded-xl text-center shadow-2xl backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
          }}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white mb-4">
            Mechanika Samochodowa
          </h1>
          <p className="text-lg sm:text-xl text-[#eee] max-w-2xl mx-auto">
            Oferujemy pełen zakres usług mechanicznych, od diagnostyki
            komputerowej po skomplikowane naprawy silników. Zaufaj naszemu
            doświadczeniu i ciesz się bezpieczną jazdą.
          </p>
        </section>

        <section className="bg-[#1c1c1c] bg-opacity-90 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <article className="bg-[#2a2a2a] p-6 rounded-lg shadow-md border border-[#444] transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-white text-2xl font-semibold mb-4 border-b border-[#555] pb-2">
                Przeglądy i Diagnostyka
              </h3>
              <ul className="list-none list-inside text-[#bbb] space-y-2">
                {" "}
                {/* Zmieniono list-disc na list-none */}
                <li className="service-list-item">Diagnostyka komputerowa</li>
                <li className="service-list-item">
                  Kompleksowe przeglądy okresowe i posezonowe
                </li>
                <li className="service-list-item">
                  Przygotowanie pojazdu do przeglądu technicznego
                </li>
              </ul>
            </article>
            <article className="bg-[#2a2a2a] p-6 rounded-lg shadow-md border border-[#444] transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-white text-2xl font-semibold mb-4 border-b border-[#555] pb-2">
                Naprawy i Wymiany
              </h3>
              <ul className="list-none list-inside text-[#bbb] space-y-2">
                {" "}
                {/* Zmieniono list-disc na list-none */}
                <li className="service-list-item">
                  Naprawa układu hamulcowego i zawieszenia
                </li>
                <li className="service-list-item">
                  Szybka wymiana oleju i filtrów
                </li>
                <li className="service-list-item">
                  Profesjonalna naprawa układu wydechowego
                </li>
                <li className="service-list-item">
                  Naprawy silników i skrzyń biegów
                </li>
              </ul>
            </article>
          </div>
         
        </section>

        <section
          id="contact"
          className="bg-[#1c1c1c] bg-opacity-90 p-8 rounded-xl shadow-2xl backdrop-blur-sm text-[#ddd] text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-white">
            Potrzebujesz pomocy? Skontaktuj się z nami!
          </h2>
          <p className="mb-2 text-lg">
            Zadzwoń do nas, a nasz zespół ekspertów odpowie na Twoje pytania.
          </p>
          <p className="mb-2 text-xl font-bold">
            <span className="text-[#ff6347]">Telefon:</span>{" "}
            <a href={telefonUrl} className="text-white hover:underline">
              {telefon}
            </a>
          </p>
          <p className="text-lg">
            <span className="text-[#ff6347]">Adres:</span>{" "}
            <a href={adresUrl} target="_blank" rel="noopener noreferrer">
              {adres}
            </a>
          </p>
        </section>
      </main>
    </div>
  );
};

export default CarMechanics;
