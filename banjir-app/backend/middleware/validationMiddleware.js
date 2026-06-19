// Validasi input laporan sebelum masuk controller
const validateLaporanMiddleware = (req, res, next) => {
  const { title, description, water_level } = req.body;
  const errors = [];

  if (!title || title.trim() === "")
    errors.push("Judul laporan wajib diisi");

  if (!description || description.trim() === "")
    errors.push("Deskripsi wajib diisi");

  if (!water_level)
    errors.push("Ketinggian air wajib diisi");
  else if (isNaN(water_level) || Number(water_level) < 0)
    errors.push("Ketinggian air harus berupa angka positif");

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validasi gagal", errors });
  }

  next();
};

// Validasi input register
const validateRegisterMiddleware = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim() === "")
    errors.push("Nama wajib diisi");

  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    errors.push("Email tidak valid");

  if (!password || password.length < 6)
    errors.push("Password minimal 6 karakter");

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validasi gagal", errors });
  }

  next();
};

module.exports = { validateLaporanMiddleware, validateRegisterMiddleware };