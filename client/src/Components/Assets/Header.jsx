import React from "react";
import Navigation from "./Navigation"; // Import Navigation component

const Header = ({user}) => {
    return (
        <header>
            <Navigation/>
            
            <div className={"logo-container"}>
                <img src="/ej_logo.png" alt="Eco Journey Logo"/>
            </div>
            
            <div className={"user-info"}>
                {user.username ? <p>Welcome, {user.username}</p> : <p>Not logged in</p>}
            </div>
        </header>
    );
};

export default Header;