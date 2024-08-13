import express from 'express'
import cors from 'cors'
import * as db from './database.js'

const app = express()

// Middleware setup
app.use(cors()) // Allows requests from the frontend
app.use(express.json()) // Allows us to use req.body

// Test route
app.get("/api", (req, res) => {
    res.json({message: "API is working"})
})

// Register a new user
app.post("/api/register", async (req, res) => {
    try {
        const userData = req.body
        const result = await db.addUser(userData)
        res.status(201).json({message: "User registered successfully", user_id: result.insertId})
    } catch (error) {
        console.error("Error registering user:", error)
        res.status(500).json({message: "Error registering user"})
    }
})

// Get all activities of the requested type
app.get("/api/activities", async (req, res) => {
    try {
        const types = req.query.types.split(',')
        const activities = await db.getActivitiesByTypes(types)
        res.json(activities)
    } catch (error) {
        console.error("Error fetching activities:", error)
        res.status(500).json({message: "Error fetching activities"})
    }
})

// Get all locations ordered by state, then city
app.get("/api/locations", async (req, res) => {
    try {
        const locations = await db.getLocations()
        res.json(locations)
    } catch (error) {
        console.error("Error fetching locations:", error)
        res.status(500).json({message: "Error fetching locations"})
    }
})

// Get all activity types
app.get("/api/activity-types", async (req, res) => {
    try {
        const types = await db.getAllActivityTypes()
        res.json(types)
    } catch (error) {
        console.error("Error fetching activity types:", error)
        res.status(500).json({message: "Error fetching activity types"})
    }
})

// Get all geography types
app.get("/api/geography-types", async (req, res) => {
    try {
        const types = await db.getGeographyTypes()
        res.json(types)
    } catch (error) {
        console.error("Error fetching geography types:", error)
        res.status(500).json({message: "Error fetching geography types"})
    }
})

// Get all transportation types
app.get("/api/transportation", async (req, res) => {
    try {
        const name = req.query.name
        const transportation = await db.getTransportationByName(name)
        res.json(transportation)
    } catch (error) {
        console.error("Error fetching transportation types:", error)
        res.status(500).json({message: "Error fetching transportation types"})
    }
})

// Get all saved trips belonging to the requested user
app.get("/api/saved-trips/:user_id", async (req, res) => {
    try {
        const user_id = req.params.user_id
        const savedTrips = await db.getSavedTrips(user_id)
        res.json(savedTrips)
    } catch (error) {
        console.error("Error fetching saved trips:", error)
        res.status(500).json({message: "Error fetching saved trips"})
    }
})

// Get all activities that belong to the requested trip
app.get("/api/activities-by-trip-id", async (req, res) => {
    try {
        const trip_id = req.query.trip_id
        const activities = await db.getActivitiesByTripId(trip_id)
        res.json(activities)
    } catch (error) {
        console.error("Error fetching activities by trip ID:", error)
        res.status(500).json({message: "Error fetching activities by trip ID"})
    }
})

// Get all locations that belong to the requested trip
app.get("/api/locations-by-trip-id", async (req, res) => {
    try {
        const trip_id = req.query.trip_id
        const locations = await db.getLocationsByTripId(trip_id)
        res.json(locations)
    } catch (error) {
        console.error("Error fetching locations by trip ID:", error)
        res.status(500).json({message: "Error fetching locations by trip ID"})
    }
})

// Get all transportation that belongs to the requested trip
app.get("/api/transportation-by-trip-id", async (req, res) => {
    try {
        const trip_id = req.query.trip_id
        const transportation = await db.getTransportationByTripId(trip_id)
        res.json(transportation)
    } catch (error) {
        console.error("Error fetching transportation by trip ID:", error)
        res.status(500).json({message: "Error fetching transportation by trip ID"})
    }
})

// Return the count of users who have the requested username or email
app.get("/api/username-email-taken", async (req, res) => {
    try {
        const username = req.query.username
        const email = req.query.email
        const taken = await db.usernameEmailTaken(username, email)
        res.json({taken})
    } catch (error) {
        console.error("Error checking username/email:", error)
        res.status(500).json({message: "Error checking username/email"})
    }
})

// Authenticate user when attempting login
app.get("/api/login", async (req, res) => {
    try {
        const username = req.query.username
        const password = req.query.password
        const user = await db.authenticateUser(username, password)
        if (user) {
            res.json(user)
        } else {
            res.status(401).json({message: "Invalid username or password"})
        }
    } catch (error) {
        console.error("Error authenticating user:", error)
        res.status(500).json({message: "Error authenticating user"})
    }
})

// Write to the trips table
app.post("/api/add-trip", async (req, res) => {
    try {
        const tripData = req.body
        const result = await db.addTrip(tripData)
        res.status(201).json({trip_id: result.insertId})
    } catch (error) {
        console.error("Error adding trip:", error)
        res.status(500).json({message: "Error adding trip"})
    }
})

// Write to the trip_activities table
app.post("/api/add-trip-activities", async (req, res) => {
    try {
        const { trip_id, activities } = req.body
        await db.addTripActivities(trip_id, activities)
        res.status(201).json({message: "Trip activities added successfully"})
    } catch (error) {
        console.error("Error adding trip activities:", error)
        res.status(500).json({message: "Error adding trip activities"})
    }
})

// Write to the trip_locations table
app.post("/api/add-trip-locations", async (req, res) => {
    try {
        const { trip_id, locations } = req.body
        await db.addTripLocations(trip_id, locations)
        res.status(201).json({message: "Trip locations added successfully"})
    } catch (error) {
        console.error("Error adding trip locations:", error)
        res.status(500).json({message: "Error adding trip locations"})
    }
})

// Write to the trip_transportation table
app.post("/api/add-trip-transportation", async (req, res) => {
    try {
        const { trip_id, transport_id, distance_mi, total_cost, total_emissions } = req.body
        await db.addTripTransportation(trip_id, { transport_id, distance_mi, total_cost, total_emissions })
        res.status(201).json({message: "Trip transportation added successfully"})
    } catch (error) {
        console.error("Error adding trip transportation:", error)
        res.status(500).json({message: "Error adding trip transportation"})
    }
})

// Write to the saved_trips table
app.post("/api/save-trip", async (req, res) => {
    try {
        const saveData = req.body
        const result = await db.saveTrip(saveData)
        res.status(201).json({message: "Trip saved successfully", saved_id: result.insertId})
    } catch (error) {
        console.error("Error saving trip:", error)
        res.status(500).json({message: "Error saving trip"})
    }
})

app.listen(5000, () => {
    console.log("Server started on port 5000")
})