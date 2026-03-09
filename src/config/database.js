const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "jitterbit",
    password: "1234",
    database: "jitterbit",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;