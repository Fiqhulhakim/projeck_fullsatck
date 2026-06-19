const express = require('express');
const router  = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/stats',                 dashboardController.getStats.bind(dashboardController));
router.get('/laporan-terbaru',       dashboardController.getLaporanTerbaru.bind(dashboardController));
router.get('/ketinggian-per-wilayah',dashboardController.getKetinggianPerWilayah.bind(dashboardController));
router.get('/distribusi-status',     dashboardController.getDistribusiStatus.bind(dashboardController));
router.get('/laporan-per-hari',      dashboardController.getLaporanPerHari.bind(dashboardController));
router.get('/per-kecamatan',         dashboardController.getPerKecamatan.bind(dashboardController)); // ← BARU

module.exports = router;