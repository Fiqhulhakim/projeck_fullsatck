const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "kode_rahasia_banjir_123";

// ✅ Middleware 1: Verifikasi token (wajib login)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(403).json({ message: "Token diperlukan untuk akses ini" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token kadaluwarsa, silakan login ulang" });
    }
    return res.status(401).json({ message: "Token tidak valid" });
  }
};

// ✅ Middleware 2: Hanya admin yang boleh akses
const verifyAdmin = (req, res, next) => {
  // Harus dipanggil setelah verifyToken
  if (!req.user) {
    return res.status(403).json({ message: "Akses ditolak" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Hanya admin yang dapat mengakses ini" });
  }

  next();
};

module.exports = { verifyToken, verifyAdmin };