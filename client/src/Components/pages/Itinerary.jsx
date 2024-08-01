import React, {useEffect, useState} from "react"
import calculateDistance from "../Tools/CalculateDistance"
import "../pages/itin.css"

/**
 * Displays the itineraries based on the form data.
 * @param formData - the form data
 * @param locations
 * @returns {Element} - the itineraries
 */
const Itinerary = ({formData, locations}) => {

    const [activities, setActivities] = useState([])

    /**
     * Fetch activities based on the form data.
     * Will be replaced with something more comprehensive.
     */
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                // Convert the array of activities to a comma-separated string
                // e.g. ['hiking', 'biking'] => 'hiking,biking'
                const queryParams = new URLSearchParams(
                    {types: formData.activities.join(',')}).toString();
                console.log("activity params: ", queryParams)
                // Fetch the activities
                // ? = query string
                const response = await fetch(`/api/activities?${queryParams}`);
                // Parse the response
                const data = await response.json();
                // Set the activities
                setActivities(data);
                console.log("Activities fetched");
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        };

        if (formData.activities.length > 0) {
            // void suppresses the promise ignored flag
            void fetchActivities();
        }
    }, [formData.activities]);

    return (
        <div>
            <h1>Finding Your Next Adventure</h1>
            <h2>Activities</h2>
            <p>{activities.map(a => a.name).join(", ")}</p>
            <h2>Budget</h2>
            <p>${formData.budget}</p>
            <h2>Location</h2>
            <p><b>City: </b>{formData.location.city}</p>
            <p><b>State: </b>{formData.location.state}</p>
            <p><b>Latitude: </b>{formData.location.latitude}</p>
            <p><b>Longitude: </b>{formData.location.longitude}</p>
            <br/>

            {locations.map((location, index) => (
                <div key={index}>
                    <p><b>Distance to {location.city}, {location.state}</b></p>
                    <p>{calculateDistance(location.latitude, location.longitude, formData.location.latitude, formData.location.longitude).toFixed(2)} miles</p>
                </div>
            ))}
        </div>
    )
}

export default Itinerary