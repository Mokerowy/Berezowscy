// src/components/Header.tsx
import React, { useState } from "react";
import logo from "../assets/logo.webp";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full h-[100px] bg-[linear-gradient(90deg,rgb(75,71,71)_0%,#1a1919_60%)] shadow-[0px_0px_15px_5px_#000000,inset_0px_0px_15px_5px_#000000] flex justify-between items-center px-4 md:px-8 z-50">
           {" "}
      <div className="logo">
               {" "}
        <a href="/">
                    <img src={logo} alt="Logo firmy" className="h-[100px]" />   
             {" "}
        </a>
             {" "}
      </div>
           {" "}
      <nav className="flex items-center flex-nowrap">
               {" "}
        <button
          className="lg:hidden bg-transparent border-none cursor-pointer p-2.5 z-[1001]"
          aria-label="Przełącz menu nawigacji"
          onClick={() => setIsOpen(!isOpen)}
        >
                   {" "}
          <span
            className="block w-[25px] h-[3px] bg-white my-1 transition-all duration-300 ease-in-out"
            style={{
              transform: isOpen ? "rotate(45deg) translate(5px, 5px)" : "",
            }}
          ></span>
                   {" "}
          <span
            className="block w-[25px] h-[3px] bg-white my-1 transition-all duration-300 ease-in-out"
            style={{ opacity: isOpen ? 0 : 1 }}
          ></span>
                   {" "}
          <span
            className="block w-[25px] h-[3px] bg-white my-1 transition-all duration-300 ease-in-out"
            style={{
              transform: isOpen ? "rotate(-45deg) translate(5px, -5px)" : "",
            }}
          ></span>
                 {" "}
        </button>
               {" "}
        <ul
          className={`
            fixed top-[100px] left-0 h-screen w-full bg-[#2c2c2c] z-50 transform transition-transform duration-300 ease-in-out
            flex flex-col items-center justify-center space-y-6 text-2xl lg:static lg:flex-row lg:space-y-0 lg:space-x-4 lg:text-xl lg:bg-transparent lg:h-auto lg:p-0 lg:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full hidden"} lg:flex
          `}
        >
                   {" "}
          <li>
            <a
              href="/"
              className="text-[rgb(202,202,202)] text-[1.5rem] font-bold no-underline py-2 px-4 block transition-colors duration-300 rounded-md hover:bg-[#a7a0a048]"
            >
              Strona Główna
            </a>
          </li>
                   {" "}
          <li
            className="dropdown relative group"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
                       {" "}
            <a
              href="#"
              className="dropbtn text-[rgb(202,202,202)] text-[1.5rem] font-bold no-underline py-2 px-4 block transition-colors duration-300 rounded-md hover:bg-[#a7a0a048]"
            >
              Nasze Usługi
            </a>
                       {" "}
            <div
              className={`dropdown-content absolute min-w-[200px] z-10 shadow-[0px_8px_16px_0px_rgba(0,0,0,0.2)] rounded-md bg-[#3e3e3e] transition-all duration-300 ease-in-out ${
                isDropdownOpen ? "block" : "hidden"
              } lg:group-hover:block`}
            >
                           {" "}
              <a
                href="/blacharstwo-i-lakiernictwo"
                className="block px-4 py-3 text-white no-underline transition-colors duration-300 hover:bg-[#d9534f]"
              >
                Blacharstwo i Lakiernictwo
              </a>
                           {" "}
              <a
                href="/mechanika-samochodowa"
                className="block px-4 py-3 text-white no-underline transition-colors duration-300 hover:bg-[#d9534f]"
              >
                Mechanika Samochodowa
              </a>
                           {" "}
              <a
                href="/wulkanizacja-i-klimatyzacja"
                className="block px-4 py-3 text-white no-underline transition-colors duration-300 hover:bg-[#d9534f]"
              >
                Wulkanizacja i Klimatyzacja
              </a>
                           {" "}
              <a
                href="/pomoc-drogowa"
                className="block px-4 py-3 text-white no-underline transition-colors duration-300 hover:bg-[#d9534f]"
              >
                Pomoc Drogowa
              </a>
                         {" "}
            </div>
                     {" "}
          </li>
                   {" "}
          <li>
            <a
              href="/wynajem-busow"
              className="text-[rgb(202,202,202)] text-[1.5rem] font-bold no-underline py-2 px-4 block transition-colors duration-300 rounded-md hover:bg-[#a7a0a048]"
            >
              Wynajem Busów
            </a>
          </li>
                   {" "}
          <li>
            <a
              href="#contact"
              className="text-[rgb(202,202,202)] text-[1.5rem] font-bold no-underline py-2 px-4 block transition-colors duration-300 rounded-md hover:bg-[#a7a0a048]"
            >
              Kontakt
            </a>
          </li>
                 {" "}
        </ul>
             {" "}
      </nav>
         {" "}
    </header>
  );
};

export default Header;
