// Validasi data laporan sebelum disimpan ke database
// Dipakai di laporanController.js: const validateLaporan = require('../utils/validation');

const validateLaporan = (data) => {
  const errors = [];

  if (!data.title || data.title.trim() === "") {
    errors.push("Judul laporan wajib diisi");
  } else if (data.title.length > 255) {
    errors.push("Judul maksimal 255 karakter");
  }

  if (!data.description || data.description.trim() === "") {
    errors.push("Deskripsi wajib diisi");
  }

  if (data.water_level === undefined || data.water_level === null || data.water_level === "") {
    errors.push("Ketinggian air wajib diisi");
  } else if (isNaN(data.water_level)) {
    errors.push("Ketinggian air harus berupa angka");
  } else if (Number(data.water_level) < 0) {
    errors.push("Ketinggian air tidak boleh negatif");
  }

  if (!data.user_id) {
    errors.push("User ID wajib ada");
  }

  return errors; // [] artinya valid
};

module.exports = validateLaporan;