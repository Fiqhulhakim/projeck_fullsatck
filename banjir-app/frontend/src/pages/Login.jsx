import { useState, useMemo } from "react";
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
                <path className={styles.wave1} fill="rgba(0,180,216,0.25)"
                  d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,208C672,224,768,224,864,208C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                <path className={styles.wave2} fill="rgba(0,180,216,0.15)"
                  d="M0,224L48,218.7C96,213,192,203,288,208C384,213,480,235,576,234.7C672,235,768,213,864,208C960,203,1056,213,1152,218.7C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
              </svg>
            </div>
            <div className={styles.illustContent}>
              <div className={styles.illustIcon}>
                <i className="ti ti-wave-sine" />
              </div>
              <h2 className={styles.illustTitle}>Sistem Pelaporan Banjir</h2>
              <p className={styles.illustDesc}>
                Pantau dan laporkan kondisi banjir di wilayah Depok secara real-time.
              </p>
              <div className={styles.illustStats}>
                <div className={styles.illustStat}>
                  <span className={styles.illustStatNum}>11</span>
                  <span className={styles.illustStatLabel}>Kecamatan</span>
                </div>
                <div className={styles.illustStat}>
                  <span className={styles.illustStatNum}>24/7</span>
                  <span className={styles.illustStatLabel}>Monitoring</span>
                </div>
                <div className={styles.illustStat}>
                  <span className={styles.illustStatNum}>Real-time</span>
                  <span className={styles.illustStatLabel}>Laporan</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formPanel}>
            <div className={styles.formHeader}>
              <span className={styles.badge}>
                <i className="ti ti-lock-access" /> Portal Login
              </span>
              <h1 className={styles.title}>
                Selamat <span className={styles.accent}>Datang</span>
              </h1>
              <p className={styles.subtitle}>
                Masuk untuk melanjutkan
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

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={`${styles.field} ${email ? styles.fieldActive : ""}`}>
                <div className={styles.inputWrap}>
                  <i className={`ti ti-mail ${styles.inputIcon}`} />
                  <input
                    className={styles.input}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    id="login-email"
                  />
                  <label htmlFor="login-email" className={styles.floatingLabel}>Email</label>
                </div>
              </div>

              <div className={`${styles.field} ${password ? styles.fieldActive : ""}`}>
                <div className={styles.inputWrap}>
                  <i className={`ti ti-lock ${styles.inputIcon}`} />
                  <input
                    className={styles.input}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    id="login-password"
                  />
                  <label htmlFor="login-password" className={styles.floatingLabel}>Password</label>
                  <button
                    type="button"
                    className={styles.pwToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    <i className={`ti ${showPassword ? "ti-eye-off" : "ti-eye"}`} />
                  </button>
                </div>
              </div>

              <div className={styles.actions}>
                <a href="#" className={styles.forgotLink}>
                  Lupa password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`${styles.btnPrimary} ${loading ? styles.btnLoading : ""}`}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner} />
                    Memproses...
                  </>
                ) : (
                  <>
                    Login
                  </>
                )}
              </button>
            </form>

            <p className={styles.switchLink}>
              Belum punya akun? <a href="/register">Daftar sekarang</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
