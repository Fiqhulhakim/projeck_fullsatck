const express = require("express");
const router  = express.Router();
const laporanController   = require("../controllers/laporanController");
const authController      = require("../controllers/authController");
const dashboardController = require("../controllers/dashboardController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const upload        = require("../middleware/uploadMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

// ── Auth ─────────────────────────────────────────────────
router.post("/auth/register", authController.register);
router.post("/auth/login",    authController.login);
router.get( "/auth/me",       verifyToken, authController.getMe);

// ── Laporan ───────────────────────────────────────────────
router.get(   "/laporan",            laporanController.index);
router.get(   "/laporan/:id",        laporanController.show);
router.post(  "/laporan",            verifyToken, upload.single("photo"), laporanController.store);
router.put(   "/laporan/:id",        verifyToken, laporanController.update);
router.delete("/laporan/:id",        verifyToken, verifyAdmin, laporanController.destroy);
router.patch( "/laporan/:id/verify", verifyToken, verifyAdmin, laporanController.verify); // ✅ tambah

// ── Dashboard ─────────────────────────────────────────────
router.get("/dashboard/stats",                  verifyToken, dashboardController.getStats);
router.get("/dashboard/laporan-terbaru",        verifyToken, dashboardController.getLaporanTerbaru);
router.get("/dashboard/ketinggian-per-wilayah", verifyToken, dashboardController.getKetinggianPerWilayah);
router.get("/dashboard/distribusi-status",      verifyToken, dashboardController.getDistribusiStatus);
router.get("/dashboard/laporan-per-hari",       verifyToken, dashboardController.getLaporanPerHari);
router.get("/dashboard/per-kecamatan",          verifyToken, dashboardController.getPerKecamatan);

module.exports = router;