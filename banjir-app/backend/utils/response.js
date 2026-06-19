// Helper untuk format response API yang konsisten
// Penggunaan: const { ok, fail, notFound } = require('../utils/response');

const ok = (res, data = null, message = "Berhasil", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

const created = (res, data = null, message = "Data berhasil dibuat") => {
  return ok(res, data, message, 201);
};

const fail = (res, message = "Terjadi kesalahan", status = 500, errors = null) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(status).json(body);
};

const badRequest = (res, message = "Input tidak valid", errors = null) => {
  return fail(res, message, 400, errors);
};

const unauthorized = (res, message = "Silakan login terlebih dahulu") => {
  return fail(res, message, 401);
};

const forbidden = (res, message = "Akses ditolak") => {
  return fail(res, message, 403);
};

const notFound = (res, message = "Data tidak ditemukan") => {
  return fail(res, message, 404);
};

module.exports = { ok, created, fail, badRequest, unauthorized, forbidden, notFound };