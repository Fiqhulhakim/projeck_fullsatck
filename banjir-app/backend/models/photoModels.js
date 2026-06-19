const db = require('../config/database');

class PhotoModel {

  static async create(data) {
    const [result] = await db.query(
      `INSERT INTO photos (report_id, photo_url) VALUES (?, ?)`,
      [data.report_id, data.photo_url]
    );
    return result;
  }

  static async getByReportId(reportId) {
    const [rows] = await db.query(
      `SELECT * FROM photos WHERE report_id = ?`, [reportId]
    );
    return rows;
  }

  static async delete(id) {
    const [result] = await db.query(`DELETE FROM photos WHERE id = ?`, [id]);
    return result;
  }
}

module.exports = PhotoModel;