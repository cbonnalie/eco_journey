import React, {useEffect, useState} from "react";
import "../Styles/itin.css";
import {
    fetchActivitiesByType,
} from "../Utils/fetchers";
import Header from "../Assets/Header";
import {calculateDistance, calculateTripCost} from "../Utils/calculateDistance";
import {getStateFullName} from "../Utils/getStateFullName";

// const trips = [{
//     initial_travel_cost: "",
//     cities: [],
//     activities: [],
//     travel_cost_between_cities: [],
//     total_cost: ""
// }]


const Itinerary = ({formData, locations}) => {

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

    const ItineraryContainer = ({state, activityCount, validLocations, chosenActivities}) => {
        
        const distance = getDistanceToState(state);
        
        return (
            <div className="itinerary-container">
                <p>
                    <b>Number of Activities: </b>{activityCount}
                    <br/>
                    <b>Distance: </b>{distance.toFixed(2)} miles
                    <br/>
                    <b>Transportation: </b>{}
                    <br/>
                    <b>Total Cost: </b>
                </p>
                {validLocations.filter(location => location.state === state).map((location, index) => (
                    <ActivityList key={index} location={location} chosenActivities={chosenActivities}/>
                ))}
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

                {topFiveStates.map((stateObj, index) => {
                    const {state, activityCount} = stateObj;
                    return (
                        <div key={index}>
                            <TripHeader index={index} state={state}/>
                            <ItineraryContainer
                                state={state}
                                activityCount={activityCount}
                                validLocations={validLocations}
                                chosenActivities={validActivities}
                            />
                        </div>
                    )
                })}

            </div>
        </div>
    );
}

export default Itinerary;
