// Global error handler — dipasang paling bawah di server.js
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);

  // Kalau error dari JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Token tidak valid" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token kadaluwarsa, silakan login ulang" });
  }

  // Kalau error dari MySQL (duplikat entry, dll)
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(400).json({ message: "Data sudah ada — duplikat tidak diizinkan" });
  }

  // Default 500
  res.status(err.status || 500).json({
    message: err.message || "Terjadi kesalahan pada server"
  });
};

module.exports = errorHandler;