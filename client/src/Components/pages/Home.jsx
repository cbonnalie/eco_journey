import React, { useEffect, useState } from "react"; // Import useState
import $ from "jquery";
import Header from "../Assets/Header";

const activities = [
    "Entertainment", "Outdoor", "Cultural", "Educational", "Leisure", "Historic"
];

const prices = [
    "", "100", "200", "300", "400", "500", "600", "700", "800", "900", "1000+"
];

const states = [
    "", "AL", "AK", "AZ", "AR", "CA", "CO", "CT",
    "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
    "KS", "KY", "LA", "ME", "MD", "MA", "MI",
    "MN", "MS", "MO", "MT", "NE", "NV", "NH",
    "NJ", "NM", "NY", "NC", "ND", "OH",
    "OK", "OR", "PA", "RI", "SC", "SD",
    "TN", "TX", "UT", "VT", "VA", "WA", "WV",
    "WI", "WY"
];

const Home = ({ formData, handleInputChange, setFormData }) => {
    const [currentIndex, setCurrentIndex] = useState(0); // State for current index

    useEffect(() => {
        const resetFormData = {
            activities: [],
            budget: "",
            location: ""
        };
        setFormData(resetFormData);
        localStorage.setItem("formData", JSON.stringify(resetFormData));
        console.log("Form Data Reset");
    }, [setFormData]);

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

    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, 2)); // Change 2 to the index of the last option
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid()) {
            window.location.href = "/itinerary";
        } else {
            alert("Please fill out all fields");
            console.log(formData);
        }
    };

    const isFormValid = () => {
        return formData.budget && formData.location;
    };

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
            <h1>Which state are you in?</h1>
            <select name="location" onChange={handleInputChange}>
                {states.map((state, index) => (
                    <option key={index} value={state}>
                        {state}
                    </option>
                ))}
            </select>
        </div>
    );

    const renderButtons = () => (
        <div>
            {currentIndex > 0 && (
                <input id="prev" className="move" type="button" value="Prev" onClick={handlePrev} />
            )}
            <input id="next" className="move" type="button" value="Next" onClick={handleNext} />
            {currentIndex === 2 && ( // Change 2 to the index of the last option if needed
                <button type={"submit"} id={"submit"}>Submit</button>
            )}
        </div>
    );

    return (
        <div>
            <Header />
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

