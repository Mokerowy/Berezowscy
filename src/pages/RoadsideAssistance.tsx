
import React from 'react';
import carTransporter from "../assets/carTransporter.webp";

import { useContact } from '../context/ContactContext'; 

const RoadsideAssistance: React.FC = () => {
 
    const { telefon, telefonUrl, adres, adresUrl,} = useContact();
    
    return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-8"
      style={{
        backgroundImage: `url(${carTransporter})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        className="absolute inset-0 bg-black opacity-70"
      />

      <main className="relative z-10 w-full max-w-5xl space-y-10 my-12">
        
        <section
          className="bg-opacity-70 p-8 rounded-xl text-center shadow-2xl backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: '#fff',
          }}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white mb-4">
            Pomoc Drogowa
          </h1>
          <p className="text-lg sm:text-xl text-[#eee] max-w-2xl mx-auto">
            Jesteśmy dostępni 24 godziny na dobę, 7 dni w tygodniu, aby zapewnić Ci szybką i profesjonalną pomoc na drodze. Bez względu na to, czy Twój pojazd uległ awarii, czy uczestniczył w kolizji, możesz na nas liczyć.
          </p>
        </section>

        <section className="bg-[#1c1c1c] bg-opacity-90 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <article className="bg-[#2a2a2a] p-6 rounded-lg shadow-md border border-[#444] transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-white text-2xl font-semibold mb-4 border-b border-[#555] pb-2">Nasze Usługi Holowania</h3>
              <ul className="list-none list-inside text-[#bbb] space-y-2"> 
                <li className="service-list-item">Holowanie samochodów osobowych i dostawczych</li>
                <li className="service-list-item">Holowanie pojazdów ciężarowych</li>
                <li className="service-list-item">Wyciąganie pojazdów z rowów</li>
                <li className="service-list-item">Transport pojazdów uszkodzonych i po wypadkach</li>
              </ul>
            </article>
            <article className="bg-[#2a2a2a] p-6 rounded-lg shadow-md border border-[#444] transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-white text-2xl font-semibold mb-4 border-b border-[#555] pb-2">Dodatkowe Usługi</h3>
              <ul className="list-none list-inside text-[#bbb] space-y-2"> 
                <li className="service-list-item">Drobne naprawy na miejscu (np. wymiana koła)</li>
                <li className="service-list-item">Dowóz paliwa</li>
                <li className="service-list-item">Awaryjne otwieranie pojazdów</li>
              </ul>
            </article>
          </div>
          <a href={telefonUrl} className="block w-full text-center bg-[#ff6347] hover:bg-[#e6503c] text-white font-bold py-4 px-6 rounded-full text-xl transition-colors duration-300 ease-in-out mt-8">
            Zadzwoń po pomoc (24/7)
          </a>
        </section>

        <section id="contact" className="bg-[#1c1c1c] bg-opacity-90 p-8 rounded-xl shadow-2xl backdrop-blur-sm text-[#ddd] text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Potrzebujesz natychmiastowej pomocy?</h2>
          <p className="mb-2 text-lg">Jesteśmy dostępni przez całą dobę. Skontaktuj się z nami!</p>
          <p className="mb-2 text-xl font-bold">
            <span className="text-[#ff6347]">Telefon:</span> <a href={telefonUrl} className="text-white hover:underline">{telefon}</a>
          </p>
          <p className="text-lg">
            <span className="text-[#ff6347]">Adres:</span> <a href={adresUrl} target="_blank" rel="noopener noreferrer">{adres}</a>
          </p>
        </section>
      </main>
    </div>
  );
};

export default RoadsideAssistance;