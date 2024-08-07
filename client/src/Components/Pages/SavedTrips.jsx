import {useState, useEffect} from "react";
import Header from "../Assets/Header";
import {getStateFullName} from "../Utils/getStateFullName";
import {fetchActivitiesByTripId, fetchLocationsByTripId, fetchTransportationByTripId} from "../Utils/fetchers";
import "../Styles/itin.css";

const SavedTrips = () => {
    const [savedTrips, setSavedTrips] = useState([]);
    const [activities, setActivities] = useState([]);
    const [locations, setLocations] = useState([]);
    const [transportation, setTransportation] = useState([]);

    useEffect(() => {
        const fetchSavedTrips = async () => {
            try {
                const user_id = 1; //TODO Replace with the actual user ID
                const response = await fetch(`/api/saved-trips/${user_id}`);
                const data = await response.json();

                const formattedData = data.map(({trip_id, total_cost, total_emissions}) => ({
                    trip_id,
                    total_cost,
                    total_emissions
                }));

                setSavedTrips(formattedData);

                for (const trip of formattedData) {
                    const [activitiesData, locationsData, transportationData] = await Promise.all([
                        fetchActivitiesByTripId(trip.trip_id),
                        fetchLocationsByTripId(trip.trip_id),
                        fetchTransportationByTripId(trip.trip_id)
                    ]);

                    setActivities(prev => [...prev, {trip_id: trip.trip_id, activities: activitiesData}]);
                    setLocations(prev => [...prev, {trip_id: trip.trip_id, locations: locationsData}]);
                    setTransportation(prev => [...prev, {trip_id: trip.trip_id, transportation: transportationData}]);

                }
            } catch (error) {
                console.error("Error fetching saved trips:", error);
            }
        };
        void fetchSavedTrips();
    }, []);

    const SavedTripHeader = () => (
        <div className={"itinerary-header"}>
            <h1>Your Saved Trips</h1>
        </div>
    );

    const TripHeader = ({trip_id}) => (
        <div className="trip-header">
            <h1><b>Trip ID: {trip_id}</b></h1>
        </div>
    );

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
        );
    };

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
            <SavedTripHeader/>
            <div className={"itinerary-wrapper"}>
                {savedTrips.map((trip, index) => (
                    <div key={index}>
                        <TripHeader index={index} trip_id={trip.trip_id}/>
                        <ItineraryContainer trip={trip}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedTrips;
