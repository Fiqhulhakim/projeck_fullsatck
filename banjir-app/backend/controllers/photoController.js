const PhotoModel = require("../models/photoModels");
const fs   = require("fs");
const path = require("path");

class PhotoController {

  async getByReport(req, res) {
    try {
      const reportId = req.params.id;
      const photos = await PhotoModel.getByReportId(reportId);
      res.json({ message: "Berhasil mengambil foto", data: photos });
    } catch (error) {
      res.status(500).json({ message: "Gagal mengambil foto", error: error.message });
    }
  }

  async upload(req, res) {
    try {
      const reportId = req.params.id;
      if (!req.file) {
        return res.status(400).json({ message: "Tidak ada file yang diupload" });
      }
      const photoUrl = `/uploads/${req.file.filename}`;
      await PhotoModel.create({ report_id: reportId, photo_url: photoUrl });
      res.status(201).json({ message: "Foto berhasil diupload", photo_url: photoUrl });
    } catch (error) {
      res.status(500).json({ message: "Gagal upload foto", error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const photoId = req.params.id;
      const [rows] = await require("../config/database").query(
        `SELECT * FROM photos WHERE id = ?`, [photoId]
      );
      const photo = rows[0];
      if (!photo) {
        return res.status(404).json({ message: "Foto tidak ditemukan" });
      }
      const filePath = path.join(__dirname, "../public", photo.photo_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await PhotoModel.delete(photoId);
      res.json({ message: "Foto berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ message: "Gagal menghapus foto", error: error.message });
    }
  }
}

module.exports = new PhotoController();
