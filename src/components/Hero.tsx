// src/components/Hero.tsx
import React from "react";
import heroImage from "../assets/HeroImage.png";

const Hero: React.FC = () => {
  return (
    <section className="hero bg-[#0f0f0f] h-[90vh] flex justify-center items-center pt-[100px] md:pt-[100px] shadow-[inset_0px_0px_15px_5px_#000000]">
      <div
        className="heroImage w-[95%] h-[80%] bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.5)),url(heroImage)] bg-cover bg-center bg-no-repeat rounded-xl text-center text-[rgb(221,220,220)] p-8 shadow-[inset_0px_0px_10px_5px_#000000] flex flex-col justify-center items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.5)), url(${heroImage})`,
        }}
      >
        <h1 className="text-2xl md:text-[2.5rem] lg:text-[3rem] font-bold mb-4">
          Twój Warsztat - Kompleksowa Obsługa Samochodów
        </h1>
        <ul className="list-none p-0 mt-5 flex justify-center items-center flex-wrap gap-2.5">
          <li className="text-[1rem] md:text-[1.5rem] lg:text-[2rem] whitespace-nowrap after:content-['+'] after:ml-2.5">
            Blacharstwo
          </li>
          <li className="text-[1rem] md:text-[1.5rem] lg:text-[2rem] whitespace-nowrap after:content-['+'] after:ml-2.5">
            Lakiernictwo
          </li>
          <li className="text-[1rem] md:text-[1.5rem] lg:text-[2rem] whitespace-nowrap after:content-['+'] after:ml-2.5">
            Mechanika
          </li>
          <li className="text-[1rem] md:text-[1.5rem] lg:text-[2rem] whitespace-nowrap after:content-['+'] after:ml-2.5">
            Wulkanizacja
          </li>
          <li className="text-[1rem] md:text-[1.5rem] lg:text-[2rem] whitespace-nowrap after:content-['+'] after:ml-2.5">
            Klimatyzacja
          </li>
          <li className="text-[1rem] md:text-[1.5rem] lg:text-[2rem] whitespace-nowrap">
            Pomoc Drogowa
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Hero;
