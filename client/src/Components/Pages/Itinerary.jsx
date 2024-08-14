import React, {useCallback, useEffect, useMemo, useState} from "react";
import * as dbFunc from "../Utils/DatabaseFunctions";
import {calculateDistance} from "../Utils/Calculators";
import {getStateFullName} from "../Utils/GetStateFullName";
import "../Styles/Itinerary.css";

/**
 * Itinerary component. Contains the logic to generate a list of trips based on the user's preferences.
 */
const Itinerary = ({formData, locations, user}) => {
    const [trips, setTrips] = useState([])
    const [validActivities, setValidActivities] = useState([])
    const [saveButtonEnabled, setSaveButtonEnabled] = useState({})

    const validLocations = useMemo(() =>
        locations.filter(location =>
            formData.geography.includes(location.geographical_feature) &&
            validActivities.some(activity => activity.location_id === location.location_id)
        ), [locations, validActivities, formData.geography]
    )

    const uniqueStates = useMemo(() =>
            [...new Set(validLocations.map(location => location.state))],
        [validLocations]
    )

    useEffect(() => {
        if (formData.activities.length > 0) {
            void dbFunc.fetchActivitiesByType(formData, setValidActivities)
        }
    }, [formData])

    const getActivityCountByState = useCallback(state =>
            validActivities.filter(activity =>
                validLocations.some(
                    location => location.location_id === activity.location_id && location.state === state
                )
            ).length,
        [validActivities, validLocations]
    )

    const getDistanceToState = useCallback(state => {
        const stateLocations = validLocations.filter(location => location.state === state)
        if (stateLocations.length === 0) return Infinity

        const distances = stateLocations.map(location =>
            calculateDistance(
                formData.location.latitude,
                formData.location.longitude,
                location.latitude,
                location.longitude
            )
        )
        console.log("distances calculated")
        return Math.min(...distances)
    }, [validLocations, formData.location])

    const topFiveStates = useMemo(() =>
        uniqueStates.map(state => ({
            state,
            activityCount: getActivityCountByState(state),
            distance: getDistanceToState(state),
            geography: validLocations.find(location => location.state === state).geographical_feature
        }))
            .sort((a, b) => b.activityCount - a.activityCount || a.distance - b.distance)
            .slice(0, 5), [uniqueStates]
    )

    // fetch all data needed for the top 5 states in order to store it in the database
    useEffect(() => {
        const fetchData = async () => {
            const newTrips = await Promise.all(topFiveStates.map(async (stateObj) => {
                const {state, distance, geography} = stateObj;

                const locations = validLocations.filter(
                    location => location.state === state
                )

                const activities = validActivities.filter(
                    activity => locations.some(
                        location => location.location_id === activity.location_id
                    )
                )

                const transportation = await dbFunc.fetchTransportationByDistance(distance)

                return await dbFunc.addTripData(user, state, distance, transportation, activities, locations, geography)
            }))

            setTrips(prevTrips => {
                if (JSON.stringify(prevTrips) !== JSON.stringify(newTrips)) {
                    return newTrips
                }
                return prevTrips
            })
        }

        void fetchData()
    }, [topFiveStates, validActivities, validLocations, user])

    const saveTrip = async (trip) => {
        setSaveButtonEnabled(prevState => ({...prevState, [trip.trip_id]: true}))
        const success = await dbFunc.saveTripData(user.id, trip.trip_id)
        if (!success) setSaveButtonEnabled(prevState => ({...prevState, [trip.trip_id]: false}))
    }

    const ItineraryHeader = ({formData}) => (
        <div className={"itinerary-header"}>
            <h1>Finding Your Next Adventure</h1>
            <br/>
            <h2>Your Location</h2>
            <p><b></b>{formData.location.city}, {formData.location.state}</p>
        </div>
    )

    const TripHeader = ({index, state, trip}) => (
        <div className="trip-header">
            <h1>
                <b>{index + 1}: {getStateFullName(state)}</b>
                <p className={"state-geography"}>because you chose {trip.geography}</p>
            </h1>
            <button
                onClick={() => saveTrip(trip)}
                disabled={saveButtonEnabled[trip.trip_id]}
            ><b>Save Trip</b>
            </button>
        </div>
    )

    const ItineraryContainer = ({trip}) => {

        const {activities, locations, transportation, total_cost, total_emissions, distance} = trip;

        return (
            <div className="itinerary-container">
                <p>
                    <b>Number of Activities: </b>{activities.length}
                    <br/>
                    <b>Distance: </b>{distance.toFixed(2)} miles
                    <br/>
                    <b>Transportation: </b>
                    {transportation.name} (${(distance * transportation.cost_per_mi * 2).toFixed(2)})
                    <br/>
                    <b>Total Cost: </b>${total_cost.toFixed(2)}
                    <br/>
                    <b>Total CO2 Emissions: </b>{total_emissions.toFixed(2)} kg
                </p>
                {locations.map((location, index) => (
                    <ActivityList key={index} location={location} chosenActivities={activities}/>
                ))}
            </div>)
    }

    const ActivityList = ({location, chosenActivities}) => (
        <div>
            <h3><b>{location.city}</b></h3>
            <ul>
                {chosenActivities
                    .filter(a => a.location_id === location.location_id)
                    .map(a => (
                        <li key={a.activity_id}>
                            <a href={`https://www.google.com/search?q=${a.name}`}
                               target="_blank"
                               rel="noreferrer">
                                {a.name}
                            </a>
                            <span className={"activity-info"}>{a.type} / ${a.cost} / {a.co2_emissions}kg</span>
                        </li>
                    ))}
            </ul>
            <br/>
        </div>
    )

    return (
        <div>
            <ItineraryHeader formData={formData}/>
            <div className={"itinerary-wrapper"}>
                {trips.map((trip, index) => (
                    <div key={index}>
                        <TripHeader index={index} state={trip.state} trip={trip}/>
                        <ItineraryContainer trip={trip}/>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Itinerary;
