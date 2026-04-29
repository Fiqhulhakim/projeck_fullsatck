const jwt = require("jsonwebtoken");
const JWT_SECRET = "kode_rahasia_banjir_123";

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Format: "Bearer TOKEN"

    if (!token) return res.status(403).json({ message: "Token diperlukan untuk akses ini" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Menyimpan data user ke dalam request
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token tidak valid atau kadaluwarsa" });
    }
};

module.exports = verifyToken;