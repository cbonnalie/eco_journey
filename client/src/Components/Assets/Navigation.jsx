import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Form.css";

/**
 * Navigation bar component. Contains links to the Home, About, and Saved Trips.
 */
const Navigation = () => {
    return (
        <nav>
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/about">About</Link>
            <Link className="nav-link" to="/saved-trips">Saved Trips</Link>
        </nav>
    );
};

export default Navigation;


