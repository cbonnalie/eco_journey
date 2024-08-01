import React, {useEffect, useState} from "react";
import {Routes, Route} from "react-router-dom";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import ForgotPassword from "./components/pages/ForgotPassword";
import Home from "./components/pages/Home";
import Itinerary from "./components/pages/Itinerary";
import {fetchLocations} from "./components/utils/fetchers";

/**
 * The main component for the application. It is responsible for rendering
 * the different pages based on the URL path. It also manages the form data
 * that is passed down to the Home and Itinerary components.
 */
const App = () => {

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
        }
    })

    const [locations, setLocations] = useState([])

    /* Hook runs when the component mounts. It sets the title of the page
    and retrieves the form data from local storage.*/
    useEffect(() => {
        document.title = "Eco Journey"
        const savedFormData = JSON.parse(localStorage.getItem("formData"))
        if (savedFormData) {
            setFormData(savedFormData)
        }
    }, [])

    /**
     * Hook runs when the form data changes. It saves the form data to local storage.
     */
    useEffect(() => {
        // save the form data to local storage
        localStorage.setItem("formData", JSON.stringify(formData))
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
            <Route path="/" element={<Login/>}/>

            <Route path="/forgot-password" element={<ForgotPassword/>}/>

            <Route path="/register" element={<Register/>}/>

            <Route path="/home" element={
                <Home
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
        </Routes>
    )
}

export default App