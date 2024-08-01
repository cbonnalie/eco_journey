import React, {useEffect} from "react";
import $ from "jquery";
import Header from "../Assets/Header";

/**
 * Activities to choose from.
 * TODO: replace with fetch from backend
 */
const activities = [
    "Entertainment", "Outdoor", "Cultural", "Educational", "Leisure", "Historic"
]

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
const Home = ({formData, setFormData, locations, setLocations}) => {
    
    /**
     * Runs when the component mounts. It resets the form data
     * both in the state and in local storage.
     */
    useEffect(() => {
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
        
        const resetLocations = []
        
        // reset form data in state
        setFormData(resetFormData)
        setLocations(resetLocations)
        // save the reset form to local storage
        localStorage.setItem("formData", JSON.stringify(resetFormData))
        localStorage.setItem("locations", JSON.stringify(resetLocations))
        console.log("Form Data Reset")
    }, [setFormData, setLocations]);

    /**
     * Handles the functionality of the next, previous, and submit buttons
     * in terms of showing the correct form data and hiding the correct buttons.
     */
    useEffect(() => {
        // show first option by default
        const options = $(".option")
        options.hide().eq(0).show()
        $("#prev").prop("disabled", true)
        $("#submit").hide()
        
        // update buttons based on state of the form
        const updateButtonStates = (currentIndex) => {
            $("#prev").prop("disabled", currentIndex === 0)
            // replace next with submit on last option
            if (currentIndex === options.length - 1) {
                $("#submit").show()
                $("#next").hide()
            } else {
                $("#submit").hide()
                $("#next").show()
            }
        }

        // handle next and previous button clicks
        $("#next, #prev").on("click", function () {
            const currentOption = options.filter(":visible")
            const currentIndex = options.index(currentOption)
            const direction = this.id === "next" ? 1 : -1
            options.eq(currentIndex).hide()
            options.eq(currentIndex + direction).show()
            updateButtonStates(currentIndex + direction)
        })
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // if the target is a checkbox, update the activities array
        if (e.target.type === "checkbox") {
            handleCheckboxChange(e, value)
        }
        else if (name === "location") {
            const [city, state, latitude, longitude] = value.split(",");
            setFormData({
                ...formData,
                location: {city, state, latitude, longitude}
            })
        } 
        else {
            setFormData({ ...formData, [name]: value });
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
    
    
    /**
     * If the form is valid, redirect to the itinerary page.
     * Otherwise, alert the user to fill out all fields.
     * @param e - the event object
     */
    const handleSubmit = (e) => {
        e.preventDefault()
        if (isFormValid()) {
            window.location.href = "/itinerary";
        } else {
            alert("Please fill out all fields")
            console.log(formData)
        }
    }

    /**
     * Check if the budget and location fields have a value.
     */
    const isFormValid = () => {
        return formData.budget && formData.location
    }

    /* Render Functions */
    
    const renderActivitiesForm = () => (
        <div className={"option"}>
            <h1>Select your preferred activities</h1>
            {activities.map((activity, index) => (
                <div key={index} className={"activity-option"}>
                    <input
                        type="checkbox"
                        id={activity}
                        name={activity}
                        value={activity}
                        onChange={handleInputChange}
                    />
                    <label htmlFor={activity}>{activity}</label>
                </div>
            ))}
        </div>
    )

    const renderBudgetForm = () => (
        <div className={"option"}>
            <h1>What is your budget?</h1>
            <select name="budget" onChange={handleInputChange}>
                {prices.map((price, index) => (
                    <option
                        key={index}
                        value={price}>
                        {"$" + price}
                    </option>
                ))}
            </select>
        </div>
    )

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
    )

    const renderButtons = () => (
        <div>
            <input id="prev" className="move" type="button" value="Prev"/>
            <input id="next" className="move" type="button" value="Next"/>
            <button type={"submit"} id={"submit"}>Submit</button>
        </div>
    )

    return (
        <div>
            <Header/>
            <div className={"wrapper"}>
                <form onSubmit={handleSubmit}>
                    {renderActivitiesForm()}
                    {renderBudgetForm()}
                    {renderLocationForm()}
                    {renderButtons()}
                </form>
            </div>
        </div>
    )
}

export default Home