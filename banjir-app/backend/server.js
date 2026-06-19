require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const path    = require("path");

const apiRoutes    = require("./routes/api");
const authRoutes   = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static folder untuk foto upload ─────────────────────
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// ── Routes ───────────────────────────────────────────────
app.use("/api",      apiRoutes);   // /api/laporan, /api/dashboard, dll
app.use("/api/auth", authRoutes);  // /api/auth/register, /api/auth/login, /api/auth/me

// ── Health check ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Sistem Pelaporan Banjir API", status: "running" });
});

// ── 404 handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} tidak ditemukan` });
});

// ── Global error handler ─────────────────────────────────
app.use(errorHandler);

// ── Jalankan server ──────────────────────────────────────
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Server berjalan di port : ${PORT}`);
  console.log(` Mode                    : ${process.env.NODE_ENV || "development"}`);
  console.log(` Database                : ${process.env.DB_NAME  || "banjir_db"}`);
  console.log(`=========================================`);
});