// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import BusRental from "./pages/BusRental";
import CarMechanics from "./pages/CarMechanics";
import BodyAndPaintShop from './pages/BodyAndPaintShop';
import RoadsideAssistance from './pages/RoadsideAssistance' ;
import TiresAndAC from './pages/TiresAndAC';
import "./index.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="font-sans text-[#ddd] bg-[#161616fd] min-h-screen pt-[80px]">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <MainContent />
              </>
            }
          />

          <Route path="/wynajem-busow" element={<BusRental />} />
          <Route path="/mechanika-samochodowa" element={<CarMechanics />} />
           <Route path="/blacharstwo-i-lakiernictwo" element={<BodyAndPaintShop />} />
           <Route path="/pomoc-drogowa" element={<RoadsideAssistance />} />
           <Route path="/wulkanizacja-i-klimatyzacja" element={<TiresAndAC />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
