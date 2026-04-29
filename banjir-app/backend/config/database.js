const mysql = require("mysql2");
require("dotenv").config();

// Menggunakan Pool agar koneksi lebih stabil dan mendukung async/await
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "banjir_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test Koneksi
db.getConnection((err, connection) => {
    if (err) {
        console.error("Database Error:", err.message);
    } else {
        console.log("Database Connected: Berhasil terhubung ke", process.env.DB_NAME);
        connection.release();
    }
});

module.exports = db.promise();