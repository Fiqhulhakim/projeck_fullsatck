const mysql = require("mysql2");

// koneksi
const db = mysql.createConnection ({
    host : "localhost",
    user : "root",
    password : "",
    database : "banjir_db"
});

// tes koneksi
db.connect((err)=>{
    if(err) {
        console.log("koneksi gagal:", err);
    } else {
        console.log("koneksi database berhasil");
    }
});

module.exports = db;