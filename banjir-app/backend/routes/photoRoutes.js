const express = require("express");
const router  = express.Router();
const photoController = require("../controllers/photoController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// GET /api/photos/laporan/:id — ambil semua foto dari 1 laporan
router.get("/laporan/:id", photoController.getByReport);

// POST /api/photos/laporan/:id — upload foto ke laporan (harus login)
router.post("/laporan/:id", verifyToken, upload.single("photo"), photoController.upload);

// DELETE /api/photos/:id — hapus foto (admin only)
router.delete("/:id", verifyToken, verifyAdmin, photoController.delete);

module.exports = router;