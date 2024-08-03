import React, {useEffect, useState} from "react";
import $ from "jquery";
import Header from "../Assets/Header";
import {fetchActivityTypes} from "../Utils/fetchers"

/**
 * Price limits.
 */
const prices = [
    "", "100", "200", "300", "400", "500", "600", "700", "800", "900", "1000+"
]
/**
 * Renders the form that users fill out to get their itinerary.
 *
 * @param formData - the form data
 * @param setFormData - the function to set the form data
 * @param locations
 * @param setLocations
 * @returns {Element} - the form
 */
const Home = ({formData, setFormData, locations}) => {

    const [currentIndex, setCurrentIndex] = useState(0); // State for current index
    // The different activity types to choose from.
    const [activityTypes, setActivityTypes] = useState([]);

    // resets the form data both in the state and in local storage.
    useEffect(() => {
        console.log("resetting form data...")
        const resetFormData = {
            activities: [],
            budget: "",
            location: {
                city: "",
                state: "",
                latitude: "",
                longitude: ""
            }
        }
        setFormData(resetFormData)
        localStorage.setItem("formData", JSON.stringify(resetFormData))
        console.log("form data reset")
    }, [setFormData])

    // fetch activity types from backend
    useEffect(() => {
        void fetchActivityTypes(setActivityTypes)
    }, []);

    /*
     * Handles the functionality of the next, previous, and submit buttons
     * in terms of showing the correct form data and hiding the correct buttons.
     */
    useEffect(() => {
        const options = $(".option");
        options.hide().eq(0).show();

        // Update buttons based on state of the form
        const updateButtonStates = () => {
            $("#prev").prop("disabled", currentIndex === 0);
            renderButtons();
        };

        // Show buttons initially
        updateButtonStates();
    }, [currentIndex]); // Re-run this effect when currentIndex changes

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        // if the target is a checkbox, update the activities array
        if (e.target.type === "checkbox") {
            handleCheckboxChange(e, value)
        } else if (name === "location") {
            const [city, state, latitude, longitude] = value.split(",");
            setFormData({
                ...formData,
                location: {city, state, latitude, longitude}
            })
        } else {
            setFormData({...formData, [name]: value});
        }
    };

    const handleCheckboxChange = (e, value) => {
        setFormData({
            ...formData,
            activities: e.target.checked
                ? [...formData.activities, value]
                : formData.activities.filter(activity => activity !== value)
        })
    }

    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, 2)); // Change 2 to the index of the last option
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    /**
     * If the form is valid, redirect to the itinerary page.
     * Otherwise, alert the user to fill out all fields.
     * @param e - the event object
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid()) {
            window.location.href = "/itinerary";
        } else {
            alert("Please fill out all fields")
            console.log("form submitted: ", formData)
        }
    };

    const isFormValid = () => {
        return formData.budget && formData.location;
    };

    /* Render Functions */

    const renderActivitiesForm = () => (
        <div className={"option"}>
            <h1>Select your preferred activities</h1>
            {activityTypes.map((activity, index) => (
                <div key={index} className={"activity-option"}>
                    <input
                        type="checkbox"
                        id={activity.type}
                        name={activity.type}
                        value={activity.type}
                        onChange={handleInputChange}
                    />
                    <label htmlFor={activity.type}>{activity.type}</label>
                </div>
            ))}
        </div>
    );

    const renderBudgetForm = () => (
        <div className={"option"}>
            <h1>What is your budget?</h1>
            <select name="budget" onChange={handleInputChange}>
                {prices.map((price, index) => (
                    <option key={index} value={price}>
                        {"$" + price}
                    </option>
                ))}
            </select>
        </div>
    );

    const renderLocationForm = () => (
        <div className={"option"}>
            <h1>What is your location?</h1>
            <select name="location" onChange={handleInputChange}>
                <option value={""}>Select a location</option>
                {locations.map((location, index) => (
                    <option
                        key={index}
                        value={`${location["city"]},${location["state"]},${location["latitude"]},${location["longitude"]}`}>
                        {location["city"]}, {location["state"]}
                    </option>
                ))}
            </select>
        </div>
    );

    const renderButtons = () => (
        <div>
            {currentIndex > 0 && (
                <input id="prev" className="move" type="button" value="Prev" onClick={handlePrev}/>
            )}
            <input id="next" className="move" type="button" value="Next" onClick={handleNext}/>
            {currentIndex === 2 && ( // Change 2 to the index of the last option if needed
                <button type={"submit"} id={"submit"}>Submit</button>
            )}
        </div>
    );

    return (
        <div>
            <Header/>
            <div className={"wrapper"}>
                <form onSubmit={handleSubmit}>
                    {currentIndex === 0 && renderActivitiesForm()}
                    {currentIndex === 1 && renderBudgetForm()}
                    {currentIndex === 2 && renderLocationForm()}
                    {renderButtons()} {/* No need to pass the index anymore */}
                </form>
            </div>
        </div>
    );
};


export default Home;

