// src/pages/TiresAndAC.tsx
import React from "react";
import tiresAndAC from "../assets/wheel.webp";

const TiresAndAC: React.FC = () => {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-8"
      style={{
        backgroundImage: `url(${tiresAndAC})`,
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
            Wulkanizacja i Klimatyzacja
          </h1>
          <p className="text-lg sm:text-xl text-[#eee] max-w-2xl mx-auto">
            Dbamy o Twoje **bezpieczeństwo na drodze** oraz o **komfort jazdy**.
            Nasze usługi wulkanizacji i serwis klimatyzacji to gwarancja, że
            Twój pojazd jest zawsze w najlepszej kondycji, niezależnie od pory
            roku.
          </p>
        </section>

        <section className="bg-[#1c1c1c] bg-opacity-90 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <article className="bg-[#2a2a2a] p-6 rounded-lg shadow-md border border-[#444] transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-white text-2xl font-semibold mb-4 border-b border-[#555] pb-2">
                Wulkanizacja
              </h3>
              <ul className="list-disc list-inside text-[#bbb] space-y-2">
                <li className="service-list-item">
                  Szybka i precyzyjna **wymiana i wyważanie kół**
                </li>
                <li className="service-list-item">
                  Sprzedaż opon nowych i używanych, dopasowanych do Twoich
                  potrzeb
                </li>
                <li className="service-list-item">
                  Wygodna **przechowalnia opon**
                </li>
                <li className="service-list-item">
                  Profesjonalna naprawa uszkodzonych opon
                </li>
              </ul>
            </article>
            <article className="bg-[#2a2a2a] p-6 rounded-lg shadow-md border border-[#444] transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-white text-2xl font-semibold mb-4 border-b border-[#555] pb-2">
                Klimatyzacja
              </h3>
              <ul className="list-disc list-inside text-[#bbb] space-y-2">
                <li className="service-list-item">
                  Kompleksowy serwis i **napełnianie układów klimatyzacji**
                </li>
                <li className="service-list-item">
                  Dokładne **odgrzybianie i dezynfekcja** dla zdrowego powietrza
                </li>
                <li className="service-list-item">
                  Naprawa i wymiana przewodów oraz kompresorów
                </li>
              </ul>
            </article>
          </div>
          <a
            href="#contact"
            className="block w-full text-center bg-[#ff6347] hover:bg-[#e6503c] text-white font-bold py-4 px-6 rounded-full text-xl transition-colors duration-300 ease-in-out mt-8"
          >
            Umów się na wizytę
          </a>
        </section>

        <section
          id="contact"
          className="bg-[#1c1c1c] bg-opacity-90 p-8 rounded-xl shadow-2xl backdrop-blur-sm text-[#ddd] text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-white">
            Chcesz zadbać o swoje opony i klimatyzację?
          </h2>
          <p className="mb-2 text-lg">
            Skontaktuj się z nami, aby umówić wizytę i zyskać komfort jazdy.
          </p>
          <p className="mb-2 text-xl font-bold">
            <span className="text-[#ff6347]">Telefon:</span>{" "}
            <a href="tel:123456789" className="text-white hover:underline">
              123-456-789
            </a>
          </p>
          <p className="text-lg">
            <span className="text-[#ff6347]">Adres:</span> ul. Przykładowa 10,
            00-001 Miasto
          </p>
        </section>
      </main>
    </div>
  );
};

export default TiresAndAC;
