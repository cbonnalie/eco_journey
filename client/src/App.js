// react
import {useEffect, useState} from "react"
import {Routes, Route} from "react-router-dom"

// local components
import Login from "./Components/Pages/Login"
import Register from "./Components/Pages/Register"
import ForgotPassword from "./Components/Pages/ForgotPassword"
import QuestionForm from "./Components/Pages/QuestionForm"
import Itinerary from "./Components/Pages/Itinerary"
import Home from "./Components/Pages/Home"
import SavedTrips from "./Components/Pages/SavedTrips"
import About from "./Components/Pages/About"
import Header from "./Components/Assets/Header"
import ProtectedRoutes from "./Components/Utils/ProtectedRoutes"
import {fetchLocations} from "./Components/Utils/DatabaseFunctions"

/**
 * The main component for the application. It is responsible for rendering
 * the different pages based on the URL path. It also manages the form data
 * that is passed down to the Home and Itinerary components.
 */
const App = () => {
    
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user")
        return savedUser ? JSON.parse(savedUser) : {username: "", id: ""}
    })
    
    // data from questionnaire
    const [formData, setFormData] = useState({
        activities: [],
        geography: [],
        location: {city: "", state: "", latitude: "", longitude: ""}
    })

    const [locations, setLocations] = useState([])
    
    useEffect(() => {
        // get saved form data from local storage
        const savedFormData = JSON.parse(localStorage.getItem("formData"));
        if (savedFormData) setFormData(savedFormData)
        // fetch locations from database
        void fetchLocations(setLocations)
    }, [])
    
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user))
    }, [user])
    
    useEffect(() => {
        localStorage.setItem("formData", JSON.stringify(formData));
    }, [formData])
    
    return (
        <>
            <Header user={user} setUser={setUser}/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/login" element={<
                    Login setUser={setUser}
                />}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route element={<ProtectedRoutes user={user}/>}>
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
                            user={user}
                        />}
                    />
                    <Route path="/saved-trips" element={
                        <SavedTrips
                            user={user}
                        />}
                    />
                </Route>
            </Routes>
        </>
    )
}

export default App;