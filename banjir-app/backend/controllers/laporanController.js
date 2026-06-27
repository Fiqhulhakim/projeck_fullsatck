const LaporanModel = require("../models/laporanModels");
const validateLaporan = require("../utils/validation");
const db = require("../config/database");

class LaporanController {

  // GET /api/laporan
  async index(req, res) {
    try {
      const data = await LaporanModel.getAll();
      res.json({ message: "Berhasil mengambil semua data laporan", data });
    } catch (error) {
      res.status(500).json({ message: "Gagal mengambil data", error: error.message });
    }
  }

  // GET /api/laporan/:id
  async show(req, res) {
    try {
      const data = await LaporanModel.getById(req.params.id);
      if (!data) return res.status(404).json({ message: "Laporan tidak ditemukan" });
      res.json({ message: "Detail laporan ditemukan", data });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
  }

  // POST /api/laporan
  async store(req, res) {
    try {
      const { title, description, water_level, latitude, longitude, address } = req.body;
      const user_id = req.user.id;

      const dataLaporan = { title, description, water_level, user_id };

      const errors = validateLaporan(dataLaporan);
      if (errors.length > 0) return res.status(400).json({ errors });

      const result = await LaporanModel.create(dataLaporan);
      const reportId = result.insertId;

      if (latitude && longitude) {
        await db.query(
          `INSERT INTO locations (report_id, latitude, longitude, address) VALUES (?, ?, ?, ?)`,
          [reportId, latitude, longitude, address || null]
        );
      }

      if (req.file) {
        const photoUrl = `/uploads/${req.file.filename}`;
        await db.query(
          `INSERT INTO photos (report_id, photo_url) VALUES (?, ?)`,
          [reportId, photoUrl]
        );
      }

      res.status(201).json({ message: "Laporan berhasil ditambahkan", reportId });
    } catch (error) {
      res.status(500).json({ message: "Gagal memproses laporan", error: error.message });
    }
  }

  // PUT /api/laporan/:id
  async update(req, res) {
    try {
      const laporan = await LaporanModel.getById(req.params.id);
      if (!laporan) {
        return res.status(404).json({ message: "Laporan tidak ditemukan" });
      }
      if (req.user.role !== "admin" && laporan.user_id !== req.user.id) {
        return res.status(403).json({ message: "Anda tidak berhak mengubah laporan ini" });
      }
      await LaporanModel.update(req.params.id, req.body);
      res.json({ message: "Data laporan berhasil diperbarui" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/laporan/:id
  async destroy(req, res) {
    try {
      const laporan = await LaporanModel.getById(req.params.id);
      if (!laporan) {
        return res.status(404).json({ message: "Laporan tidak ditemukan" });
      }
      await LaporanModel.delete(req.params.id);
      res.json({ message: "Laporan berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ✅ PATCH /api/laporan/:id/verify — admin only
  //    Konversi status ke level darurat berdasarkan water_level
  async verify(req, res) {
    try {
      const laporan = await LaporanModel.getById(req.params.id);
      if (!laporan) {
        return res.status(404).json({ message: "Laporan tidak ditemukan" });
      }
      if (laporan.status === "verified" || ["aman","waspada","siaga","bahaya"].includes(laporan.status)) {
        return res.status(400).json({ message: "Laporan sudah diverifikasi sebelumnya" });
      }
      const wl = Number(laporan.water_level);
      let levelDarurat = "aman";
      if (wl >= 100) levelDarurat = "bahaya";
      else if (wl >= 60) levelDarurat = "siaga";
      else if (wl >= 30) levelDarurat = "waspada";
      await db.query(
        `UPDATE reports SET status = ? WHERE id = ?`,
        [levelDarurat, req.params.id]
      );
      res.json({ message: `Laporan diverifikasi — status: ${levelDarurat}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new LaporanController();