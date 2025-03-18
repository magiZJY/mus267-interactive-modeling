import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/filters">Filters</Link></li>
                <li><Link to="/karplus-strong">Karplus-Strong</Link></li>
                <li><Link to="/waveguide">Waveguide</Link></li>
            </ul>
        </nav>
    );
};

export default NavBar;