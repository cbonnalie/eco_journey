import React, {useEffect, useState} from "react"

const Itinerary = ({formData}) => {

    const [activities, setActivities] = useState([])

    useEffect(() => {
        // Fetch activities based on the selected types
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
            <h1>Finding Your Next Adventure...</h1>
            <p>Activities: {activities.map(a => a.name).join(", ")}</p>
            <p>Budget: ${formData.budget}</p>
            <p>Location: {formData.location}</p>
        </div>
    )
}

export default Itinerary