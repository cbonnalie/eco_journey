import React, { useState, useEffect } from "react";

const SavedTrips = () => {
    const [savedTrips, setSavedTrips] = useState([]);

    useEffect(() => {
        // Fetch saved trips from local storage or an API
        const trips = JSON.parse(localStorage.getItem("savedTrips")) || [];
        setSavedTrips(trips);
    }, []);

    return (
        <div>
            <h1>Saved Trips</h1>
            {savedTrips.length > 0 ? (
                <ul>
                    {savedTrips.map((trip, index) => (
                        <li key={index}>
                            <h2>Trip {index + 1}</h2>
                            <p>Activities: {trip.activities.join(", ")}</p>
                            <p>Budget: ${trip.budget}</p>
                            <p>Location: {trip.location}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No saved trips.</p>
            )}
        </div>
    );
};

export default SavedTrips;
