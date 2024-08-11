import React, {useState} from "react";
import Navigation from "./Navigation";
import {useNavigate} from "react-router-dom";
/**
 * Header component to display the logo, navigation bar, and user status.
 * @param user - the current user
 * @param setUser - the function to set the current user
 */
const Header = ({user, setUser}) => {

    const navigate = useNavigate();
    
    const [dropdownVisible, setDropdownVisible] = useState(false);
    
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    }
    
    const handleLogout = () => {
        setUser({username: "", id: ""})
        setDropdownVisible(false)
        navigate("/login")
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