import React, {useEffect, useMemo, useState} from "react";
import "../Styles/itin.css";
import {
    fetchActivitiesByType,
    fetchTransportationByName
} from "../Utils/fetchers";
import Header from "../Assets/Header";
import {calculateDistance} from "../Utils/calculateDistance";
import {getStateFullName} from "../Utils/getStateFullName";

const Itinerary = ({formData, locations}) => {

    const [trips, setTrips] = useState([]);
    const [validActivities, setValidActivities] = useState([]);
    const [saveButtonDisabled, setSaveButtonDisabled] = useState({});

    const validLocations = useMemo(() => locations.filter((location) => {
        const hasChosenActivity = validActivities.some(activity => activity.location_id === location.location_id);
        return formData.geography.includes(location.geographical_feature) && hasChosenActivity;
    }), [locations,  validActivities, formData.geography]);

    const uniqueStates = useMemo(() => 
        [...new Set(validLocations.map(location => location.state))], [validLocations])

    useEffect(() => {
        if (formData.activities.length > 0) {
            void fetchActivitiesByType(formData, setValidActivities);
        }
    }, [formData]);

    const getActivityCountByState = (state) => {
        return validActivities.filter(activity =>
            validLocations.some(
                location =>
                    location.location_id === activity.location_id
                    && location.state === state)).length;
    };

    const getDistanceToState = (state) => {
        const stateLocations = validLocations.filter(location => location.state === state);
        if (stateLocations.length === 0) return Infinity;
        const distances = stateLocations.map(location => calculateDistance(
            formData.location.latitude,
            formData.location.longitude,
            location.latitude,
            location.longitude
        ));
        console.log("distances calculated")
        return Math.min(...distances);
    };

    const topFiveStates = useMemo(() => uniqueStates
        .map(state => ({
            state,
            activityCount: getActivityCountByState(state),
            distance: getDistanceToState(state)
        }))
        .sort((a, b) => b.activityCount - a.activityCount || a.distance - b.distance)
        .slice(0, 5), [uniqueStates]);

    useEffect(() => {
        
        const fetchData = async () => {
            const newTrips = await Promise.all(topFiveStates.map(async (stateObj) => {
                const { state, distance } = stateObj;
                const locations = validLocations.filter(location => location.state === state);
                const activities = validActivities.filter(activity => locations.some(location => location.location_id === activity.location_id));
                const activityCost = activities.reduce((acc, activity) => acc + parseFloat(activity.cost), 0);
                const activityCO2 = activities.reduce((acc, activity) => acc + parseFloat(activity.co2_emissions), 0);
                const transportation = await (distance > 300 ? fetchTransportationByName("Airplane") : fetchTransportationByName("Car Rental"));
                const transportationCost = distance * transportation.cost_per_mi * 2;
                const transportationCO2 = distance * transportation.emissions_per_mi * 2;
                const totalCost = transportationCost + activityCost;
                const totalCO2 = transportationCO2 + activityCO2;

                const tripData = {
                    user_id: 1,
                    total_cost: totalCost,
                    total_emissions: totalCO2
                };

                const tripResult = await fetch("/api/add-trip", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(tripData)
                });

                const trip = await tripResult.json();
                
                await fetch("/api/add-trip-activities", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ 
                        trip_id: trip.trip_id, activities })
                });

                await fetch("/api/add-trip-locations", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ trip_id: trip.trip_id, locations })
                });

                await fetch("/api/add-trip-transportation", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        trip_id: trip.trip_id,
                        transport_id: transportation.transport_id,
                        distance_mi: distance,
                        total_cost: transportationCost,
                        total_emissions: transportationCO2
                    })
                });

                return {
                    ...tripData,
                    trip_id: trip.trip_id,
                    state,
                    locations,
                    activities,
                    transportation,
                    distance
                };
            }));

            setTrips(prevTrips => {
                if (JSON.stringify(prevTrips) !== JSON.stringify(newTrips)) {
                    return newTrips;
                }
                return prevTrips;
            });
        };

        void fetchData();
    }, [topFiveStates, validActivities, validLocations]);

    const saveTrip = async (trip) => {
        const saveData = {
            user_id: 1, // Replace with the actual user ID
            trip_id: trip.trip_id,
            saved_at: new Date().toISOString().slice(0, 19).replace("T", " ")
        };

        setSaveButtonDisabled(prevState => ({ ...prevState, [trip.trip_id]: true }));

        try {
            const response = await fetch("/api/save-trip", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(saveData)
            });

            if (response.ok) {
                console.log("Trip saved successfully");
            } else {
                console.error("Error saving trip");
                setSaveButtonDisabled(prevState => ({ ...prevState, [trip.trip_id]: false }));
            }
        } catch (error) {
            console.error("Error saving trip:", error);
            setSaveButtonDisabled(prevState => ({ ...prevState, [trip.trip_id]: false }));
        }
    };
    
    const ItineraryHeader = ({formData}) => (
        <div className={"itinerary-header"}>
            <h1>Finding Your Next Adventure</h1>
            <br/>
            <h2>Your Location</h2>
            <p><b></b>{formData.location.city}, {formData.location.state}</p>
        </div>
    );

    const TripHeader = ({index, state}) => (
        <div className="trip-header">
            <h1><b>{index + 1}: {getStateFullName(state)}</b></h1>
        </div>
    );

    const ItineraryContainer = ({trip}) => {

        const { activities, locations, transportation, total_cost, total_emissions, distance } = trip;
        
        return (
            <div className="itinerary-container">
                <p>
                    <b>Number of Activities: </b>{activities.length}
                    <br/>
                    <b>Distance: </b>{distance.toFixed(2)} miles
                    <br/>
                    <b>Transportation: </b>{transportation.name}
                    <br/>
                    <b>Total Cost: </b>${total_cost.toFixed(2)}
                    <br/>
                    <b>Total CO2 Emissions: </b>{total_emissions.toFixed(2)} kg
                </p>
                {locations.map((location, index) => (
                    <ActivityList key={index} location={location} chosenActivities={activities}/>
                ))}
                <button 
                    onClick={() => saveTrip(trip)}
                    disabled={saveButtonDisabled[trip.trip_id]}
                >
                    Save Trip
                </button>
            </div>)
    }

    const ActivityList = ({location, chosenActivities}) => (
        <div>
            <h3><b>{location.city}</b></h3>
            <ul>
                {chosenActivities.filter(a => a.location_id === location.location_id)
                    .map(a => <li key={a.activity_id}>{a.name} (ID: {a.activity_id})</li>)}
            </ul>
            <br/>
        </div>
    );

    return (
        <div>
            <Header/>
            <ItineraryHeader formData={formData}/>

            <div className={"itinerary-wrapper"}>

                {trips.map((trip, index) => (
                    <div key={index}>
                        <TripHeader index={index} state={trip.state}/>
                        <ItineraryContainer trip={trip}/>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default Itinerary;
