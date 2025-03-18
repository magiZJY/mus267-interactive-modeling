import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Filters from './pages/Filters';
import KarplusStrongPage from './pages/KarplusStrongPage';
import Waveguide from './pages/Waveguide';
import NavBar from './components/shared/NavBar';
import './App.css';

const App = () => {
    return (
        <Router>
            <NavBar /> {/* NavBar is outside <Routes>, so it appears on all pages */}
            <div className="page-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/filters" element={<Filters />} />
                    <Route path="/karplus-strong" element={<KarplusStrongPage />} />
                    <Route path="/waveguide" element={<Waveguide />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
