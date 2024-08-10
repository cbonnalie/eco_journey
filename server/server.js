import express from 'express'
import cors from 'cors'
import {
    getUsers,
    getActivitiesByTypes,
    getLocations,
    getAllActivityTypes,
    getGeographyTypes,
    getTransportationByName,
    addUser,
    addTrip,
    addTripActivities,
    addTripLocations,
    addTripTransportation,
    saveTrip,
    getSavedTrips, getActivitiesByTripId, getLocationsByTripId, getTransportationByTripId, usernameEmailTaken
} from './database.js'

const app = express()

// allows us to make requests from the frontend
app.use(cors())
// allows us to use req.body
app.use(express.json())

// test route
app.get("/api", async (req, res) => {
    console.log("/api route hit");
    res.json({message: "API is working"});
})

/**
 * Register a new user
 */
app.post("/api/register", async (req, res) => {
    try {
        const userData = req.body;
        const result = await addUser(userData);
        res.status(201).json({message: "User registered successfully", user_id: result.insertId});
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({message: "Error registering user."});
    }
});

/**
 * Get activities by type. The types are passed as a query parameter
 * e.g. /api/activities?types=hiking,biking
 */
app.get("/api/activities", async (req, res) => {
    const types = req.query.types.split(',');
    const activities = await getActivitiesByTypes(types);
    res.send(activities);
});

/**
 * Get all locations ordered by state, then city
 */
app.get("/api/locations", async (req, res) => {
    const locations = await getLocations()
    res.json(locations)
})

app.get("/api/activity-types", async (require, res) => {
    const types = await getAllActivityTypes()
    res.json(types)
})

app.get("/api/geography-types", async (req, res) => {
    const types = await getGeographyTypes()
    res.json(types)
})

app.get("/api/transportation", async (req, res) => {
    const name = req.query.name
    const transportation = await getTransportationByName(name)
    res.json(transportation)
})

app.get("/api/saved-trips/:user_id", async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const savedTrips = await getSavedTrips(user_id);
        res.json(savedTrips);
    } catch (error) {
        console.error("Error fetching saved trips:", error);
        res.status(500).json({message: "Error fetching saved trips."});
    }
});

app.get("/api/activities-by-trip-id", async (req, res) => {
    const trip_id = req.query.trip_id
    const activities = await getActivitiesByTripId(trip_id)
    res.json(activities)
})

app.get("/api/locations-by-trip-id", async (req, res) => {
    const trip_id = req.query.trip_id
    const locations = await getLocationsByTripId(trip_id)
    res.json(locations)
})

app.get("/api/transportation-by-trip-id", async (req, res) => {
    const trip_id = req.query.trip_id
    const transportation = await getTransportationByTripId(trip_id)
    res.json(transportation)
})

app.get("/api/username-email-taken", async (req, res) => {
    const username = req.query.username
    const email = req.query.email
    const taken = await usernameEmailTaken(username, email)
    res.json({taken})
})

app.listen(5000, () => {
    console.log("Server started on port 5000")
})

app.post("/api/add-trip", async (req, res) => {
    try {
        const tripData = req.body;
        const result = await addTrip(tripData);
        res.status(201).json({trip_id: result.insertId});
    } catch (error) {
        console.error("Error adding trip:", error);
        res.status(500).json({message: "Error adding trip."});
    }
});

app.post("/api/add-trip-activities", async (req, res) => {
    try {
        const {trip_id, activities} = req.body;
        await addTripActivities(trip_id, activities);
        res.status(201).json({message: "Trip activities added successfully"});
    } catch (error) {
        console.error("Error adding trip activities:", error);
        res.status(500).json({message: "Error adding trip activities."});
    }
});

app.post("/api/add-trip-locations", async (req, res) => {
    try {
        const {trip_id, locations} = req.body;
        await addTripLocations(trip_id, locations);
        res.status(201).json({message: "Trip locations added successfully"});
    } catch (error) {
        console.error("Error adding trip locations:", error);
        res.status(500).json({message: "Error adding trip locations."});
    }
});

app.post("/api/add-trip-transportation", async (req, res) => {
    try {
        const {trip_id, transport_id, distance_mi, total_cost, total_emissions} = req.body;
        await addTripTransportation(trip_id, {transport_id, distance_mi, total_cost, total_emissions});
        res.status(201).json({message: "Trip transportation added successfully"});
    } catch (error) {
        console.error("Error adding trip transportation:", error);
        res.status(500).json({message: "Error adding trip transportation."});
    }
});

app.post("/api/save-trip", async (req, res) => {
    try {
        const saveData = req.body;
        const result = await saveTrip(saveData);
        res.status(201).json({message: "Trip saved successfully", saved_id: result.insertId});
    } catch (error) {
        console.error("Error saving trip:", error);
        res.status(500).json({message: "Error saving trip."});
    }
});

