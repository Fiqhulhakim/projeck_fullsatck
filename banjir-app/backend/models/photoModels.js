const db = require('../config/database');

const addPhoto = (data, callback) => {
  const sql = `
    INSERT INTO photos (report_id, photo_url)
    VALUES (?, ?)
  `;
  db.query(sql, [data.report_id, data.photo_url], callback);
};

module.exports = { addPhoto };