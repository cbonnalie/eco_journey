import React, {useEffect, useState} from "react";
import {Routes, Route} from "react-router-dom";
import Login from "./Components/pages/Login";
import Register from "./Components/pages/Register";
import ForgotPassword from "./Components/pages/ForgotPassword";
import Home from "./Components/pages/Home";
import Itinerary from "./Components/pages/Itinerary";

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
        location: {
            city: "",
            state: "",
            latitude: "",
            longitude: ""
        }
    })

    const [locations, setLocations] = useState([])
    
    /**
     * Fetch the locations from the backend.
     */
    useEffect(() => {
        const fetchLocations = async () => {
            const response = await fetch("/api/locations")
            const data = await response.json()
            const array = data.map(({city, state, latitude, longitude}) => ({
               city, state, latitude, longitude
            }))
            setLocations(array)
            localStorage.setItem("locations", JSON.stringify(array))
            console.log("Locations fetched: ", array)
        }
        void fetchLocations()
    }, [])

    /**
     * Hook runs when the component mounts. It sets the title of the page
     * and retrieves the form data from local storage.
     */
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
                    setLocations={setLocations}
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