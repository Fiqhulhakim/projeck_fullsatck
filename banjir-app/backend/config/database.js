const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME     || "banjir_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test koneksi saat server start
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database Error:", err.message);
    process.exit(1); // Hentikan server jika DB tidak bisa konek
  } else {
    console.log(`✅ Database terhubung: ${process.env.DB_NAME || "banjir_db"}`);
    connection.release();
  }
});

module.exports = db.promise();