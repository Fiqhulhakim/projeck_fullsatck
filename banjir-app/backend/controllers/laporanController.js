const LaporanModel = require("../models/laporanModels");
const validateLaporan = require("../utils/validation");
const db = require("../config/database");

class LaporanController {
    async index(req, res) {
        try {
            const data = await LaporanModel.getAll();
            res.json({ message: "Berhasil mengambil semua data laporan", data });
        } catch (error) {
            res.status(500).json({ message: "Gagal mengambil data", error: error.message });
        }
    }

    async show(req, res) {
        try {
            const data = await LaporanModel.getById(req.params.id);
            if (!data) return res.status(404).json({ message: "Laporan tidak ditemukan" });
            res.json({ message: "Detail laporan ditemukan", data });
        } catch (error) {
            res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
        }
    }

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
                    [reportId, latitude, longitude, address]
                );
            }

            if (req.file) {
                const photoUrl = `/uploads/${req.file.filename}`;
                await db.query(`INSERT INTO photos (report_id, photo_url) VALUES (?, ?)`, [reportId, photoUrl]);
            }

            res.status(201).json({ message: "Laporan berhasil ditambahkan", reportId });
        } catch (error) {
            res.status(500).json({ message: "Gagal memproses laporan", error: error.message });
        }
    }

    async update(req, res) {
        try {
            await LaporanModel.update(req.params.id, req.body);
            res.json({ message: "Data laporan berhasil diperbarui" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async destroy(req, res) {
        try {
            await LaporanModel.delete(req.params.id);
            res.json({ message: "Laporan berhasil dihapus" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

// WAJIB menggunakan 'new' agar yang diekspor adalah instance object-nya
module.exports = new LaporanController();