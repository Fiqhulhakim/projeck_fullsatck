import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats, isLoggedIn } from "../../services/api";
import styles from "./FloodInfo.module.css";

function FloodInfo() {
  const [stats, setStats] = useState({
    total_laporan: "-", area_siaga: "-", zona_bahaya: "-"
  });

  useEffect(() => {
    // Ambil stats — kalau belum login token kosong, tapi coba dulu
    getDashboardStats()
      .then(data => {
        if (data.total_laporan !== undefined) setStats(data);
      })
      .catch(() => {}); // gagal = tetap tampil "-"
  }, []);

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.blur1} aria-hidden="true" />
        <div className={styles.blur2} aria-hidden="true" />

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