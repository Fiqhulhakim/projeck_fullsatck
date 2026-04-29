const multer = require("multer");
const path = require("path");

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/"); // Pastikan folder ini sudah dibuat
    },
    filename: (req, file, cb) => {
        // Format nama: 1712345678-namafile.jpg
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// Filter file (hanya gambar)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb("Error: Hanya file gambar (JPG/PNG) yang diperbolehkan!");
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB
    fileFilter: fileFilter
});

module.exports = upload;