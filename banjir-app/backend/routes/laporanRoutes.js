const express  = require("express");
const router   = express.Router();
const laporanController = require("../controllers/laporanController");
const photoController   = require("../controllers/photoController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");
const upload   = require("../middleware/uploadMiddleware");
const { validateLaporanMiddleware } = require("../middleware/validationMiddleware");

// GET semua laporan (publik)
router.get("/",    laporanController.index);
router.get("/:id", laporanController.show);

// POST buat laporan (harus login)
router.post("/", verifyToken, upload.single("photo"), validateLaporanMiddleware, laporanController.store);

// PUT update laporan (harus login, cek ownership di controller)
router.put("/:id", verifyToken, laporanController.update);

// DELETE hapus laporan (admin only)
router.delete("/:id", verifyToken, authorizeRole(["admin"]), laporanController.destroy);

// Foto
router.get( "/:id/photos", photoController.getByReport);
router.post("/:id/photos", verifyToken, upload.single("photo"), photoController.upload);

module.exports = router;