const db = require('../config/database');

// ambil semua laporan
const getAllReports = (callback) => {
  const sql = `
    SELECT reports.*, users.name 
    FROM reports 
    JOIN users ON reports.user_id = users.id
    ORDER BY reports.created_at DESC
  `;
  db.query(sql, callback);
};

// ambil laporan by id
const getReportById = (id, callback) => {
  const sql = `SELECT * FROM reports WHERE id = ?`;
  db.query(sql, [id], callback);
};

// tambah laporan
const createReport = (data, callback) => {
  const sql = `
    INSERT INTO reports (user_id, title, description, water_level, status)
    VALUES (?, ?, ?, ?, 'pending')
  `;
  db.query(sql, [
    data.user_id,
    data.title,
    data.description,
    data.water_level
  ], callback);
};

// update status laporan
const updateStatus = (id, status, callback) => {
  const sql = `UPDATE reports SET status = ? WHERE id = ?`;
  db.query(sql, [status, id], callback);
};

// hapus laporan
const deleteReport = (id, callback) => {
  const sql = `DELETE FROM reports WHERE id = ?`;
  db.query(sql, [id], callback);
};

module.exports = {
  getAllReports,
  getReportById,
  createReport,
  updateStatus,
  deleteReport
};