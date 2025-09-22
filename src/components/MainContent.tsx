// src/components/MainContent.tsx
import React from 'react';
import silverBus from '../assets/silverBus.webp';
import wheel from '../assets/wheel.webp';
import lawety from "../assets/dwie-lawety.webp"
import lakierowanie from "../assets/lakierowane-auto.webp"
import busy from "../assets/busy-do-wynajecia.webp"
import holowanie from "../assets/holowanie-turek.webp"
import holowanieTirow from "../assets/holowanie-tirow.webp"
import lawetaKonin from "../assets/laweta-konin.webp"


// Typ dla kart "Dlaczego my?"
interface WhyUsCard {
  title: string;
  description: string;
  icon: string;
}

// Dane dla sekcji "Dlaczego my?"
const WHY_US_CARDS: WhyUsCard[] = [
  {
    title: 'Doświadczenie',
    description: 'Ponad 30 lat na rynku to gwarancja wiedzy i umiejętności. Znamy się na samochodach jak nikt inny!',
    icon: '🔧',
  },
  {
    title: 'Profesjonalizm',
    description: 'Nasz zespół to wykwalifikowani specjaliści, którzy regularnie podnoszą swoje kwalifikacje.',
    icon: '🎓',
  },
  {
    title: 'Kompleksowość',
    description: 'Zapewniamy pełen zakres usług - od drobnej naprawy po pomoc drogową, wszystko w jednym miejscu.',
    icon: '⚙️',
  },
];

const GALLERY_IMAGE_URLS = [
  silverBus,
  wheel,
  lawety,
  lakierowanie,
  busy,
  holowanie,
  holowanieTirow,
  lawetaKonin,
];

// Wydzielony komponent dla karty "Dlaczego my?"
const WhyUsCardComponent: React.FC<WhyUsCard> = ({ title, description, icon }) => (
  <article
    className="bg-black/50 text-white p-6 rounded-xl backdrop-blur-sm shadow-xl flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl border border-red-500 max-w-xs mx-2 mb-4"
  >
    <div className="text-4xl mb-4 text-red-500">{icon}</div>
    <h3 className="font-bold text-xl md:text-2xl mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </article>
);

const MainContent: React.FC = () => {
  return (
    <main className="main-content-container text-white font-sans w-screen overflow-hidden">
      {/* O nas Section */}
      <section 
        id="about-us" 
        className="page-section mb-16 rounded-lg p-8 md:p-12 shadow-2xl bg-gradient-to-br from-black/50 to-black/30"
      >
        <h2 className="section-title text-3xl md:text-5xl font-extrabold text-center mb-6 text-red-500">O nas</h2>
        <p className="text-center text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
          Jesteśmy firmą z wieloletnią tradycją,{' '}
          <strong className="font-extrabold underline text-red-400">działającą nieprzerwanie od 1989 roku</strong>. Zbudowaliśmy naszą reputację na rzetelności, profesjonalizmie i pasji do motoryzacji. Przez te wszystkie lata zaufały nam tysiące klientów, a my wciąż się rozwijamy, aby sprostać najnowszym wyzwaniom branży.
        </p>
      </section>
      


      {/* Dlaczego my? Section */}
      <section 
        id="why-us" 
        className="page-section mb-16 p-8 md:p-12 rounded-lg shadow-2xl bg-gradient-to-br from-black/50 to-black/30"
      >
        <h2 className="section-title text-3xl md:text-5xl font-extrabold text-center mb-10 text-red-500">Dlaczego my?</h2>
        <div className="flex justify-center gap-6 md:gap-8 flex-wrap">
          {WHY_US_CARDS.map((card, index) => (
            <WhyUsCardComponent key={index} {...card} />
          ))}
        </div>
      </section>


      {/* Galeria Section */}
      <section 
        id="gallery" 
        className="page-section mb-16 rounded-lg p-8 md:p-12 shadow-2xl bg-gradient-to-br from-black/50 to-black/30"
      >
        <h2 className="section-title text-3xl md:text-5xl font-extrabold text-center mb-10 text-red-500">Nasza Galeria</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {GALLERY_IMAGE_URLS.map((src, index) => (
            <a href={src} key={index} target="_blank" rel="noopener noreferrer" className="block transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <img
                src={src}
                alt={`Zdjęcie z warsztatu ${index + 1}`}
                className="w-full h-48 rounded-lg shadow-xl object-cover border border-gray-700"
              />
            </a>
          ))}
        </div>
        <p className="italic text-gray-400 text-center mt-8 text-sm">
          W naszej galerii znajdziesz zdjęcia zrealizowanych projektów oraz wnętrza naszego warsztatu.
        </p>
      </section>



      {/* Kontakt Section */}
      <section 
        id="contact" 
        className="page-section text-center rounded-lg p-8 md:p-12 shadow-2xl bg-gradient-to-br from-black/50 to-black/30"
      >
        <h2 className="section-title text-3xl md:text-5xl font-extrabold mb-6 text-red-500">Kontakt</h2>
        <p className="text-lg">Zadzwoń do nas lub odwiedź nasz warsztat, jesteśmy do Twojej dyspozycji.</p>
        <p className="mt-4 text-2xl font-bold">
          <a href="tel:123-456-789" className="text-red-400 hover:text-red-300 transition-colors duration-300">📞 123-456-789</a>
        </p>
        <p className="text-lg mt-2">
          <strong>Adres:</strong> ul. Przykładowa 10, 00-001 Miasto
        </p>
      </section>
    </main>
  );
};

export default MainContent;