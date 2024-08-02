import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Assets/Header";

/**
 * Renders the About page with information about the application.
 *
 * @returns {Element} - The About page
 */
const About = () => {
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    const handleRedirect = () => {
        navigate("/login");
    };


    return (
        <div>
            <Header />
            <div className="wrapper">
                <h1>About Our Travel Booking Application</h1>
                <p>
                    Welcome to our Travel Booking Application! We strive to provide
                    the best travel experiences by helping you plan your perfect
                    itinerary. Our application allows you to select activities,
                    set your budget, and choose your location, making travel
                    planning simple and enjoyable.
                </p>
                <h2>Features</h2>
                <ul>
                    <li>Select from various activities, including entertainment, outdoor, and cultural experiences.</li>
                    <li>Set your budget to find options that suit your financial needs.</li>
                    <li>Choose your location to get personalized recommendations.</li>
                </ul>
                <h2>How It Works</h2>
                <p>
                    Simply fill out the form to provide us with your preferences,
                    and our application will generate a customized travel itinerary
                    tailored just for you. You can easily navigate through the form
                    and review your selections before submitting.
                </p>
                <h2>Contact Us</h2>
                <p>
                    If you have any questions or feedback, feel free to reach out to us
                    at <a className = "email-link" href="mailto:support@travelapp.com">support@travelapp.com</a>.
                </p>
                <button onClick={handleRedirect}>Start Your Journey!</button>
            </div>
        </div>
    );
};

export default About;
