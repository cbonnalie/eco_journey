import express from 'express'
import cors from 'cors'
import {
    getUsers
} from './database.js'

const app = express()

// allows us to make requests from the frontend
app.use(cors())
// allows us to use req.body
app.use(express.json())

// test route
app.get("/api", async (req, res) => {
    console.log("/api route hit");
    res.json({ message: "API is working" });
})

// error handling
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

/**
 * Get all users
 */
app.get("/api/users", async (req, res) => {
    const users = await getUsers()
    res.send(users)
})

app.listen(5000, () => {console.log("Server started on port 5000")})