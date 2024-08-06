import express from 'express';
import cors from 'cors';
import {
    getUsers,
    getActivitiesByTypes,
    addUser // Import addUser function
} from './database.js';

const app = express();

// Allow cross-origin requests from your frontend
app.use(cors({
    origin: "http://localhost:3000", // Change to your frontend URL
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials if needed
}));

// Allow JSON body parsing
app.use(express.json());

/**
 * Register a new user
 */
app.post("/api/register", async (req, res) => {
    try {
        const userData = req.body;
        const result = await addUser(userData);
        res.status(201).json({ message: "User registered successfully", user_id: result.insertId });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user." });
    }
});

// Test route
app.get("/api", async (req, res) => {
    console.log("/api route hit");
    res.json({ message: "API is working" });
});

/**
 * Get all users
 */
app.get("/api/users", async (req, res) => {
    const users = await getUsers();
    res.send(users);
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

const PORT = process.env.PORT || 5001; // Change to 5001
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
