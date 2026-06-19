const db = require('../config/database');

class DashboardController {

  // GET /api/dashboard/stats
  async getStats(req, res) {
    try {
      const [[{ total_laporan }]] = await db.query(
        `SELECT COUNT(*) AS total_laporan FROM reports`
      );

      const [statusRows] = await db.query(`
        SELECT status, COUNT(*) AS jumlah 
        FROM reports GROUP BY status
      `);

      const byStatus = { pending: 0, verified: 0, rejected: 0, aman: 0, siaga: 0, waspada: 0, bahaya: 0 };
      statusRows.forEach(r => { byStatus[r.status] = r.jumlah; });

      const [[{ rata_air }]] = await db.query(
        `SELECT ROUND(AVG(water_level), 1) AS rata_air FROM reports`
      );

      const [[{ laporan_hari_ini }]] = await db.query(`
        SELECT COUNT(*) AS laporan_hari_ini FROM reports 
        WHERE DATE(created_at) = CURDATE()
      `);

      // Wilayah paling terdampak (ketinggian air tertinggi)
      const [[wilayah_terparah]] = await db.query(`
        SELECT wilayah, MAX(water_level) AS max_air
        FROM reports
        GROUP BY wilayah
        ORDER BY max_air DESC
        LIMIT 1
      `);

      res.json({
        total_laporan,
        laporan_hari_ini,
        rata_rata_ketinggian_air: rata_air || 0,
        wilayah_terparah: wilayah_terparah?.wilayah || '-',
        zona_bahaya:     byStatus.bahaya,
        area_siaga:      byStatus.siaga,
        area_waspada:    byStatus.waspada,
        laporan_aman:    byStatus.aman,
        laporan_pending: byStatus.pending,
        by_status: byStatus,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/dashboard/laporan-terbaru?limit=5
  async getLaporanTerbaru(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const [rows] = await db.query(`
        SELECT 
          reports.id, reports.title, reports.wilayah,
          reports.water_level, reports.status, reports.created_at,
          users.name AS pelapor
        FROM reports
        JOIN users ON reports.user_id = users.id
        ORDER BY reports.created_at DESC
        LIMIT ?
      `, [limit]);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/dashboard/ketinggian-per-wilayah
  async getKetinggianPerWilayah(req, res) {
    try {
      const [rows] = await db.query(`
        SELECT 
          wilayah AS lokasi,
          MAX(water_level) AS water_level,
          status
        FROM reports
        GROUP BY wilayah, status
        ORDER BY water_level DESC
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/dashboard/distribusi-status
  async getDistribusiStatus(req, res) {
    try {
      const [rows] = await db.query(`
        SELECT status, COUNT(*) AS jumlah
        FROM reports
        GROUP BY status
        ORDER BY jumlah DESC
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/dashboard/laporan-per-hari
  async getLaporanPerHari(req, res) {
    try {
      const [rows] = await db.query(`
        SELECT DATE(created_at) AS tanggal, COUNT(*) AS jumlah
        FROM reports
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY tanggal ASC
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/dashboard/per-kecamatan  ← BARU khusus Depok
  async getPerKecamatan(req, res) {
    try {
      const [rows] = await db.query(`
        SELECT 
          wilayah AS kecamatan,
          COUNT(*) AS total_laporan,
          MAX(water_level) AS ketinggian_tertinggi,
          ROUND(AVG(water_level), 1) AS rata_ketinggian,
          SUM(status = 'bahaya')  AS bahaya,
          SUM(status = 'siaga')   AS siaga,
          SUM(status = 'waspada') AS waspada,
          SUM(status = 'aman')    AS aman
        FROM reports
        GROUP BY wilayah
        ORDER BY ketinggian_tertinggi DESC
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new DashboardController();