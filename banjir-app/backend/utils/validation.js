function validateLaporan(data) {
    const errors = [];

    if (!data.title) errors.push("Judul laporan wajib diisi");
    if (!data.user_id) errors.push("User ID wajib diisi");
    
    if (data.water_level == null) {
        errors.push("Tinggi air wajib diisi");
    } else if (isNaN(data.water_level)) {
        errors.push("Tinggi air harus berupa angka");
    }

    const allowedStatus = ["pending", "aman", "siaga", "bahaya"];
    if (data.status && !allowedStatus.includes(data.status)) {
        errors.push("Status tidak valid");
    }

    return errors;
}

module.exports = validateLaporan;