import mysql from 'mysql2'

import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getUsers() {
    const [rows] = await pool.query('SELECT * FROM users')
    return rows
}

export async function getActivitiesByTypes(types) {
    // create a string of question marks for the number of types
    // e.g. types = ['hiking', 'biking'] => temp = '?,?'
    const temp = types.map(() => '?').join(',')
    // SELECT name FROM activities WHERE type IN (?,?)
    const [rows] = await pool.query(`SELECT name FROM activities WHERE type IN (${temp})`, types)
    return rows
}