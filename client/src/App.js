import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Pages/Login";
import Register from "./Components/Pages/Register";
import ForgotPassword from "./Components/Pages/ForgotPassword";
import QuestionForm from "./Components/Pages/QuestionForm";
import Itinerary from "./Components/Pages/Itinerary";
import About from "./Components/Pages/About";
import SavedTrips from "./Components/Pages/SavedTrips";
import {fetchLocations} from "./Components/Utils/fetchers";


/**
 * The main component for the application. It is responsible for rendering
 * the different pages based on the URL path. It also manages the form data
 * that is passed down to the Home and Itinerary components.
 */
const App = () => {

    const [user, setUser] = useState({
        username: "",
        id: ""
    })
    
    /* This state holds data from the form users fill out
    on the home page. It is passed down to the Itinerary component.*/
    const [formData, setFormData] = useState({
        activities: [],
        budget: "",
        location: {
            city: "",
            state: "",
            latitude: "",
            longitude: ""
        },
        geography: [],
        tripDays: ""
    })

    const [locations, setLocations] = useState([])

    /* Hook runs when the component mounts. It sets the title of the page
    and retrieves the form data from local storage.*/
    useEffect(() => {
        document.title = "Eco Journey";
        const savedFormData = JSON.parse(localStorage.getItem("formData"));
        if (savedFormData) {
            setFormData(savedFormData);
        }
    }, []);

    /**
     * Hook runs when the form data changes. It saves the form data to local storage.
     */
    useEffect(() => {
        // save the form data to local storage
        localStorage.setItem("formData", JSON.stringify(formData));
    }, [formData]);

    useEffect(() => {
        void fetchLocations(setLocations)
    }, []);

    /**
     * Renders the app through the use of Routes. Each Route is a different page.
     * @returns {JSX.Element}
     */
    return (
            <Routes>
                <Route path="/" element={<About />} />
                <Route path="/login" element={
                    <Login 
                        setUser={setUser}
                    />
                } />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/question-form" element={
                    <QuestionForm
                        formData={formData}
                        setFormData={setFormData}
                        locations={locations}
                    />}
                />
                <Route path="/itinerary" element={
                    <Itinerary
                        formData={formData}
                        locations={locations}
                    />}
                />
                <Route path="/saved-trips" element={<SavedTrips />} />
            </Routes>
        );
};

export default App;