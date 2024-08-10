import React, {useCallback, useEffect, useState} from "react";
import $ from "jquery";
import {fetchActivityTypes, fetchGeographyTypes} from "../Utils/fetchers"

/**
 * Price limits.
 */
const prices = [
    "", "100", "200", "300", "400", "500", "600", "700", "800", "900", "1000+"
]

/**
 * Number of days to travel.
 */
const days = [1, 2, 3, 4, 5, 6, 7]

/**
 * The maximum index of the form.
 */
const maxIndex = 4;

/**
 * Renders the form that users fill out to get their itinerary.
 *
 * @param formData - the form data
 * @param setFormData - the function to set the form data
 * @param locations
 * @param setLocations
 * @returns {Element} - the form
 */
const QuestionForm = ({formData, setFormData, locations}) => {

    // State for current index
    const [currentIndex, setCurrentIndex] = useState(0);
    // The different activity types to choose from
    const [activityTypes, setActivityTypes] = useState([]);
    // The different geography types to choose from
    const [geographyTypes, setGeographyTypes] = useState([]);

    // updates the data of single input forms
    const handleInputChange = (e) => {
        const {name, value} = e.target;

        if (name === "location") {
            const [city, state, latitude, longitude] = value.split(",");
            setFormData({...formData, location: {city, state, latitude, longitude}})
            return
        }

        setFormData({...formData, [name]: value});
    };

    // updates the data of checkbox forms
    const handleCheckboxChange = (e, value, name) => {
        setFormData({
            ...formData, [name]: e.target.checked
                ? [...formData[name], value]
                : formData[name].filter(item => item !== value)
        })
    }

    // handles clicking the next button
    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex));
    };

    // handles clicking the previous button
    const handlePrev = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    /*
     * If the form is valid, redirect to the itinerary page.
     * Otherwise, alert the user to fill out all fields.
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
        return formData.budget
            && formData.location.city
            && formData.activities.length > 0
            && formData.geography.length > 0;
    };

    /* Render Functions */

    const renderTripDaysForm = () => (
        <div className={"option"}>
            <h1>How long would you like to travel?</h1>
            <select name="tripDays" onChange={handleInputChange}>
                <option value={""}>Select a location</option>
                {days.map((dayCount, index) => (
                    <option
                        key={index}
                        value={dayCount}>
                        {dayCount} {dayCount === 1 ? "day" : "days"}
                    </option>
                ))}
            </select>
        </div>
    )

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
                        onChange={(e) => handleCheckboxChange(e, activity.type, 'activities')}
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

    const renderGeographyForm = () => (
        <div className={"option"}>
            <h1>What geography would you like to see?</h1>
            {geographyTypes.map((geo, index) => (
                <div key={index} className={"geography-option"}>
                    <input
                        type="checkbox"
                        id={geo["geographical_feature"]}
                        name={geo["geographical_feature"]}
                        value={geo["geographical_feature"]}
                        onChange={(e) => handleCheckboxChange(e, geo["geographical_feature"], 'geography')}
                    />
                    <label htmlFor={geo["geographical_feature"]}>{geo["geographical_feature"]}</label>
                </div>
            ))}
        </div>
    )

    const renderButtons = useCallback(() => (
        <div>
            {currentIndex > 0 && (
                <input id="prev" className="move" type="button" value="Prev" onClick={handlePrev}/>
            )}
            <input id="next" className="move" type="button" value="Next" onClick={handleNext}/>
            {currentIndex === maxIndex && (
                <button type={"submit"} id={"submit"}>Submit</button>
            )}
        </div>
    ), [currentIndex]);

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
            },
            geography: [],
            tripDays: ""
        }
        setFormData(resetFormData)
        localStorage.setItem("formData", JSON.stringify(resetFormData))
        console.log("form data reset")
    }, [setFormData])

    // fetch activity types from backend
    useEffect(() => {
        void fetchActivityTypes(setActivityTypes)
        void fetchGeographyTypes(setGeographyTypes)
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
    }, [currentIndex, renderButtons]); // Re-run this effect when currentIndex changes

    return (
        <div>
            <div className={"wrapper"}>
                <form onSubmit={handleSubmit}>
                    {currentIndex === 0 && renderActivitiesForm()}
                    {currentIndex === 1 && renderGeographyForm()}
                    {currentIndex === 2 && renderLocationForm()}
                    {currentIndex === 3 && renderBudgetForm()}
                    {currentIndex === maxIndex && renderTripDaysForm()}
                    {renderButtons()} {/* No need to pass the index anymore */}
                </form>
            </div>
        </div>
    );
};


export default QuestionForm;

