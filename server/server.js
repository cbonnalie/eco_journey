import express from 'express'
import cors from 'cors'
import {
    getUsers,
    getActivitiesByTypes,
    getLocations,
    getAirplaneCosts,
    getAllActivityTypes,
    getGeographyTypes, getTopFiveStates, addUser
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
        const userData = req.body; // This will include petName
        const result = await addUser(userData); // Pass userData, which includes petName
        res.status(201).json({ message: "User registered successfully", user_id: result.insertId });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user." });
    }
});

/**
 * Get all users
 * TODO: delete
 */
app.get("/api/users", async (req, res) => {
    const users = await getUsers()
    res.send(users)
})

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

app.get("/api/plane-costs", async (req, res) => {
    const costs = await getAirplaneCosts()
    res.json(costs)
})

app.get("/api/activity-types", async (require,  res) => {
    const types = await getAllActivityTypes()
    res.json(types)
})

app.get("/api/geography-types", async (req, res) => {
    const types = await getGeographyTypes()
    res.json(types)
})

app.get("/api/top-five", async (req, res) => {
    const topFive = await getTopFiveStates()
    res.json(topFive)
})

app.listen(5000, () => {
    console.log("Server started on port 5000")
})