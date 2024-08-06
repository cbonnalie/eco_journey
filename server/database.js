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

// TODO delete: was just for testing purposes
export async function getAirplaneCosts() {
    const [rows] = await pool.query(`
        SELECT cost_per_mi, emissions_per_mi
        FROM transportation_types
        WHERE name = 'Airplane'
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

export async function getTopFiveStates() {
    const [rows] = await pool.query(`
    SELECT state, COUNT(activity_id) AS count
    FROM activities
    JOIN locations USING (location_id)
    GROUP BY state
    ORDER BY count DESC, state ASC
    `);
    return rows;
}

/**
 * Add a new user to the database
 * @param {Object} userData - The user data object
 */
export async function addUser(userData) {
    const {username, password, email } = userData;

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