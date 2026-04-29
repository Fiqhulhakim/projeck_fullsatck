const db = require('../config/database');

class LaporanModel {
    static async getAll() {
        const sql = `
            SELECT reports.*, users.name as pelapor 
            FROM reports 
            JOIN users ON reports.user_id = users.id
            ORDER BY reports.created_at DESC
        `;
        const [rows] = await db.query(sql);
        return rows;
    }

    static async getById(id) {
        const sql = `SELECT * FROM reports WHERE id = ?`;
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    }

    static async create(data) {
        const sql = `
            INSERT INTO reports (user_id, title, description, water_level, status)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [
            data.user_id,
            data.title,
            data.description,
            data.water_level,
            data.status || 'pending'
        ]);
        return result;
    }

    static async update(id, data) {
        const sql = `UPDATE reports SET ? WHERE id = ?`;
        const [result] = await db.query(sql, [data, id]);
        return result;
    }

    static async delete(id) {
        const sql = `DELETE FROM reports WHERE id = ?`;
        const [result] = await db.query(sql, [id]);
        return result;
    }
}

module.exports = LaporanModel;