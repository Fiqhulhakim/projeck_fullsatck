const UserModel = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = "kode_rahasia_banjir_123"; // Sebaiknya simpan di file .env

class AuthController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            
            // Cek jika email sudah terdaftar
            const userExists = await UserModel.findByEmail(email);
            if (userExists) return res.status(400).json({ message: "Email sudah digunakan" });

            await UserModel.create({ name, email, password });
            res.status(201).json({ message: "Registrasi berhasil" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserModel.findByEmail(email);

            if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

            // Cek password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: "Password salah" });

            // Buat Token JWT
            const token = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: "1d" } // Token berlaku 1 hari
            );

            res.json({
                message: "Login berhasil",
                token: token,
                user: { id: user.id, name: user.name, email: user.email }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();