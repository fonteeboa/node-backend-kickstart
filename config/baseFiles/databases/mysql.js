const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

export default mysql.createConnection({
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
})
    .then(connection => {
        console.log('Connected to MySQL');
        return { status: 'success', connection };
    })
    .catch(err => {
        return { status: 'error', error: { code: 5002, message: 'Database connection failed', details: err } };
    });
