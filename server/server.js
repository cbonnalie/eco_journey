import express from 'express'
import cors from 'cors'
import * as db from './database.js'

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

// Register a new user
app.post("/api/register", async (req, res) => {
    try {
        const userData = req.body;
        const result = await db.addUser(userData);
        res.status(201).json({message: "User registered successfully", user_id: result.insertId});
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({message: "Error registering user."});
    }
});

// Get all activities of the requested type
app.get("/api/activities", async (req, res) => {
    const types = req.query.types.split(',');
    const activities = await db.getActivitiesByTypes(types);
    res.send(activities);
});

// Get all locations ordered by state, then city
app.get("/api/locations", async (req, res) => {
    const locations = await db.getLocations()
    res.json(locations)
})

// Get all activity types
app.get("/api/activity-types", async (require, res) => {
    const types = await db.getAllActivityTypes()
    res.json(types)
})

// Get all geography types
app.get("/api/geography-types", async (req, res) => {
    const types = await db.getGeographyTypes()
    res.json(types)
})

// Get all transportation types
app.get("/api/transportation", async (req, res) => {
    const name = req.query.name
    const transportation = await db.getTransportationByName(name)
    res.json(transportation)
})

// Get all saved trips belonging to the requested user
app.get("/api/saved-trips/:user_id", async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const savedTrips = await db.getSavedTrips(user_id);
        res.json(savedTrips);
    } catch (error) {
        console.error("Error fetching saved trips:", error);
        res.status(500).json({message: "Error fetching saved trips."});
    }
});

// Get all activities that belong to the requested trip
app.get("/api/activities-by-trip-id", async (req, res) => {
    const trip_id = req.query.trip_id
    const activities = await db.getActivitiesByTripId(trip_id)
    res.json(activities)
})

// Get all locations that belong to the requested trip
app.get("/api/locations-by-trip-id", async (req, res) => {
    const trip_id = req.query.trip_id
    const locations = await db.getLocationsByTripId(trip_id)
    res.json(locations)
})

// Get all transportation that belongs to the requested trip
app.get("/api/transportation-by-trip-id", async (req, res) => {
    const trip_id = req.query.trip_id
    const transportation = await db.getTransportationByTripId(trip_id)
    res.json(transportation)
})

// Return the count of users who have the requested username or email
// used to validate registration
app.get("/api/username-email-taken", async (req, res) => {
    const username = req.query.username
    const email = req.query.email
    const taken = await db.usernameEmailTaken(username, email)
    res.json({taken})
})

// Authenticate user when attempting login
app.get("/api/login", async (req, res) => {
    const username = req.query.username
    const password = req.query.password
    const user = await db.authenticateUser(username, password)
    if (user) {
        console.log("server:", user)
        res.json(user)
    } else {
        res.json(false)
    }
})

// Write to the trips table
app.post("/api/add-trip", async (req, res) => {
    try {
        const tripData = req.body;
        const result = await db.addTrip(tripData);
        res.status(201).json({trip_id: result.insertId});
    } catch (error) {
        console.error("Error adding trip:", error);
        res.status(500).json({message: "Error adding trip."});
    }
});

// Write to the trip_activities table
app.post("/api/add-trip-activities", async (req, res) => {
    try {
        const {trip_id, activities} = req.body;
        await db.addTripActivities(trip_id, activities);
        res.status(201).json({message: "Trip activities added successfully"});
    } catch (error) {
        console.error("Error adding trip activities:", error);
        res.status(500).json({message: "Error adding trip activities."});
    }
});

// Write to the trip_locations table
app.post("/api/add-trip-locations", async (req, res) => {
    try {
        const {trip_id, locations} = req.body;
        await db.addTripLocations(trip_id, locations);
        res.status(201).json({message: "Trip locations added successfully"});
    } catch (error) {
        console.error("Error adding trip locations:", error);
        res.status(500).json({message: "Error adding trip locations."});
    }
});

// Write to the trip_transportation table
app.post("/api/add-trip-transportation", async (req, res) => {
    try {
        const {trip_id, transport_id, distance_mi, total_cost, total_emissions} = req.body;
        await db.addTripTransportation(trip_id, {transport_id, distance_mi, total_cost, total_emissions});
        res.status(201).json({message: "Trip transportation added successfully"});
    } catch (error) {
        console.error("Error adding trip transportation:", error);
        res.status(500).json({message: "Error adding trip transportation."});
    }
});

// Write to the saved_trips table
app.post("/api/save-trip", async (req, res) => {
    try {
        const saveData = req.body;
        const result = await db.saveTrip(saveData);
        res.status(201).json({message: "Trip saved successfully", saved_id: result.insertId});
    } catch (error) {
        console.error("Error saving trip:", error);
        res.status(500).json({message: "Error saving trip."});
    }
});

app.listen(5000, () => {
    console.log("Server started on port 5000")
})