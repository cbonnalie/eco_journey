import mysql from 'mysql2'
import dotenv from 'dotenv'

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
    // create a string of question marks for the number of types
    // e.g. types = ['hiking', 'biking'] => temp = '?,?'
    const temp = types.map(() => '?').join(',')
    // SELECT name FROM activities WHERE type IN (?,?)
    const [rows] = await pool.query(`
        SELECT name 
        FROM activities 
        WHERE type IN (${temp})
        `, types)
    return rows
}

/**
 * Get all locations ordered by state, then city
 * @returns {Promise<*>} - the locations
 */
export async function getLocations() {
    const [rows] = await pool.query(`
        SELECT city, state, latitude, longitude
        FROM locations
        ORDER BY state, city
        `)
    return rows
}