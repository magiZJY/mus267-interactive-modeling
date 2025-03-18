import React from 'react';
import NavBar from '../components/shared/NavBar';
import KarplusStrong from '../components/SignalProcessor/KarplusStrong/KarplusStrong';
// import './KarplusStrongPage.css';

const KarplusStrongPage = () => {
    return (
        <div className="karplus-strong-page">
            {/* <NavBar /> */}
            <div className="content">
                {/* <h1>Karplus-Strong Algorithm</h1> */}
                <KarplusStrong />
            </div>
        </div>
    );
};

export default KarplusStrongPage;