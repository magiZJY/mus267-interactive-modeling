import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-page">
            <div className="content">
                <h1>Interactive Educational Tool for Physical Modeling</h1>
                <p className="intro">
                    This project explores physical modeling synthesis techniques such as Karplus-Strong, 
                    waveguides, and various audio filters. It has a graphic user interface that allows
                    intuitive controlling and provides a interactive way to experiment with sound 
                    synthesis and understand the underlying concepts through real-time feedback visualization.
                </p>
                <p className="author">MUS 267 Final Project Presentation</p>

                <div className="features-container">
                    <ul className="features-list">
                        <li><a href="/filters">Filters</a></li>
                        <li><a href="/karplus-strong">Karplus-Strong Algorithm</a></li>
                        <li><a href="/waveguide">Waveguide</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Home;
