import React, {useState} from "react";
import Navigation from "./Navigation"; // Import Navigation component

const Header = ({user, setUser}) => {
    
    const [dropdownVisible, setDropdownVisible] = useState(false);
    
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    }
    
    const handleLogout = () => {
        setUser({username: "", id: ""})
        setDropdownVisible(false)
        window.location.href = "/login"
    }
    
    return (
        <header>
            <Navigation/>
            
            <div className={"logo-container"}>
                <img src="/ej_logo.png" alt="Eco Journey Logo"/>
            </div>
            
            <div className={"user-info"} onClick={toggleDropdown}>
                {user.username ? <p>Welcome, {user.username}</p> : <p>Not logged in</p>}
                {dropdownVisible && (
                    <div className={"dropdown"}>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;