import {useState, useEffect} from "react";
import {getStateFullName} from "../Utils/GetStateFullName";
import {dateTimeFormatter} from "../Utils/DateTimeFormatter";
import {fetchActivitiesByTripId, fetchLocationsByTripId, fetchTransportationByTripId} from "../Utils/DatabaseFunctions";
import "../Styles/Itinerary.css";

const SavedTrips = ({user}) => {
    const [savedTrips, setSavedTrips] = useState([])
    const [activities, setActivities] = useState([])
    const [locations, setLocations] = useState([])
    const [transportation, setTransportation] = useState([])

    useEffect(() => {
        const fetchSavedTrips = async () => {
            try {
                const user_id = user.id;
                const response = await fetch(`/api/saved-trips/${user_id}`)
                const data = await response.json()

                const formattedData = data.map(({trip_id, total_cost, total_emissions, saved_at}) => ({
                    trip_id,
                    total_cost,
                    total_emissions,
                    saved_at
                }));

                setSavedTrips(formattedData)

                for (const trip of formattedData) {
                    const [activitiesData, locationsData, transportationData] = await Promise.all([
                        fetchActivitiesByTripId(trip.trip_id),
                        fetchLocationsByTripId(trip.trip_id),
                        fetchTransportationByTripId(trip.trip_id)
                    ])

                    setActivities(prev => [...prev, {trip_id: trip.trip_id, activities: activitiesData}])
                    setLocations(prev => [...prev, {trip_id: trip.trip_id, locations: locationsData}])
                    setTransportation(prev => [...prev, {trip_id: trip.trip_id, transportation: transportationData}])

                }
            } catch (error) {
                console.error("Error fetching saved trips:", error)
            }
        }
        void fetchSavedTrips()
    }, [user.id])

    const SavedTripHeader = () => (
        <div className={"itinerary-header"}>
            <h1>{user.username}'s Saved Trips</h1>
        </div>
    )

    const TripHeader = ({trip}) => {
        const tripLocations = locations.find(l => l.trip_id === trip.trip_id)?.locations || [];
        // seems to always pull the correct state,
        // but breaks if the ternary operator is removed!?
        const state = tripLocations.length > 0 ? tripLocations[0].state : "Unknown State";
        const stateFullName = getStateFullName(state)

        const geography = tripLocations.length > 0 ? tripLocations[0].geographical_feature : "Unknown Geography";
        
        return (
            <div className="trip-header">
                <h1><b>{stateFullName}</b><p className={"state-geography"}>because you chose {geography}</p></h1>
                <p>Saved at: {dateTimeFormatter(trip.saved_at)}</p>
            </div>
        )
    }

    const ItineraryContainer = ({trip}) => {
        /* using optional chaining (?.) here since a user could
           technically save a trip that has no activity or location */
        const tripActivities = activities.find(a => a.trip_id === trip.trip_id)?.activities || [];
        const tripLocations = locations.find(l => l.trip_id === trip.trip_id)?.locations || [];
        const tripTransportation = transportation.find(t => t.trip_id === trip.trip_id)?.transportation || [];

        return (
            <div className="itinerary-container">
                <p>
                    <b>Number of Activities: </b>
                    {tripActivities.length}
                    <br/>
                    <b>Transportation: </b>
                    {tripTransportation.map(t => t.name)}
                    <br/>
                    <b>Total Cost: </b>
                    ${trip.total_cost}
                    <br/>
                    <b>Total Emissions: </b>
                    {trip.total_emissions} kg
                </p>
                {tripLocations.map((location, index) => (
                    <ActivityList key={index} location={location} chosenActivities={tripActivities}/>
                ))}
            </div>
        )
    }

    const ActivityList = ({location, chosenActivities}) => (
        <div>
            <h3><b>{location.city}</b></h3>
            <ul>
                {chosenActivities.filter(a => a.location_id === location.location_id)
                    .map(a => <li key={a.activity_id}>
                        <a href={`https://www.google.com/search?q=${a.name}`}
                           target="_blank"
                           rel="noreferrer">
                            {a.name}
                        </a>
                        <span className={"activity-info"}>{a.type} / ${a.cost} / {a.co2_emissions}kg</span>
                    </li>)}
            </ul>
            <br/>
        </div>
    )

    return (
        <div>
            <SavedTripHeader/>
            <div className={"itinerary-wrapper"}>
                {savedTrips.map((trip, index) => (
                    <div key={index}>
                        <TripHeader index={index} trip={trip}/>
                        <ItineraryContainer trip={trip}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SavedTrips;
