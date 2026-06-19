const db = require('../config/database');

class LaporanModel {

    // ✅ GET ALL
    static async getAll() {
        const sql = `
            SELECT 
                reports.*, 
                users.name AS pelapor
            FROM reports 
            JOIN users ON reports.user_id = users.id
            ORDER BY reports.created_at DESC
        `;
        const [rows] = await db.query(sql);
        return rows;
    }

    // ✅ GET BY ID
    static async getById(id) {
        const sql = `
            SELECT 
                reports.*, 
                users.name AS pelapor,
                users.email
            FROM reports
            JOIN users ON reports.user_id = users.id
            WHERE reports.id = ?
        `;
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    }

    // ✅ CREATE
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

    // 🔥 UPDATE (FIX — TANPA SET ?)
    static async update(id, data) {
        const { title, description, water_level, status } = data;

        const sql = `
            UPDATE reports 
            SET title = ?, description = ?, water_level = ?, status = ?
            WHERE id = ?
        `;

        const values = [
            title,
            description,
            water_level,
            status || 'pending',
            id
        ];

        const [result] = await db.query(sql, values);
        return result;
    }

    // ✅ DELETE
    static async delete(id) {
        const sql = `DELETE FROM reports WHERE id = ?`;
        const [result] = await db.query(sql, [id]);
        return result;
    }
}

module.exports = LaporanModel;