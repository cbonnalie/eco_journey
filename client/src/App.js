import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Import Navigate
import Login from "./Components/pages/Login";
import Register from "./Components/pages/Register";
import ForgotPassword from "./Components/pages/ForgotPassword";
import Home from "./Components/pages/Home";
import Itinerary from "./Components/pages/Itinerary";
import About from "./Components/pages/About";
import SavedTrips from "./Components/pages/SavedTrips";
import Header from "./Components/Assets/Header"; // Adjust the path as needed


/**
 * The main component for the application. It is responsible for rendering
 * the different pages based on the URL path. It also manages the form data
 * that is passed down to the Home and Itinerary components.
 */
const App = () => {
    /**
     * This state holds data from the form users fill out
     * on the home page. It is passed down to the Itinerary component.
     */
    const [formData, setFormData] = useState({
        activities: [],
        budget: "",
        location: ""
    });

    /**
     * Hook runs when the component mounts. It sets the title of the page
     * and retrieves the form data from local storage.
     */
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

    /**
     * Handles input changes for the form on the home page.
     * @param e - the event object
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // if the target is a checkbox, update the activities array
        if (e.target.type === "checkbox") {
            setFormData((prevData) => ({
                ...prevData,
                activities: e.target.checked
                    ? [...prevData.activities, value]
                    : prevData.activities.filter(activity => activity !== value)
            }));
        } else { // if the target is not a checkbox, update the form data
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    /**
     * Renders the app through the use of Routes. Each Route is a different page.
     * @returns {JSX.Element}
     */
    return (
            <Routes>
                <Route path="/" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={
                    <Home
                        formData={formData}
                        handleInputChange={handleInputChange}
                        setFormData={setFormData}
                    />
                } />
                <Route path="/itinerary" element={<Itinerary formData={formData} />} />
                <Route path="/saved-trips" element={<SavedTrips />} />
            </Routes>
        );
};

export default App;


// const [backendUsers, setBackendUsers] = useState([{}])

// useEffect(() => {
//     Promise.all([
//         fetch('/api/users')
//             .then(res => res.json())
//             .then(data => setBackendUsers(data))
//     ]).catch(err => console.error("There was an error fetching the data: ", err))
// }, [])
//
// const renderUsers = () => {
//     return backendUsers.map((user, index) => {
//         return (
//             <div key={index}>
//                 <h3>{user.username}</h3>
//                 <p>{user.email}</p>
//             </div>
//         )
//     })
// }