const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'nexcart',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection()
    .then((conn) => {
        console.log('MySQL Database Connected successfully');
        conn.release();
    })
    .catch((err) => {
        console.error('MySQL Connection Error: ', err.message);
    });

module.exports = pool;
