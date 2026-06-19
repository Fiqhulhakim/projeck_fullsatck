const db = require('../config/database');

class LokasiModel {

  static async create(data) {
    const sql = `
      INSERT INTO locations (report_id, latitude, longitude, address)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
      data.report_id,
      data.latitude,
      data.longitude,
      data.address || null
    ]);
    return result;
  }

  static async getByReportId(reportId) {
    const [rows] = await db.query(
      `SELECT * FROM locations WHERE report_id = ?`, [reportId]
    );
    return rows[0];
  }

  static async update(reportId, data) {
    const sql = `
      UPDATE locations 
      SET latitude = ?, longitude = ?, address = ?
      WHERE report_id = ?
    `;
    const [result] = await db.query(sql, [
      data.latitude, data.longitude, data.address, reportId
    ]);
    return result;
  }
}

module.exports = LokasiModel;