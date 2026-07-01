import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const navLinks = [
  { to: "/", label: "Home", icon: "ti-home-2" },
  { to: "/buat-laporan", label: "Buat Laporan", icon: "ti-file-plus" },
  { to: "/daftar-laporan", label: "Daftar Laporan", icon: "ti-list-details" },
  { to: "/dashboard", label: "Dashboard", icon: "ti-layout-dashboard" },
];

const infoLinks = [
  { to: "/hotline", label: "Hotline Darurat", icon: "ti-phone" },
  { to: "/peta", label: "Peta Rawan Banjir", icon: "ti-map-pin" },
  { to: "/bantuan", label: "Bantuan", icon: "ti-help-circle" },
  { to: "/privasi", label: "Kebijakan Privasi", icon: "ti-shield-check" },
];

function Footer() {
  return (
    <div className={styles.container}>
      <footer className={styles.footer}>
        <div className={styles.main}>

          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.brandRow}>
              <div className={styles.brandIcon}>
                <i className="ti ti-wave-sine" aria-hidden="true" />
              </div>
              <div>
                <p className={styles.brandTitle}>Sistem Pelaporan Banjir</p>
                <p className={styles.brandSub}>Platform Pelaporan Banjir Berbasis Web</p>
              </div>
            </div>
            <p className={styles.desc}>
              Platform pelaporan dan pemantauan banjir secara real-time untuk
              masyarakat dan petugas lapangan.
            </p>
            <div className={styles.socials}>
              {["ti-brand-instagram", "ti-brand-twitter", "ti-brand-facebook", "ti-mail"].map((icon) => (
                <a key={icon} href="#" className={styles.socialBtn} aria-label={icon.replace("ti-brand-", "")}>
                  <i className={`ti ${icon}`} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigasi */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Navigasi</h3>
            <ul className={styles.links}>
              {navLinks.map(({ to, label, icon }) => (
                <li key={to}>
                  <Link to={to} className={styles.link}>
                    <i className={`ti ${icon}`} aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informasi */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Informasi</h3>
            <ul className={styles.links}>
              {infoLinks.map(({ to, label, icon }) => (
                <li key={to}>
                  <Link to={to} className={styles.link}>
                    <i className={`ti ${icon}`} aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className={styles.status}>
              <span className={styles.dot} />
              Sistem aktif — semua layanan normal
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <p className={styles.copy}>
            © 2026 Sistem Pelaporan Banjir · Dikembangkan oleh{" "}
            <strong>Kelompok Beng Beng</strong> · Pemrograman Fullstack
          </p>
          <div className={styles.badge}>
            <i className="ti ti-code" aria-hidden="true" />
            Fullstack App
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;