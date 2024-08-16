import mysql from 'mysql2'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

/**
 * Get activities by types chosen by the user
 */
export async function getActivitiesByTypes(types) {
    try {
        const placeholder = types.map(() => '?').join(',');
        const [rows] = await pool.query(
            `SELECT * FROM activities WHERE type IN (${placeholder})`,
            types
        )
        return rows
    } catch (error) {
        console.error('Error getting activities by types:', error)
        throw error
    }
}

/**
 * Get all locations ordered by state, then city
 */
export async function getLocations() {
    try {
        const [rows] = await pool.query(`
            SELECT city, state, latitude, longitude, geographical_feature, location_id
            FROM locations
            ORDER BY state, city
        `)
        return rows
    } catch (error) {
        console.error('Error getting locations:', error)
        throw error
    }
}

/**
 * Get all activity types
 */
export async function getAllActivityTypes() {
    try {
        const [rows] = await pool.query(`
            SELECT DISTINCT type
            FROM activities
        `)
        return rows
    } catch (error) {
        console.error('Error getting all activity types:', error)
        throw error
    }
}

/**
 * Get all geography types
 */
export async function getGeographyTypes() {
    try {
        const [rows] = await pool.query(`
            SELECT DISTINCT geographical_feature
            FROM locations
        `)
        return rows
    } catch (error) {
        console.error('Error getting geography types:', error)
        throw error
    }
}

/**
 * Get data about a transportation type by name
 */
export async function getTransportationByName(name) {
    try {
        const [rows] = await pool.query(`
            SELECT *
            FROM transportation_types
            WHERE name = ?
        `, name)
        return rows
    } catch (error) {
        console.error('Error getting transportation by name:', error)
        throw error
    }
}

/**
 * Add a new user to the database
 */
export async function addUser(userData) {
    try {
        const {username, password, email} = userData;

        // Check for existing user
        const [existingUsers] = await pool.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existingUsers.length > 0) {
            return {error: 'Username or email already taken'};
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
            [username, hashedPassword, email]
        )
        return result
    } catch (error) {
        console.error('Error adding user:', error)
        throw error
    }
}

/**
 * Add a trip to the trips table
 */
export async function addTrip(tripData) {
    try {
        const {user_id, total_cost, total_emissions} = tripData;
        const [result] = await pool.query(
            'INSERT INTO trips (user_id, total_cost, total_emissions) VALUES (?, ?, ?)',
            [user_id, total_cost, total_emissions]
        )
        return result
    } catch (error) {
        console.error('Error adding trip:', error)
        throw error
    }
}

/**
 * Add activities to the trip_activities table
 */
export async function addTripActivities(trip_id, activities) {
    try {
        const values = activities.map(activity => [trip_id, activity.activity_id]);
        await pool.query(
            'INSERT INTO trip_activities (trip_id, activity_id) VALUES ?',
            [values]
        )
    } catch (error) {
        console.error('Error adding trip activities:', error)
        throw error
    }
}

/**
 * Add locations to the trip_locations table
 */
export async function addTripLocations(trip_id, locations) {
    try {
        const values = locations.map(location => [trip_id, location.location_id]);
        await pool.query(
            'INSERT INTO trip_locations (trip_id, location_id) VALUES ?',
            [values]
        )
    } catch (error) {
        console.error('Error adding trip locations:', error)
        throw error
    }
}

/**
 * Add transportation to the trip_transportation table
 */
export async function addTripTransportation(trip_id, transportation) {
    try {
        const {transport_id, distance_mi, total_cost, total_emissions} = transportation;
        await pool.query(
            'INSERT INTO trip_transportation (trip_id, transport_id, distance_mi, total_cost, total_emissions) VALUES (?, ?, ?, ?, ?)',
            [trip_id, transport_id, distance_mi, total_cost, total_emissions]
        )
    } catch (error) {
        console.error('Error adding trip transportation:', error)
        throw error
    }
}

/**
 * Save a trip to the saved_trips table
 */
export async function saveTrip(saveData) {
    try {
        const {user_id, trip_id, saved_at} = saveData;
        const [result] = await pool.query(
            'INSERT INTO saved_trips (user_id, trip_id, saved_at) VALUES (?, ?, ?)',
            [user_id, trip_id, saved_at]
        )
        return result
    } catch (error) {
        console.error('Error saving trip:', error)
        throw error
    }
}

/**
 * Get all saved trips belonging to a specific user
 */
export async function getSavedTrips(user_id) {
    try {
        const [rows] = await pool.query(`
            SELECT trips.*, saved_at
            FROM trips
            JOIN saved_trips USING (trip_id)
            WHERE saved_trips.user_id = ?
            ORDER BY saved_trips.saved_at DESC
        `, [user_id])
        return rows
    } catch (error) {
        console.error('Error getting saved trips:', error)
        throw error
    }
}

/**
 * Get all activities for a specific trip
 */
export async function getActivitiesByTripId(trip_id) {
    try {
        const [rows] = await pool.query(`
                SELECT activities.*
                FROM activities
                JOIN trip_activities USING (activity_id)
                WHERE trip_id = ?
        `, [trip_id])
        return rows
    } catch (error) {
        console.error('Error getting activities by trip ID:', error)
        throw error
    }
}

/**
 * Get all locations for a specific trip
 */
export async function getLocationsByTripId(trip_id) {
    try {
        const [rows] = await pool.query(`
            SELECT locations.*
            FROM locations
            JOIN trip_locations USING (location_id)
            WHERE trip_id = ?
        `, [trip_id])
        return rows
    } catch (error) {
        console.error('Error getting locations by trip ID:', error)
        throw error
    }
}

/**
 * Get all transportation for a specific trip
 */
export async function getTransportationByTripId(trip_id) {
    try {
        const [rows] = await pool.query(`
            SELECT transportation_types.*
            FROM transportation_types
            JOIN trip_transportation USING (transport_id)
            WHERE trip_id = ?
        `, [trip_id])
        return rows
    } catch (error) {
        console.error('Error getting transportation by trip ID:', error)
        throw error
    }
}

/**
 * Check if a username or email is already taken
 */
export async function usernameEmailTaken(username, email) {
    try {
        const [[rows]] = await pool.query(`
            SELECT COUNT(*) as count
            FROM users 
            WHERE username = ? 
            OR email = ?`, [username, email])
        return rows.count > 0
    } catch (error) {
        console.error('Error checking username/email:', error)
        throw error
    }
}

/**
 * Check if username exists, then check that password matches
 */
export async function authenticateUser(username, password) {
    try {
        const [[rows]] = await pool.query(`
            SELECT *
            FROM users
            WHERE username = ?
        `, username)

        if (rows.length === 0) {
            return null
        }

        const passwordMatches = await bcrypt.compare(password, rows.password)

        if (passwordMatches) {
            return rows
        } else {
            return null
        }
    } catch (error) {
        console.error('Error authenticating user:', error)
        throw error
    }
}
