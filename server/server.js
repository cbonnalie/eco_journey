import express from 'express'
import cors from 'cors'
import {
    getUsers,
    getActivitiesByTypes, 
    getLocations
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

app.listen(5000, () => {
    console.log("Server started on port 5000")
})