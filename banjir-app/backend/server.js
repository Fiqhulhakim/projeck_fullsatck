// 1. Load Environment Variables paling awal
require("dotenv").config();

const express = require("express");
const cors = require("cors"); // Pastikan ini sudah diinstall (npm install cors)
const path = require("path");
const router = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middleware
app.use(cors()); // Mengizinkan akses dari Frontend React nantinya
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Static Folder untuk Foto (Agar bisa dibuka di browser)
// Lokasi: http://localhost:3000/uploads/nama-file.jpg
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// 4. Routing
app.use("/api", router);

// 5. Jalankan Server
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`Server Berhasil Berjalan di Port: ${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'Development'}`);
    console.log(`=========================================`);
});