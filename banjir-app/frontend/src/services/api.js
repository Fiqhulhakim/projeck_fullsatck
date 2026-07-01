const BASE_URL = "http://localhost:3000/api";

// ── Auth ─────────────────────────────────────────────────
export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const registerUser = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};

// ── Laporan ───────────────────────────────────────────────
export const getLaporan = async () => {
  const res = await fetch(`${BASE_URL}/laporan`);
  return res.json();
};

export const createLaporan = async (formData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/laporan`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return res.json();
};

export const getLaporanById = async (id) => {
  const res = await fetch(`${BASE_URL}/laporan/${id}`);
  return res.json();
};

export const getPhotosByReport = async (id) => {
  const res = await fetch(`${BASE_URL}/laporan/${id}/photos`);
  return res.json();
};

export const deleteLaporan = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/laporan/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const verifikasiLaporan = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/laporan/${id}/verify`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// ── Dashboard ─────────────────────────────────────────────
export const getDashboardStats = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getLaporanTerbaru = async (limit = 5) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/dashboard/laporan-terbaru?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getKetinggianPerWilayah = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/dashboard/ketinggian-per-wilayah`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getDistribusiStatus = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/dashboard/distribusi-status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getPerKecamatan = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/dashboard/per-kecamatan`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getLaporanPerHari = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/dashboard/laporan-per-hari`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// ── Users (Admin) ─────────────────────────────────────────
export const getUsers = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const deleteUser = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// ── Helper ────────────────────────────────────────────────
export const isLoggedIn = () => !!localStorage.getItem("token");

export const getUser = () => {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};