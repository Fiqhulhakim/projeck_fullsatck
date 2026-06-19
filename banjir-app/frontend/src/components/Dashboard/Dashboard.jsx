import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDashboardStats,
  getLaporanTerbaru,
  getKetinggianPerWilayah,
  getDistribusiStatus,
  getPerKecamatan,
  isLoggedIn,
  getUser,
  logout,
} from "../../services/api";
import { STATUS_COLOR, STATUS_ICON } from "../../utils/constant/data";
import styles from "./Dashboard.module.css";

const barColor = { bahaya:"#ef4444", siaga:"#f59e0b", waspada:"#3b82f6", aman:"#22c55e", pending:"#94a3b8" };

function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [stats,      setStats]      = useState(null);
  const [terbaru,    setTerbaru]    = useState([]);
  const [wilayah,    setWilayah]    = useState([]);
  const [distribusi, setDistribusi] = useState([]);
  const [kecamatan,  setKecamatan]  = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) { navigate("/login"); return; }

    Promise.all([
      getDashboardStats(),
      getLaporanTerbaru(5),
      getKetinggianPerWilayah(),
      getDistribusiStatus(),
      getPerKecamatan(),
    ]).then(([s, t, w, d, k]) => {
      setStats(s);
      setTerbaru(Array.isArray(t) ? t : []);
      setWilayah(Array.isArray(w) ? w : []);
      setDistribusi(Array.isArray(d) ? d : []);
      setKecamatan(Array.isArray(k) ? k : []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className={styles.dash}>
      <p style={{ color:"#64748b", padding:"2rem" }}>Memuat data dashboard...</p>
    </div>
  );

  const maxLevel = Math.max(...wilayah.map(w => w.water_level || 0), 1);

  return (
    <div className={styles.dash}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <i className="ti ti-layout-dashboard" aria-hidden="true" />
            Dashboard Monitoring Banjir Depok
          </h1>
          <p className={styles.sub}>
            Selamat datang, <strong>{user?.name || "Admin"}</strong> ·{" "}
            {stats?.wilayah_terparah && `Wilayah terparah: ${stats.wilayah_terparah}`}
          </p>
        </div>
        <button className={styles.btnLogout} onClick={logout}>
          <i className="ti ti-logout" aria-hidden="true" /> Keluar
        </button>
      </div>

      {/* Stat Cards */}
      {stats && (
        <div className={styles.statsGrid}>
          {[
            { label:"Total Laporan",   value: stats.total_laporan,   icon:"ti-file-text",      color:"blue"  },
            { label:"Zona Bahaya",     value: stats.zona_bahaya,     icon:"ti-alert-triangle",  color:"red"   },
            { label:"Area Siaga",      value: stats.area_siaga,      icon:"ti-alert-circle",    color:"amber" },
            { label:"Laporan Aman",    value: stats.laporan_aman,    icon:"ti-check",           color:"green" },
          ].map(s => (
            <div key={s.label} className={`${styles.statCard} ${styles[s.color]}`}>
              <i className={`ti ${s.icon} ${styles.statIcon}`} aria-hidden="true" />
              <p className={styles.statNum}>{s.value}</p>
              <p className={styles.statLabel}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className={styles.grid2}>

        {/* Bar chart ketinggian air */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <i className="ti ti-chart-bar" aria-hidden="true" />
            Ketinggian Air per Wilayah (cm)
          </h2>
          {wilayah.length === 0 ? (
            <p style={{ color:"#94a3b8", fontSize:"13px" }}>Belum ada data lokasi.</p>
          ) : (
            <div className={styles.barChart}>
              {wilayah.slice(0, 7).map(w => (
                <div key={w.lokasi} className={styles.barWrap}>
                  <span className={styles.barVal}>{w.water_level}</span>
                  <div className={styles.bar} style={{
                    height: `${(w.water_level / maxLevel) * 100}%`,
                    background: barColor[w.status] || "#94a3b8"
                  }} />
                  <span className={styles.barLoc}>
                    {w.lokasi?.replace("Pancoran Mas","Pan.Mas") || "-"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Distribusi status */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <i className="ti ti-chart-donut" aria-hidden="true" />
            Distribusi Status
          </h2>
          <div className={styles.legendList}>
            {distribusi.map(d => {
              const sc = STATUS_COLOR[d.status] || STATUS_COLOR.pending;
              return (
                <div key={d.status} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: sc.text }} />
                  <span>{STATUS_ICON[d.status]} {d.status}</span>
                  <span className={styles.legendCount}>{d.jumlah} laporan</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabel per kecamatan */}
      {kecamatan.length > 0 && (
        <div className={styles.card} style={{ marginBottom:"1.5rem" }}>
          <h2 className={styles.cardTitle}>
            <i className="ti ti-map-pin" aria-hidden="true" />
            Rekapitulasi per Kecamatan Depok
          </h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Kecamatan</th>
                  <th>Total</th>
                  <th>Tertinggi (cm)</th>
                  <th>Rata-rata (cm)</th>
                  <th>🔴 Bahaya</th>
                  <th>⚠ Siaga</th>
                  <th>🔵 Waspada</th>
                </tr>
              </thead>
              <tbody>
                {kecamatan.map(k => (
                  <tr key={k.kecamatan}>
                    <td><strong>{k.kecamatan}</strong>, Depok</td>
                    <td>{k.total_laporan}</td>
                    <td>{k.ketinggian_tertinggi}</td>
                    <td>{k.rata_ketinggian}</td>
                    <td style={{ color:"#ef4444", fontWeight:500 }}>{k.bahaya || 0}</td>
                    <td style={{ color:"#f59e0b", fontWeight:500 }}>{k.siaga  || 0}</td>
                    <td style={{ color:"#3b82f6", fontWeight:500 }}>{k.waspada|| 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tabel laporan terbaru */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          <i className="ti ti-list-details" aria-hidden="true" />
          Laporan Terbaru
        </h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th><th>Judul</th><th>Wilayah</th>
                <th>Status</th><th>Ketinggian</th><th>Pelapor</th><th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {terbaru.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign:"center", color:"#94a3b8" }}>
                  Belum ada laporan
                </td></tr>
              ) : terbaru.map((r, i) => {
                const sc = STATUS_COLOR[r.status] || STATUS_COLOR.pending;
                return (
                  <tr key={r.id}>
                    <td>{i + 1}</td>
                    <td>{r.title}</td>
                    <td>{r.wilayah || "-"}</td>
                    <td>
                      <span className={styles.badge}
                        style={{ background: sc.bg, color: sc.text }}>
                        {STATUS_ICON[r.status]} {r.status}
                      </span>
                    </td>
                    <td>{r.water_level} cm</td>
                    <td>{r.pelapor}</td>
                    <td className={styles.timeCell}>
                      {new Date(r.created_at).toLocaleDateString("id-ID", {
                        day:"numeric", month:"short", year:"numeric"
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;