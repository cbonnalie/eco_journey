import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate(); 

    const handleRedirect = () => {
        navigate("/login");
    };
    
    return (
        <div>
            <div className="home wrapper">
                <p>
                    Welcome to <b>Eco Journey</b>! 
                    We strive to provide the best travel experiences 
                    by helping you plan your perfect itinerary. 
                    Customize your trip based on your preferences, 
                    so you can enjoy a vacation that suits your interests.
                </p>
                <br/>
                <h2>Features</h2>
                <ul>
                    <li>Select from various activities, including entertainment, outdoor, and cultural experiences.</li>
                    <li>Set your budget to find options that suit your financial needs.</li>
                    <li>Choose your location to get personalized recommendations.</li>
                </ul>
                <br/>
                <h2>How It Works</h2>
                <p>
                    Simply fill out the form to provide us with your preferences,
                    and our application will generate a customized travel itinerary
                    tailored just for you. You can easily navigate through the form
                    and review your selections before submitting.
                </p>
                <br/>
                <h2>Contact Us</h2>
                <p>
                    If you have any questions or feedback, feel free to reach out to us
                    at <a className = "email-link" href="mailto:support@travelapp.com">support@travelapp.com</a>.
                </p>
                <br/>
                <button onClick={handleRedirect}>Start Your Journey!</button>
            </div>
        </div>
    );
};

export default Home;
