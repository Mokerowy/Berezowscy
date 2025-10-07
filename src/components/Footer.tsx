import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2c2c2c] text-white p-4 mt-12 text-sm">
      
     
      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-center items-center space-x-3 sm:space-x-4">
        
   
        <span className="font-bold whitespace-nowrap">Informacje Prawne</span>
        
       
        <span className="hidden sm:inline">·</span> 
        
       
        <Link 
          to="/polityka-prywatnosci" 
          className="hover:text-[#c9302c] transition duration-200 whitespace-nowrap"
        >
          Polityka Prywatności
        </Link>
        
        <span className="hidden sm:inline">·</span>
        
   
        <Link 
          to="/regulamin" 
          className="hover:text-[#c9302c] transition duration-200 whitespace-nowrap"
        >
          Regulamin
        </Link>
        
        <span className="hidden sm:inline">·</span>
        
       
        <span className="text-gray-400 whitespace-nowrap">
          &copy; 2025 CanvesiDigital. Wszelkie prawa zastrzeżone.
        </span>
        
      </div>
    </footer>
  );
};

export default Footer;