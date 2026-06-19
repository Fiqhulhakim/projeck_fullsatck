// Middleware role-based access control
// Contoh penggunaan: authorizeRole(["admin"])
const authorizeRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: "Akses ditolak — belum login" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Akses ditolak — hanya ${roles.join(" / ")} yang diizinkan`
      });
    }

    next();
  };
};

module.exports = authorizeRole;