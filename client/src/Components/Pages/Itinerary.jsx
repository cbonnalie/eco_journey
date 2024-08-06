import React, {useEffect, useState} from "react";
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

    const validLocations = locations.filter((location) => {
        const hasChosenActivity = validActivities.some(activity => activity.location_id === location.location_id);
        return formData.geography.includes(location.geographical_feature) && hasChosenActivity;
    });

    const uniqueStates = [...new Set(validLocations.map(location => location.state))];

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

    const topFiveStates = uniqueStates
        .map(state => ({
            state,
            activityCount: getActivityCountByState(state),
            distance: getDistanceToState(state)
        }))
        .sort((a, b) => b.activityCount - a.activityCount || a.distance - b.distance)
        .slice(0, 5);

    useEffect(() => {
        const fetchData = async () => {

            const newTrips = await Promise.all(topFiveStates.map(async (stateObj) => {

                const { state, distance } = stateObj;

                const locations = validLocations.filter(location => location.state === state);

                const activities = validActivities
                    .filter(activity => locations.some(location => location.location_id === activity.location_id));

                const activityCost = activities.reduce((acc, activity) => acc + parseFloat(activity.cost), 0);
                const activityCO2 = activities.reduce((acc, activity) => acc + parseFloat(activity.co2_emissions), 0);
                
                const transportation = await (distance > 300 ? fetchTransportationByName("Airplane") : fetchTransportationByName("Car Rental"))
                
                const transportationCost = distance * transportation.cost_per_mi * 2;
                const transportationCO2 = distance * transportation.emissions_per_mi * 2;
                
                const totalCost = transportationCost + activityCost;
                const totalCO2 = transportationCO2 + activityCO2;
                
                console.log("state: ", state)
                console.log("activity cost: ", activityCost)
                console.log("activity CO2: ", activityCO2)
                console.log("transportation: ", transportation.name)
                console.log("distance: ", distance)
                console.log("cost per mile: ", transportation.cost_per_mi)
                console.log("transportation cost: ", transportationCost)
                console.log("total cost: ", totalCost)
                console.log("total CO2: ", totalCO2)

                return {
                    user_id: 1,
                    state: state,
                    locations: locations,
                    activities: activities,
                    transportation: transportation,
                    total_cost: totalCost,
                    total_CO2: totalCO2,
                    distance: distance
                }}))
                
            setTrips(prevTrips => {
                if (JSON.stringify(prevTrips) !== JSON.stringify(newTrips)) {
                    console.log("trips set")
                    return newTrips;
                }
                return prevTrips;
            });
            
            void addToTripsTable()
        };

        void fetchData();
    }, [topFiveStates, validActivities, validLocations]);
    
    const addToTripsTable = async () => {
        
    }
    
    
    
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

        const { activities, locations, transportation, total_cost, total_CO2, distance } = trip;
        
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
                    <b>Total CO2 Emissions: </b>{total_CO2.toFixed(2)} kg
                </p>
                {locations.map((location, index) => (
                    <ActivityList key={index} location={location} chosenActivities={activities}/>
                ))}
                <button>Save Trip</button>
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
