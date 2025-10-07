import React from "react";
import silverBus from "../assets/silverBus.webp";
import wheel from "../assets/wheel.webp";
import lawety from "../assets/dwie-lawety.webp";
import lakierowanie from "../assets/lakierowane-auto.webp";
import busy from "../assets/busy-do-wynajecia.webp";
import holowanie from "../assets/holowanie-turek.webp";
import holowanieTirow from "../assets/holowanie-tirow.webp";
import lawetaKonin from "../assets/laweta-konin.webp";
import { useContact } from "../context/ContactContext";

interface WhyUsCard {
  title: string;
  description: string;
  icon: string;
}

const WHY_US_CARDS: WhyUsCard[] = [
  {
    title: "Doświadczenie",
    description:
      "Ponad 30 lat na rynku to gwarancja wiedzy i umiejętności. Znamy się na samochodach jak nikt inny!",
    icon: "🔧",
  },
  {
    title: "Profesjonalizm",
    description:
      "Nasz zespół to wykwalifikowani specjaliści, którzy regularnie podnoszą swoje kwalifikacje.",
    icon: "🎓",
  },
  {
    title: "Kompleksowość",
    description:
      "Zapewniamy pełen zakres usług - od drobnej naprawy po pomoc drogową, wszystko w jednym miejscu.",
    icon: "⚙️",
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

const WhyUsCardComponent: React.FC<WhyUsCard> = ({
  title,
  description,
  icon,
}) => (
  <article className="bg-black/50 text-white p-6 rounded-xl backdrop-blur-sm shadow-xl flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl border border-red-500 max-w-xs mx-2 mb-4">
        <div className="text-4xl mb-4 text-red-500">{icon}</div>   {" "}
    <h3 className="font-bold text-xl md:text-2xl mb-2">{title}</h3>   {" "}
    <p className="text-gray-300">{description}</p> {" "}
  </article>
);

const MainContent: React.FC = () => {
  const { telefon, telefonUrl, adres, adresUrl, email, emailUrl } =
    useContact();

  return (
    <main className="main-content-container text-white font-sans w-screen overflow-hidden">
               {" "}
      <section
        id="about-us"
        className="page-section mb-16 rounded-lg p-8 md:p-12 shadow-2xl bg-gradient-to-br from-black/50 to-black/30"
      >
               {" "}
        <h2 className="section-title text-3xl md:text-5xl font-extrabold text-center mb-6 text-red-500">
          O nas
        </h2>
               {" "}
        <p className="text-center text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                    Jesteśmy firmą z wieloletnią tradycją,{" "}
          <strong className="font-extrabold text-red-400">
            działającą nieprzerwanie od 1989 roku
          </strong>
          . Zbudowaliśmy naszą reputację na rzetelności, profesjonalizmie i
          pasji do motoryzacji. Przez te wszystkie lata zaufały nam tysiące
          klientów, a my wciąż się rozwijamy, aby sprostać najnowszym wyzwaniom
          branży.        {" "}
        </p>
             {" "}
      </section>
                      {" "}
      <section
        id="why-us"
        className="page-section mb-16 p-8 md:p-12 rounded-lg shadow-2xl bg-gradient-to-br from-black/50 to-black/30"
      >
               {" "}
        <h2 className="section-title text-3xl md:text-5xl font-extrabold text-center mb-10 text-red-500">
          Dlaczego my?
        </h2>
               {" "}
        <div className="flex justify-center gap-6 md:gap-8 flex-wrap">
                   {" "}
          {WHY_US_CARDS.map((card, index) => (
            <WhyUsCardComponent key={index} {...card} />
          ))}
                 {" "}
        </div>
             {" "}
      </section>
                {" "}
      <section
        id="gallery"
        className="page-section mb-16 rounded-lg p-8 md:p-12 shadow-2xl bg-gradient-to-br from-black/50 to-black/30"
      >
               {" "}
        <h2 className="section-title text-3xl md:text-5xl font-extrabold text-center mb-10 text-red-500">
          Nasza Galeria
        </h2>
               {" "}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                   {" "}
          {GALLERY_IMAGE_URLS.map((src, index) => (
            <a
              href={src}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              className="block transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
                           {" "}
              <img
                src={src}
                alt={`Zdjęcie z warsztatu ${index + 1}`}
                className="w-full h-48 rounded-lg shadow-xl object-cover border border-gray-700"
              />
                         {" "}
            </a>
          ))}
                 {" "}
        </div>
               {" "}
        <p className="italic text-gray-400 text-center mt-8 text-sm">
                    W naszej galerii znajdziesz zdjęcia zrealizowanych projektów
          oraz wnętrza naszego warsztatu.        {" "}
        </p>
             {" "}
      </section>
                 {" "}
      <section
        id="contact"
        className="page-section text-center rounded-3xl max-w-7xl mx-auto p-10 md:p-24 shadow-2xl bg-gray-950/90 border border-red-700/50 text-white overflow-hidden"
      >
        <h2 className="section-title text-5xl md:text-7xl font-extrabold mb-10 uppercase tracking-widest text-red-500 ">
          KONTAKT Z NAMI
        </h2>
        <p className="text-xl font-light text-gray-400 max-w-3xl mx-auto mb-10">
          Twój samochód jest w dobrych rękach. Skontaktuj się z nami, aby szybko
          i sprawnie umówić termin naprawy lub uzyskać wycenę.
        </p>

        <div className="max-w-xl mx-auto divide-y divide-red-600/50">
          <div className="contact-item py-6 transition-all duration-500 transform hover:bg-red-600/10 hover:shadow-2xl">
            <p className="text-2xl uppercase font-semibold text-red-400 mb-1">
              Zadzwoń do Nas
            </p>
            <a
              href={telefonUrl}
              className="text-3xl font-black text-white tracking-wide hover:text-red-300 transition-colors duration-300 block"
            >
              {telefon}
            </a>
          </div>

        
          <div className="contact-item py-6 transition-all duration-500 transform hover:bg-red-600/10 hover:shadow-2xl">
            <p className="text-2xl uppercase font-semibold text-red-400 mb-1">
              Wyślij E-mail
            </p>
            <a
              href={emailUrl}
              className="text-2xl font-semibold text-gray-200 hover:text-red-300 transition-colors duration-300 break-all block"
            >
              {email}
            </a>
          </div>

          <a
            href={adresUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item py-6 transition-all duration-500 transform hover:bg-red-600/10 hover:shadow-2xl block"
          >
            <p className="text-2xl uppercase font-semibold text-red-400 mb-1">
              Adres Warsztatu
            </p>
            <p className="text-2xl font-semibold text-gray-200 underline">
              {adres}
            </p>
          </a>
        </div>

        <p className="mt-16 text-lg font-normal text-gray-500 border-t border-gray-700/50 pt-8">
          Godziny pracy: Poniedziałek – Piątek:{" "}
          <span className="text-red-400 font-semibold">8:00 – 15:00</span>
        </p>
      </section>
         {" "}
    </main>
  );
};

export default MainContent;
