const db = require('../config/database');
const bcrypt = require('bcryptjs');

class UserModel {
    static async create(data) {
        // Hash password sebelum disimpan
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        const [result] = await db.query(sql, [data.name, data.email, hashedPassword]);
        return result;
    }

    static async findByEmail(email) {
        const sql = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await db.query(sql, [email]);
        return rows[0];
    }
}

module.exports = UserModel;