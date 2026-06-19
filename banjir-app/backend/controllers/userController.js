const UserModel = require("../models/userModels");
const bcrypt    = require("bcryptjs");

class UserController {

  // GET /api/users — admin only
  async index(req, res) {
    try {
      const data = await UserModel.getAll();
      res.json({ data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/users/:id
  async show(req, res) {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
      res.json({ data: user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/users/:id — update profil
  async update(req, res) {
    try {
      const { name, email, password } = req.body;

      // User hanya bisa edit dirinya sendiri, admin bisa semua
      if (req.user.role !== "admin" && req.user.id !== parseInt(req.params.id)) {
        return res.status(403).json({ message: "Tidak berhak mengubah user ini" });
      }

      const updates = { name, email };

      if (password) {
        updates.password = await bcrypt.hash(password, 10);
      }

      const fields = Object.keys(updates).map(k => `${k} = ?`).join(", ");
      const values = [...Object.values(updates), req.params.id];

      await require("../config/database").query(
        `UPDATE users SET ${fields} WHERE id = ?`, values
      );

      res.json({ message: "Profil berhasil diperbarui" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/users/:id — admin only
  async destroy(req, res) {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

      await UserModel.delete(req.params.id);
      res.json({ message: "User berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();