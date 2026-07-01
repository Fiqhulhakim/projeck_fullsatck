const express = require('express');
const router  = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/stats',                 dashboardController.getStats);
router.get('/laporan-terbaru',       dashboardController.getLaporanTerbaru);
router.get('/ketinggian-per-wilayah',dashboardController.getKetinggianPerWilayah);
router.get('/distribusi-status',     dashboardController.getDistribusiStatus);
router.get('/laporan-per-hari',      dashboardController.getLaporanPerHari);
router.get('/per-kecamatan',         dashboardController.getPerKecamatan);

module.exports = router;