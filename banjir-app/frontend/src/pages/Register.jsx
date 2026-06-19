import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { registerUser } from "../services/api";
import styles from "./Register.module.css";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Semua field wajib diisi."); return;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter."); return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok."); return;
    }

    setLoading(true);
    try {
      const data = await registerUser(form.name, form.email, form.password);
      if (data.message === "Registrasi berhasil") {
        setSuccess("Akun berhasil dibuat! Mengalihkan ke halaman login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.message || "Registrasi gagal.");
      }
    } catch {
      setError("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.body}>
        <div className={styles.card}>
          <div className={styles.badge}>Buat Akun Baru</div>
          <h1 className={styles.title}>Daftar <em>Sekarang</em></h1>
          <p className={styles.subtitle}>
            Bergabung untuk melaporkan dan memantau banjir di Depok
          </p>

          {error   && <div className={styles.errorMsg}>⚠ {error}</div>}
          {success && <div className={styles.successMsg}>✅ {success}</div>}

          <div>
            {/* Nama */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Nama Lengkap</label>
              <div className={styles.inputWrapper}>
                <input className={styles.input} type="text" name="name"
                  placeholder="Masukkan nama lengkap"
                  value={form.name} onChange={handleChange} autoComplete="name" />
                <span className={styles.inputIcon}>👤</span>
              </div>
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <div className={styles.inputWrapper}>
                <input className={styles.input} type="email" name="email"
                  placeholder="nama@email.com"
                  value={form.email} onChange={handleChange} autoComplete="email" />
                <span className={styles.inputIcon}>✉</span>
              </div>
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <input className={styles.input} name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  value={form.password} onChange={handleChange} />
                <span className={styles.inputIcon}>🔒</span>
                <button type="button" className={styles.pwToggle}
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Konfirmasi Password</label>
              <div className={styles.inputWrapper}>
                <input className={styles.input} name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ulangi password"
                  value={form.confirmPassword} onChange={handleChange} />
                <span className={styles.inputIcon}>🔒</span>
              </div>
            </div>

            <button type="button" disabled={loading}
              className={`${styles.btnRegister}${loading ? ` ${styles.loading}` : ""}`}
              onClick={handleSubmit}>
              {loading ? <><span className={styles.spinner} />Memproses...</> : "Daftar →"}
            </button>
          </div>

          <div className={styles.divider}>atau</div>
          <div className={styles.loginRow}>
            Sudah punya akun? <a href="/login">Masuk sekarang</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;