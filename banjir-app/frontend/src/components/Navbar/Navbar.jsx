import { Link, useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn, getUser, logout } from "../../services/api";
import { useState } from "react";
import styles from "./Navbar.module.css";

function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const loggedIn  = isLoggedIn();
  const user      = getUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path ? styles.active : "";

  return (
    <div className={styles.container}>
      <nav className={styles.navbar} aria-label="Navigasi utama">

        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <i className="ti ti-wave-sine" aria-hidden="true" />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>Sistem Pelaporan Banjir</span>
            <span className={styles.brandSub}>Platform Pelaporan Banjir Berbasis Web</span>
          </div>
        </div>

        {/* Desktop Links */}
        <ul className={styles.navLinks} role="list">
          <li><Link to="/" className={`${styles.navLink} ${isActive("/")}`}>
            <i className="ti ti-home-2" aria-hidden="true" />Home
          </Link></li>

          <li><Link to="/buat-laporan" className={`${styles.navLink} ${isActive("/buat-laporan")}`}>
            <i className="ti ti-file-plus" aria-hidden="true" />Buat Laporan
          </Link></li>

          <li><Link to="/daftar-laporan" className={`${styles.navLink} ${isActive("/daftar-laporan")}`}>
            <i className="ti ti-list-details" aria-hidden="true" />Daftar Laporan
          </Link></li>

          {/* Dashboard hanya muncul jika sudah login */}
          {loggedIn && (
            <li><Link to="/dashboard" className={`${styles.navLink} ${isActive("/dashboard")}`}>
              <i className="ti ti-layout-dashboard" aria-hidden="true" />Dashboard
            </Link></li>
          )}

          {/* Login atau Logout */}
          {loggedIn ? (
            <li>
              <button onClick={handleLogout} className={`${styles.navLink} ${styles.logoutBtn}`}>
                <i className="ti ti-logout" aria-hidden="true" />
                Logout ({user?.name?.split(" ")[0]})
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login" className={`${styles.navLink} ${styles.loginBtn}`}>
                <i className="ti ti-login-2" aria-hidden="true" />Login
              </Link>
            </li>
          )}
        </ul>

        {/* Hamburger */}
        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"} aria-expanded={menuOpen}>
          <span className={menuOpen ? styles.barTop : ""} />
          <span className={menuOpen ? styles.barMid : ""} />
          <span className={menuOpen ? styles.barBot : ""} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ""}`}>
          {[
            { to: "/",              label: "Home",           icon: "ti-home-2"          },
            { to: "/buat-laporan",  label: "Buat Laporan",   icon: "ti-file-plus"       },
            { to: "/daftar-laporan",label: "Daftar Laporan", icon: "ti-list-details"    },
            ...(loggedIn ? [{ to: "/dashboard", label: "Dashboard", icon: "ti-layout-dashboard" }] : []),
          ].map(({ to, label, icon }) => (
            <Link key={to} to={to}
              className={`${styles.mobileLink} ${location.pathname === to ? styles.active : ""}`}
              onClick={() => setMenuOpen(false)}>
              <i className={`ti ${icon}`} aria-hidden="true" />{label}
            </Link>
          ))}

          <hr className={styles.mobileDivider} />

          {loggedIn ? (
            <button className={`${styles.mobileLink} ${styles.mobileLogoutBtn}`}
              onClick={() => { setMenuOpen(false); handleLogout(); }}>
              <i className="ti ti-logout" aria-hidden="true" />
              Logout ({user?.name?.split(" ")[0]})
            </button>
          ) : (
            <Link to="/login" className={`${styles.mobileLink} ${styles.mobileLoginBtn}`}
              onClick={() => setMenuOpen(false)}>
              <i className="ti ti-login-2" aria-hidden="true" />Login
            </Link>
          )}
        </div>
      </div>
  );
}

export default Navbar;