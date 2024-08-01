import React from "react";

const Header = () => {
    return (
<header style={{ display: 'flex', alignItems: 'center',
            justifyContent: 'center', width: '100%',
            padding: '10px 0'}}>
            <img src="ej_logo.png" alt="Eco Journey Logo" style={{ height: '50px', marginRight: '10px' }} />
            <h1>Eco Journey</h1>
        </header>
    )
}

export default Header