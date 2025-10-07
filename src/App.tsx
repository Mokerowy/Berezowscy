// src/App.tsx

import React, { lazy, Suspense } from "react"; 
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"; 

// 👈 Importuj ContactProvider
import { ContactProvider } from "./context/ContactContext"; 

import Header from "./components/Header";
import Hero from "./components/Hero";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import "./index.css";

// === DYNAMICZNE IMPORTOWANIE KOMPONENTÓW ===
const LazyBusRental = lazy(() => import("./pages/BusRental"));
const LazyCarMechanics = lazy(() => import("./pages/CarMechanics"));
const LazyBodyAndPaintShop = lazy(() => import('./pages/BodyAndPaintShop'));
const LazyRoadsideAssistance = lazy(() => import('./pages/RoadsideAssistance'));
const LazyTiresAndAC = lazy(() => import('./pages/TiresAndAC'));
const LazyAdminPanel = lazy(() => import('./components/AdminPanel'));
const LazyPrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const LazyTermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const LazyReservationFormPage = lazy(() => import("./pages/ReservationFormPage"));

// ============================================

const AppContent: React.FC = () => {
    const location = useLocation();
    const pathname = location.pathname;
    
    // ZMIANA: Sprawdzamy, czy ścieżka zawiera 'rezerwacja', 'polityka-prywatnosci' lub 'regulamin'
    const isSpecialPage = 
        pathname.includes('/rezerwacja') ||
        pathname.includes('/polityka-prywatnosci') ||
        pathname.includes('/regulamin');
    
    return (
        // ZMIANA: Usuwamy pt-[80px] z kontenera dla stron specjalnych
        <div className={`font-sans text-[#ddd] bg-[#161616fd] min-h-screen ${isSpecialPage ? '' : 'pt-[80px]'}`}>
            
            {/* WARUNKOWE RENDEROWANIE HEADERA */}
            {!isSpecialPage && <Header />}
            
            <Suspense fallback={<div className="text-center mt-[150px] text-2xl text-yellow-400">Ładowanie zawartości... Proszę czekać.</div>}> 
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
                    {/* === LAZY LOADED PAGES === */}
                    <Route path="/wynajem-busow" element={<LazyBusRental />} />
                    <Route path="/rezerwacja" element={<LazyReservationFormPage />} /> 

                    <Route path="/mechanika-samochodowa" element={<LazyCarMechanics />} />
                    <Route path="/blacharstwo-i-lakiernictwo" element={<LazyBodyAndPaintShop />} />
                    <Route path="/pomoc-drogowa" element={<LazyRoadsideAssistance />} />
                    <Route path="/wulkanizacja-i-klimatyzacja" element={<LazyTiresAndAC />} />
                    <Route path="/admin" element={<LazyAdminPanel />} />
                    <Route path="/polityka-prywatnosci" element={<LazyPrivacyPolicy />} />
                    <Route path="/regulamin" element={<LazyTermsAndConditions />} />
                    {/* === KONIEC LAZY LOADED PAGES === */}

                    <Route path="*" element={<h2 className="text-center mt-20 text-3xl">404 - Strona nie znaleziona</h2>} />
                </Routes>
            </Suspense>
            <Footer />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Router basename="/Berezowscy"> 
            <ContactProvider> 
                <AppContent /> 
            </ContactProvider>
        </Router>
    );
};

export default App;