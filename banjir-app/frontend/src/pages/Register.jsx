import { useState, useMemo } from "react";
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

  const isFieldActive = (key) => form[key].length > 0;

  const particles = useMemo(() =>
    [...Array(12)].map((_, i) => ({
      key: i,
      style: {
        left: `${(i * 37 + 13) % 100}%`,
        animationDelay: `${(i * 0.7) % 8}s`,
        animationDuration: `${6 + (i % 6)}s`,
        width: `${4 + (i % 6)}px`,
        height: `${4 + (i % 6)}px`,
        opacity: 0.15 + ((i * 0.03) % 0.25),
      },
    })), []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.particles}>
        {particles.map(p => (
          <span key={p.key} className={styles.drop} style={p.style} />
        ))}
      </div>
      <Navbar />
      <div className={styles.body}>
        <div className={styles.card}>
          <div className={styles.illustration}>
            <div className={styles.waveWrap}>
              <svg className={styles.waveSvg} viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path className={styles.wave1} fill="rgba(124,58,237,0.2)"
                  d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,208C672,224,768,224,864,208C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                <path className={styles.wave2} fill="rgba(124,58,237,0.1)"
                  d="M0,224L48,218.7C96,213,192,203,288,208C384,213,480,235,576,234.7C672,235,768,213,864,208C960,203,1056,213,1152,218.7C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
              </svg>
            </div>
            <div className={styles.illustContent}>
              <div className={styles.illustIcon}>
                <i className="ti ti-user-plus" />
              </div>
              <h2 className={styles.illustTitle}>Bergabunglah Sekarang</h2>
              <p className={styles.illustDesc}>
                Buat akun dan mulai laporkan kondisi banjir di sekitar Anda untuk membantu masyarakat Depok.
              </p>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <i className="ti ti-circle-check" />
                  <span>Laporkan banjir real-time</span>
                </div>
                <div className={styles.feature}>
                  <i className="ti ti-eye" />
                  <span>Pantau status terkini</span>
                </div>
                <div className={styles.feature}>
                  <i className="ti ti-bell" />
                  <span>Dapatkan notifikasi area rawan</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formPanel}>
            <div className={styles.formHeader}>
              <span className={styles.badge}>
                <i className="ti ti-user-plus" /> Daftar Akun
              </span>
              <h1 className={styles.title}>
                Buat <span className={styles.accent}>Akun</span>
              </h1>
              <p className={styles.subtitle}>
                Isi data diri Anda untuk mendaftar
              </p>
            </div>

            {error && (
              <div className={styles.alert}>
                <i className="ti ti-alert-triangle" />
                <span>{error}</span>
                <button className={styles.alertClose} onClick={() => setError("")}>
                  <i className="ti ti-x" />
                </button>
              </div>
            )}
            {success && (
              <div className={styles.alertSuccess}>
                <i className="ti ti-circle-check" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={`${styles.field} ${isFieldActive("name") ? styles.fieldActive : ""}`}>
                <div className={styles.inputWrap}>
                  <i className={`ti ti-user ${styles.inputIcon}`} />
                  <input className={styles.input} type="text" name="name" autoComplete="name" id="reg-name"
                    value={form.name} onChange={handleChange} />
                  <label htmlFor="reg-name" className={styles.floatingLabel}>Nama Lengkap</label>
                </div>
              </div>

              <div className={`${styles.field} ${isFieldActive("email") ? styles.fieldActive : ""}`}>
                <div className={styles.inputWrap}>
                  <i className={`ti ti-mail ${styles.inputIcon}`} />
                  <input className={styles.input} type="email" name="email" autoComplete="email" id="reg-email"
                    value={form.email} onChange={handleChange} />
                  <label htmlFor="reg-email" className={styles.floatingLabel}>Alamat Email</label>
                </div>
              </div>

              <div className={`${styles.field} ${isFieldActive("password") ? styles.fieldActive : ""}`}>
                <div className={styles.inputWrap}>
                  <i className={`ti ti-lock ${styles.inputIcon}`} />
                  <input className={styles.input} type={showPassword ? "text" : "password"} name="password"
                    autoComplete="new-password" id="reg-password"
                    value={form.password} onChange={handleChange} />
                  <label htmlFor="reg-password" className={styles.floatingLabel}>Password</label>
                  <button type="button" className={styles.pwToggle}
                    onClick={() => setShowPassword(!showPassword)} tabIndex={-1} aria-label="Toggle password">
                    <i className={`ti ${showPassword ? "ti-eye-off" : "ti-eye"}`} />
                  </button>
                </div>
              </div>

              <div className={`${styles.field} ${isFieldActive("confirmPassword") ? styles.fieldActive : ""}`}>
                <div className={styles.inputWrap}>
                  <i className={`ti ti-lock ${styles.inputIcon}`} />
                  <input className={styles.input} type={showPassword ? "text" : "password"} name="confirmPassword"
                    autoComplete="new-password" id="reg-confirm"
                    value={form.confirmPassword} onChange={handleChange} />
                  <label htmlFor="reg-confirm" className={styles.floatingLabel}>Konfirmasi Password</label>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className={`${styles.btnPrimary} ${loading ? styles.btnLoading : ""}`}>
                {loading ? (
                  <><span className={styles.spinner} />Memproses...</>
                ) : (
                  <>Buat Akun <i className="ti ti-arrow-right" /></>
                )}
              </button>
            </form>

            <div className={styles.divider}>
              <span>atau</span>
            </div>

            <p className={styles.switchLink}>
              Sudah punya akun? <a href="/login">Masuk sekarang</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
