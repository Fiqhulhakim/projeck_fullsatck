const express = require("express");
const router = express.Router();
const laporanController = require("../controllers/laporanController");
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Auth Routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// Laporan Routes
// Pastikan fungsi seperti laporanController.index ADA dan TERDEFINISI
router.get("/laporan", laporanController.index);
router.get("/laporan/:id", laporanController.show);

// Gunakan verifyToken dulu, baru upload.single, baru controller
router.post("/laporan", verifyToken, upload.single("photo"), laporanController.store);

router.put("/laporan/:id", verifyToken, laporanController.update);
router.delete("/laporan/:id", verifyToken, laporanController.destroy);

module.exports = router;