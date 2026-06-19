import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { loginUser } from "../services/api";
import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Email dan password wajib diisi."); return; }
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.message || "Login gagal, periksa email dan password.");
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
          <div className={styles.badge}>Sistem Masuk</div>
          <h1 className={styles.title}>Selamat <em>Datang</em></h1>
          <p className={styles.subtitle}>Masuk untuk melanjutkan ke dashboard Anda</p>

          {error && (
            <div className={styles.errorMsg}><span>⚠</span> {error}</div>
          )}

          <div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <div className={styles.inputWrapper}>
                <input className={styles.input} type="email" placeholder="nama@email.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                <span className={styles.inputIcon}>✉</span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <input className={styles.input} type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password" value={password}
                  onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                <span className={styles.inputIcon}>🔒</span>
                <button type="button" className={styles.pwToggle}
                  onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div className={styles.forgotRow}>
              <a href="#" className={styles.forgotLink}>Lupa password?</a>
            </div>

            <button type="button" disabled={loading}
              className={`${styles.btnLogin}${loading ? ` ${styles.loading}` : ""}`}
              onClick={handleSubmit}>
              {loading ? <><span className={styles.spinner} />Memproses...</> : "Masuk →"}
            </button>
          </div>

          <div className={styles.divider}>atau</div>
          <div className={styles.registerRow}>
            Belum punya akun? <a href="/register">Daftar sekarang</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;