const db = require('../config/database');

const createLocation = (data, callback) => {
  const sql = `
    INSERT INTO locations (report_id, latitude, longitude, address)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [
    data.report_id,
    data.latitude,
    data.longitude,
    data.address
  ], callback);
};

module.exports = { createLocation };