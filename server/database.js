import mysql from 'mysql2';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'; // To hash passwords

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export async function getUsers() {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
}

export async function getActivitiesByTypes(types) {
    const temp = types.map(() => '?').join(',');
    const [rows] = await pool.query(`SELECT name FROM activities WHERE type IN (${temp})`, types);
    return rows;
}

/**
 * Add a new user to the database
 * @param {Object} userData - The user data object
 */
export async function addUser(userData) {
    const { firstName, lastName, username, password, email } = userData;

    // Check for existing user
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existingUsers.length > 0) {
        throw new Error('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
        'INSERT INTO users (first_name, last_name, username, password, email) VALUES (?, ?, ?, ?, ?)',
        [firstName, lastName, username, hashedPassword, email]
    );

    return result;
}

