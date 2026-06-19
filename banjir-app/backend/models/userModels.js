const db = require('../config/database');

class UserModel {

  // Buat user baru — password sudah di-hash dari authController
  static async create(data) {
    const sql = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
    const [result] = await db.query(sql, [
      data.name,
      data.email,
      data.password,             // sudah di-hash di authController
      data.role || 'user'        // default role: user
    ]);
    return result;
  }

  // Cari user by email (untuk login)
  static async findByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await db.query(sql, [email]);
    return rows[0];
  }

  // Cari user by ID (untuk /auth/me)
  static async findById(id) {
    const sql = `SELECT id, name, email, role, created_at FROM users WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
  }

  // Semua user (admin only)
  static async getAll() {
    const sql = `SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC`;
    const [rows] = await db.query(sql);
    return rows;
  }

  // Hapus user
  static async delete(id) {
    const sql = `DELETE FROM users WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    return result;
  }
}

module.exports = UserModel;