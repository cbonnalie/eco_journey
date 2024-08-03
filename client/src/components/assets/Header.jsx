import React from "react";
import Navigation from "./Navigation"; // Import Navigation component

const Header = () => {
    return (
        <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', width: '100%', padding: '10px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="ej_logo.png" alt="Eco Journey Logo" style={{ height: '50px', marginRight: '10px' }} />
                <h1>Eco Journey</h1>
            </div>
            <Navigation /> {/* Add Navigation component */}
        </header>
    );
};

export default Header;
