import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats, isLoggedIn } from "../../services/api";
import styles from "./FloodInfo.module.css";

function FloodInfo() {
  const [stats, setStats] = useState({
    total_laporan: "-", area_siaga: "-", zona_bahaya: "-"
  });

  useEffect(() => {
    if (!isLoggedIn()) return;
    getDashboardStats()
      .then(data => {
        if (data.total_laporan !== undefined) setStats(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.blur1} aria-hidden="true" />
        <div className={styles.blur2} aria-hidden="true" />

        <div className={styles.waveBg}>
          <svg className={styles.waveSvg} viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path className={styles.wave1} fill="rgba(0,180,216,0.08)"
              d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,208C672,224,768,224,864,208C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
            <path className={styles.wave2} fill="rgba(0,119,182,0.05)"
              d="M0,224L48,218.7C96,213,192,203,288,208C384,213,480,235,576,234.7C672,235,768,213,864,208C960,203,1056,213,1152,218.7C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>

        <div className={styles.inner}>
          <span className={styles.badge}>
            <i className="ti ti-antenna-bars-5" aria-hidden="true" />
            Sistem Monitoring Banjir Wilayah Depok
          </span>

          <h1 className={styles.title}>
            Pantau & Laporkan <span className={styles.accent}>Banjir</span> di Depok
          </h1>

          <p className={styles.desc}>
            Laporkan kejadian banjir di 11 kecamatan Depok secara cepat dan mudah.
            Sistem ini membantu masyarakat dan petugas memantau kondisi banjir
            serta memberikan informasi terkini mengenai status banjir.
          </p>

          <div className={styles.actions}>
            <Link to="/buat-laporan" className={styles.btnPrimary}>
              <i className="ti ti-file-plus" aria-hidden="true" />
              Buat Laporan
            </Link>
            <Link to="/daftar-laporan" className={styles.btnOutline}>
              <i className="ti ti-list-details" aria-hidden="true" />
              Lihat Laporan
            </Link>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{stats.total_laporan}</span>
              <span className={styles.statLabel}>Laporan Masuk</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{stats.area_siaga}</span>
              <span className={styles.statLabel}>Area Siaga</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{stats.zona_bahaya}</span>
              <span className={styles.statLabel}>Zona Bahaya</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FloodInfo;