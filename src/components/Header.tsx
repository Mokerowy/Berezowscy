// src/components/Header.tsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.webp";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  

  const navRef = useRef<HTMLElement>(null); 

  const ulRef = useRef<HTMLUListElement>(null); 


  const handleLinkClick = () => {
    setIsOpen(false);
    setIsDropdownOpen(false); 
  };
  
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
    
      if (
        isOpen && 
        navRef.current && 
        !navRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsDropdownOpen(false);
      }
    };


    document.addEventListener("mousedown", handleClickOutside);

   
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]); 
  
 
  const handleUlClick = (event: React.MouseEvent<HTMLUListElement>) => {
    
    if (event.target === ulRef.current) {
        setIsOpen(false);
        setIsDropdownOpen(false);
    }
  };


  const mobileMenuClasses = `
    fixed top-[100px] left-0 h-screen w-full bg-[#2c2c2c] z-50 transform transition-transform duration-300 ease-in-out
    flex flex-col items-center justify-start pt-10 space-y-4 text-2xl lg:static lg:flex-row lg:space-y-0 lg:space-x-4 lg:text-xl lg:bg-transparent lg:h-auto lg:p-0 lg:translate-x-0
    ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:flex
  `;
  

  const commonLinkClasses = "text-[rgb(202,202,202)] text-[1.5rem] font-bold no-underline py-2 px-4 block transition-colors duration-300 rounded-md hover:bg-[#a7a0a048]";

  return (
    <header className="fixed top-0 w-full h-[100px] bg-[linear-gradient(90deg,rgb(75,71,71)_0%,#1a1919_60%)] shadow-[0px_0px_15px_5px_#000000,inset_0px_0px_15px_5px_#000000] flex justify-between items-center px-4 md:px-8 z-50">
      <div className="logo">
        <Link to="/" onClick={handleLinkClick}>
          <img src={logo} alt="Logo firmy" className="h-[100px]" />
        </Link>
      </div>
      <nav className="flex items-center flex-nowrap" ref={navRef}> 
        <button
          className="lg:hidden bg-transparent border-none cursor-pointer p-2.5 z-[1001]"
          aria-label="Przełącz menu nawigacji"
          onClick={() => setIsOpen(!isOpen)}
        >
      
          <span
            className="block w-[25px] h-[3px] bg-white my-1 transition-all duration-300 ease-in-out"
            style={{
              transform: isOpen ? "rotate(45deg) translate(5px, 5px)" : "",
            }}
          ></span>
          <span
            className="block w-[25px] h-[3px] bg-white my-1 transition-all duration-300 ease-in-out"
            style={{ opacity: isOpen ? 0 : 1 }}
          ></span>
          <span
            className="block w-[25px] h-[3px] bg-white my-1 transition-all duration-300 ease-in-out"
            style={{
              transform: isOpen ? "rotate(-45deg) translate(5px, -5px)" : "",
            }}
          ></span>
        </button>
     
        <ul 
          className={mobileMenuClasses}
          ref={ulRef} 
          onClick={handleUlClick} 
        >
       
          <li>
            <Link
              to="/"
              className={commonLinkClasses} 
              onClick={handleLinkClick} 
            >
              Strona Główna
            </Link>
          </li>
          
        
          <li className="lg:hidden">
            <Link
              to="/blacharstwo-i-lakiernictwo"
              className={commonLinkClasses} 
              onClick={handleLinkClick}
            >
              Lakiernictwo
            </Link>
          </li>
          <li className="lg:hidden">
            <Link
              to="/mechanika-samochodowa"
              className={commonLinkClasses} 
              onClick={handleLinkClick}
            >
              Mechanika
            </Link>
          </li>
          <li className="lg:hidden">
            <Link
              to="/wulkanizacja-i-klimatyzacja"
              className={commonLinkClasses} 
              onClick={handleLinkClick}
            >
              Wulkanizacja
            </Link>
          </li>
          <li className="lg:hidden">
            <Link
              to="/pomoc-drogowa"
              className={commonLinkClasses} 
              onClick={handleLinkClick}
            >
              Pomoc Drogowa
            </Link>
          </li>
          
          
          <li
            className="dropdown relative group hidden lg:block"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <a
              href="#"
              className={commonLinkClasses + " cursor-default"} 
            >
              Nasze Usługi
            </a>
            <div
              className={`dropdown-content absolute min-w-[250px] z-10 shadow-[0px_8px_16px_0px_rgba(0,0,0,0.2)] rounded-md bg-[#3e3e3e] transition-all duration-300 ease-in-out 
                ${isDropdownOpen ? "block" : "hidden"} group-hover:block top-full left-1/2 lg:left-0 transform lg:transform-none -translate-x-1/2 lg:-translate-x-0 mt-2 lg:mt-0`}
            >
              
              <Link to="/blacharstwo-i-lakiernictwo" className="block px-4 py-3 text-white no-underline transition-colors duration-300 hover:bg-[#d9534f]" onClick={handleLinkClick}>Blacharstwo i Lakiernictwo</Link>
              <Link to="/mechanika-samochodowa" className="block px-4 py-3 text-white no-underline transition-colors duration-300 hover:bg-[#d9534f]" onClick={handleLinkClick}>Mechanika Samochodowa</Link>
              <Link to="/wulkanizacja-i-klimatyzacja" className="block px-4 py-3 text-white no-underline transition-colors duration-300 hover:bg-[#d9534f]" onClick={handleLinkClick}>Wulkanizacja i Klimatyzacja</Link>
              <Link to="/pomoc-drogowa" className="block px-4 py-3 text-white no-underline transition-colors duration-300 hover:bg-[#d9534f]" onClick={handleLinkClick}>Pomoc Drogowa</Link>
            </div>
          </li>
          
          
          <li>
            <Link
              to="/wynajem-busow"
              className={commonLinkClasses} 
              onClick={handleLinkClick}
            >
              Wynajem Busów
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;