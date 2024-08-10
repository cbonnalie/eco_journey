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
 * Get all users
 * TODO: delete
 */
export async function getUsers() {
    const [rows] = await pool.query('SELECT * FROM users')
    return rows
}

/**
 * Get activities by types chosen by the user
 * @param types - the types of activities chosen by the user
 * @returns {Promise<*>} - the activities that match the types
 */
export async function getActivitiesByTypes(types) {
    const placeholder = types.map(() => '?').join(',')
    const [rows] = await pool.query(`
        SELECT *
        FROM activities 
        WHERE type IN (${placeholder})
        `, types)
    return rows
}

/**
 * Get all locations ordered by state, then city
 * @returns {Promise<*>} - city, state, and coordinates of each location
 */
export async function getLocations() {
    const [rows] = await pool.query(`
        SELECT city, state, latitude, longitude, geographical_feature, location_id
        FROM locations
        ORDER BY state, city
        `)
    return rows
}

export async function getAllActivityTypes() {
    const [rows] = await pool.query(`
    SELECT DISTINCT type
    FROM activities
    `)
    return rows
}

export async function getGeographyTypes() {
    const [rows] = await pool.query(`
    SELECT DISTINCT geographical_feature
    FROM locations
    `)
    return rows
}

export async function getTransportationByName(name) {
    const [rows] = await pool.query(`
    SELECT *
    FROM transportation_types
    WHERE name = ?
    `, name)
    return rows
}

/**
 * Add a new user to the database
 * @param {Object} userData - The user data object
 */
export async function addUser(userData) {
    const {username, password, email} = userData;

    // Check for existing user
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existingUsers.length > 0) {
        throw new Error('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
        'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
        [username, hashedPassword, email]
    );

    return result;
}

export async function addTrip(tripData) {
    try {
        const {user_id, total_cost, total_emissions} = tripData;
        const [result] = await pool.query(
            'INSERT INTO trips (user_id, total_cost, total_emissions) VALUES (?, ?, ?)',
            [user_id, total_cost, total_emissions]
        );
        console.log('Trip added. trip id: ', result.insertId)
        return result;
    } catch (error) {
        console.error('Error adding trip:', error);
        throw error;
    }
}

export async function addTripActivities(trip_id, activities) {
    try {
        const values = activities.map(activity => [trip_id, activity.activity_id]);
        await pool.query(
            'INSERT INTO trip_activities (trip_id, activity_id) VALUES ?',
            [values]
        );
        console.log('Trip activities added:', values)
    } catch (error) {
        console.error('Error adding trip activities:', error);
        throw error;
    }
}

export async function addTripLocations(trip_id, locations) {
    try {
        const values = locations.map(location => [trip_id, location.location_id]);
        await pool.query(
            'INSERT INTO trip_locations (trip_id, location_id) VALUES ?',
            [values]
        );
        console.log('Trip locations added:', values)
    } catch (error) {
        console.error('Error adding trip locations:', error);
        throw error;
    }
}

export async function addTripTransportation(trip_id, transportation) {
    try {
        const {transport_id, distance_mi, total_cost, total_emissions} = transportation;
        await pool.query(
            'INSERT INTO trip_transportation (trip_id, transport_id, distance_mi, total_cost, total_emissions) VALUES (?, ?, ?, ?, ?)',
            [trip_id, transport_id, distance_mi, total_cost, total_emissions]
        );
        console.log('Trip transportation added:', transportation)
    } catch (error) {
        console.error('Error adding trip transportation:', error);
        throw error;
    }
}

export async function saveTrip(saveData) {
    try {
        const {user_id, trip_id, saved_at} = saveData;
        const [result] = await pool.query(
            'INSERT INTO saved_trips (user_id, trip_id, saved_at) VALUES (?, ?, ?)',
            [user_id, trip_id, saved_at]
        );
        console.log('Trip saved:', result.saved_id)
        return result;
    } catch (error) {
        console.error('Error saving trip:', error);
        throw error;
    }
}

export async function getSavedTrips(user_id) {
    const [rows] = await pool.query(`
    SELECT trips.*, saved_at
    FROM trips
    JOIN saved_trips USING (trip_id)
    WHERE saved_trips.user_id = ?
    ORDER BY saved_trips.saved_at DESC
    `, [user_id]);
    return rows;
}

export async function getActivitiesByTripId(trip_id) {
    const [rows] = await pool.query(`
    SELECT activities.*
    FROM activities
    JOIN trip_activities USING (activity_id)
    WHERE trip_id = ?
    `, [trip_id]);
    return rows;
}

export async function getLocationsByTripId(trip_id) {
    const [rows] = await pool.query(`
    SELECT locations.*
    FROM locations
    JOIN trip_locations USING (location_id)
    WHERE trip_id = ?
    `, [trip_id]);
    return rows;
}

export async function getTransportationByTripId(trip_id) {
    const [rows] = await pool.query(`
    SELECT transportation_types.*
    FROM transportation_types
    JOIN trip_transportation USING (transport_id)
    WHERE trip_id = ?
    `, [trip_id]);
    return rows;
}

export async function usernameEmailTaken(username, email) {
    const [[rows]] = await pool.query(`
        SELECT COUNT(*) as count
        FROM users 
        WHERE username = ? 
        OR email = ?`, [username, email]);
    return rows.count > 0;
}

export async function authenticateUser(username, password) {
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
        console.log("db:", rows)
        return rows
    } else {
        return null
    }
}


