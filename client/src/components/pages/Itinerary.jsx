import React, {useEffect, useState} from "react"
import calculateDistance from "../utils/calculateDistance"
import "../styles/itin.css"
import {fetchActivitiesByType, fetchAirplaneCosts} from "../utils/fetchers";
import Header from "../assets/Header";

/**
 * Displays the itineraries based on the form data.
 * @param formData - the form data
 * @param locations
 * @returns {Element} - the itineraries
 */
const Itinerary = ({formData, locations}) => {

    const [chosenActivityTypes, setChosenActivityTypes] = useState([])
    const [airplaneCosts, setAirplaneCosts] = useState([])
    /**
     * Fetch activities based on the form data.
     * Will be replaced with something more comprehensive.
     */
    useEffect(() => {
        if (formData.activities.length > 0) {
            // void suppresses the promise ignored flag
            void fetchActivitiesByType(formData, setChosenActivityTypes);
        }
    }, [formData]);

    useEffect(() => {
        void fetchAirplaneCosts(setAirplaneCosts)
    }, []);

    return (

        <div>

            <Header/>

            <div>
                <h1>Finding Your Next Adventure</h1>
                <h2>Activities</h2>
                <p>{chosenActivityTypes.map(a => a.name).join(", ")}</p>
                <h2>Budget</h2>
                <p>${formData.budget}</p>
                <h2>Location</h2>
                <p><b>City: </b>{formData.location.city}</p>
                <p><b>State: </b>{formData.location.state}</p>
                <p><b>Latitude: </b>{formData.location.latitude}</p>
                <p><b>Longitude: </b>{formData.location.longitude}</p>
            </div>

            <div className={"itinerary-wrapper"}>
                {locations.map((location, index) => {
                    const distance = calculateDistance(
                        location.latitude, location.longitude,
                        formData.location.latitude, formData.location.longitude
                    )

                    console.log(airplaneCosts)
                    console.log(distance)
                    const airplaneCost = airplaneCosts["cost_per_mi"] * distance

                    const CO2Cost = airplaneCosts["co2_per_mi"] * distance


                    return (
                        <div key={index} className={"itinerary-container"}>
                            <h3><b>{location.city}, {location.state}</b></h3>
                            <p><b>Distance: </b>{distance.toFixed(2)} miles</p>
                            <p><b>Flight cost: </b>${airplaneCost.toFixed(2)}</p>
                            <p><b>CO2 Emissions: </b>{CO2Cost.toFixed(2)}kg per mi</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}


export default Itinerary