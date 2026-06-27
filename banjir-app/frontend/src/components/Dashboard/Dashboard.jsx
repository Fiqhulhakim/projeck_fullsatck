import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDashboardStats,
  getLaporanTerbaru,
  getKetinggianPerWilayah,
  getDistribusiStatus,
  getPerKecamatan,
  getLaporan,
  getLaporanPerHari,
  getUsers,
  deleteUser,
  isLoggedIn,
  getUser,
  logout,
  verifikasiLaporan,
} from "../../services/api";
import { STATUS_COLOR, STATUS_ICON, waterLevelToStatus } from "../../utils/constant/data";
import styles from "./Dashboard.module.css";

const barColor = { bahaya:"#ef4444", siaga:"#f59e0b", waspada:"#3b82f6", aman:"#22c55e", pending:"#94a3b8" };

const statCardMeta = [
  { label:"Total Laporan",   key:"total_laporan",   icon:"ti-file-text"      },
  { label:"Zona Bahaya",     key:"zona_bahaya",     icon:"ti-alert-octagon"  },
  { label:"Area Siaga",      key:"area_siaga",      icon:"ti-alert-triangle" },
  { label:"Laporan Aman",    key:"laporan_aman",    icon:"ti-shield-check"   },
];

function Skeleton() {
  return (
    <div className={styles.dash}>
      <div className={styles.skelHeader} />
      <div className={styles.statsGrid}>
        {[1,2,3,4].map(i => <div key={i} className={styles.skelCard} />)}
      </div>
      <div className={styles.grid2}>
        <div className={styles.skelCard} style={{ height:260 }} />
        <div className={styles.skelCard} style={{ height:260 }} />
      </div>
      <div className={styles.skelCard} style={{ height:200 }} />
      <div className={styles.skelCard} style={{ height:260 }} />
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const isAdmin = user?.role === "admin";

  const [stats,           setStats]           = useState(null);
  const [terbaru,         setTerbaru]         = useState([]);
  const [wilayah,         setWilayah]         = useState([]);
  const [distribusi,      setDistribusi]      = useState([]);
  const [kecamatan,       setKecamatan]       = useState([]);
  const [semuaLaporan,    setSemuaLaporan]    = useState([]);
  const [laporanPerHari,  setLaporanPerHari]  = useState([]);
  const [users,           setUsers]           = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [verifLoading,    setVerifLoading]    = useState(null);

  useEffect(() => {
    if (!isLoggedIn()) { navigate("/login"); return; }

    const promises = [
      getDashboardStats(),
      getLaporanTerbaru(5),
      getKetinggianPerWilayah(),
      getDistribusiStatus(),
      getPerKecamatan(),
      getLaporanPerHari(),
    ];

    if (isAdmin) {
      promises.push(getLaporan());
      promises.push(getUsers());
    }

    Promise.all(promises).then(([s, t, w, d, k, lph, ...rest]) => {
      setStats(s);
      setTerbaru(Array.isArray(t) ? t : []);
      setWilayah(Array.isArray(w) ? w : []);
      setDistribusi(Array.isArray(d) ? d : []);
      setKecamatan(Array.isArray(k) ? k : []);
      setLaporanPerHari(Array.isArray(lph) ? lph : []);
      if (isAdmin) {
        setSemuaLaporan(Array.isArray(rest[0]?.data) ? rest[0].data : []);
        setUsers(Array.isArray(rest[1]?.data) ? rest[1].data : []);
      }
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [navigate, isAdmin]);

  const handleVerify = useCallback(async (id) => {
    setVerifLoading(id);
    try {
      await verifikasiLaporan(id);
      const res = await getLaporan();
      setSemuaLaporan(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setVerifLoading(null);
    }
  }, []);

  const handleDeleteUser = useCallback(async (id) => {
    if (!confirm("Hapus user ini?")) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getDisplayStatus = useCallback((report) => {
    const s = report.status;
    if (s === "pending" || s === "verified" || s === "rejected") {
      return waterLevelToStatus(report.water_level);
    }
    return s;
  }, []);

  const displayStatusCount = useCallback((list, targetStatus) => {
    return list.filter(r => getDisplayStatus(r) === targetStatus).length;
  }, [getDisplayStatus]);

  if (loading) return <Skeleton />;

  const maxLevel = Math.max(...wilayah.map(w => w.water_level || 0), 1);
  const latestLaporan = isAdmin
    ? semuaLaporan.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10)
    : terbaru.filter(r => r.status !== "pending").sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const pendingLaporan = semuaLaporan.filter(l => l.status === "pending").sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const maxPerHari = Math.max(...laporanPerHari.map(l => l.jumlah), 1);

  return (
    <div className={styles.dash}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <span className={styles.badge}>
            <i className="ti ti-layout-dashboard" />
            Dashboard Monitoring
          </span>
          <h1 className={styles.title}>
            Overview <span className={styles.accent}>Banjir Depok</span>
          </h1>
          <p className={styles.sub}>
            Selamat datang kembali, <strong>{user?.name || "Admin"}</strong>
            {stats?.wilayah_terparah && (
              <> · Wilayah terparah: <span className={styles.highlight}>{stats.wilayah_terparah}</span></>
            )}
          </p>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.liveBadge}>
            <span className={styles.liveDot} />
            Live
          </span>
          <button className={styles.btnLogout} onClick={logout}>
            <i className="ti ti-logout" /> Keluar
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      {stats && (
        <div className={styles.statsGrid}>
          {statCardMeta.map(s => {
            let val = stats[s.key] ?? 0;
            if (s.key !== "total_laporan") {
              const statusMap = { zona_bahaya:"bahaya", area_siaga:"siaga", laporan_aman:"aman" };
              const source = isAdmin ? semuaLaporan : latestLaporan;
              val = displayStatusCount(source, statusMap[s.key]);
            }
            return (
              <div key={s.key} className={styles.statCard}>
                <div className={styles.statIconWrap}>
                  <i className={`ti ${s.icon}`} />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statNum}>{val}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Charts Row ── */}
      <div className={styles.grid2}>

        {/* Bar chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <i className="ti ti-chart-bar" />
              Ketinggian Air per Wilayah
            </h2>
            <span className={styles.cardUnit}>cm</span>
          </div>
          {wilayah.length === 0 ? (
            <p className={styles.empty}>Belum ada data lokasi.</p>
          ) : (
            <div className={styles.barChart}>
              {wilayah.slice(0, 7).map(w => (
                <div key={w.lokasi} className={styles.barWrap}>
                  <span className={styles.barVal}>{w.water_level}</span>
                  <div className={styles.barTrack}>
                    <div className={styles.bar} style={{
                      height: `${(w.water_level / maxLevel) * 100}%`,
                      background: barColor[waterLevelToStatus(w.water_level)] || "#94a3b8"
                    }} />
                  </div>
                  <span className={styles.barLoc}>
                    {w.lokasi?.replace("Pancoran Mas","Pan.Mas") || "-"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Distribusi Status */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <i className="ti ti-chart-donut" />
              Distribusi Status
            </h2>
          </div>
          <div className={styles.legendList}>
            {(() => {
              const data = isAdmin
                ? ["bahaya","siaga","waspada","aman"].map(st => ({
                    status: st,
                    jumlah: displayStatusCount(semuaLaporan, st),
                  })).filter(d => d.jumlah > 0)
                : distribusi.filter(d => ["aman","waspada","siaga","bahaya"].includes(d.status));
              if (data.length === 0) return <p className={styles.empty}>Belum ada data.</p>;
              const total = data.reduce((s, d) => s + d.jumlah, 0) || 1;
              return data.map(d => {
                const sc = STATUS_COLOR[d.status] || STATUS_COLOR.pending;
                const pct = Math.round((d.jumlah / total) * 100);
                return (
                  <div key={d.status} className={styles.legendItem}>
                    <div className={styles.legendLeft}>
                      <span className={styles.legendDot} style={{ background: sc.text }} />
                      <span className={styles.legendLabel}>
                        <i className={`ti ${STATUS_ICON[d.status] || "ti-info-circle"}`} />
                        {d.status}
                      </span>
                    </div>
                    <div className={styles.legendRight}>
                      <div className={styles.legendBarTrack}>
                        <div className={styles.legendBar} style={{ width:`${pct}%`, background: sc.text }} />
                      </div>
                      <span className={styles.legendCount}>{d.jumlah}</span>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {/* ── Tabel per Kecamatan ── */}
      {kecamatan.length > 0 && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <i className="ti ti-map-pin" />
              Rekapitulasi per Kecamatan
            </h2>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Kecamatan</th>
                  <th>Total</th>
                  <th>Tertinggi</th>
                  <th>Rata-rata</th>
                  <th><i className="ti ti-alert-octagon" style={{color:"#ef4444"}} /> Bahaya</th>
                  <th><i className="ti ti-alert-triangle" style={{color:"#f59e0b"}} /> Siaga</th>
                  <th><i className="ti ti-wave-sine" style={{color:"#3b82f6"}} /> Waspada</th>
                </tr>
              </thead>
              <tbody>
                {kecamatan.map(k => (
                  <tr key={k.kecamatan}>
                    <td><span className={styles.kecName}>{k.kecamatan}</span></td>
                    <td className={styles.num}>{k.total_laporan}</td>
                    <td className={styles.num}>{k.ketinggian_tertinggi} <span className={styles.unit}>cm</span></td>
                    <td className={styles.num}>{k.rata_ketinggian} <span className={styles.unit}>cm</span></td>
                    <td><span className={styles.statusBadge} style={{background:"rgba(239,68,68,0.12)", color:"#ef4444"}}>{k.bahaya || 0}</span></td>
                    <td><span className={styles.statusBadge} style={{background:"rgba(245,158,11,0.12)", color:"#f59e0b"}}>{k.siaga || 0}</span></td>
                    <td><span className={styles.statusBadge} style={{background:"rgba(59,130,246,0.12)", color:"#3b82f6"}}>{k.waspada || 0}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tabel Laporan Terbaru ── */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            <i className="ti ti-list-details" />
            Laporan Terbaru
          </h2>
          <span className={styles.cardUnit}>{latestLaporan.length} laporan</span>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th><th>Judul</th><th>Wilayah</th>
                <th>Status</th><th>Ketinggian</th><th>Pelapor</th><th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {latestLaporan.length === 0 ? (
                <tr><td colSpan="7" className={styles.emptyCell}>Belum ada laporan</td></tr>
              ) : latestLaporan.map((r, i) => {
                const ds = getDisplayStatus(r);
                const sc = STATUS_COLOR[ds] || STATUS_COLOR.pending;
                return (
                  <tr key={r.id}>
                    <td className={styles.rowNum}>{i + 1}</td>
                    <td><span className={styles.reportTitle}>{r.title}</span></td>
                    <td>{r.wilayah || "-"}</td>
                    <td>
                      <span className={styles.badge} style={{ background: sc.bg, color: sc.text }}>
                        <i className={`ti ${STATUS_ICON[ds] || "ti-info-circle"}`} />
                        {ds}
                      </span>
                    </td>
                    <td className={styles.num}>{r.water_level} <span className={styles.unit}>cm</span></td>
                    <td className={styles.pelapor}>{r.pelapor || r.user_id || "-"}</td>
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

      {/* ── Admin: Antrean Pending ── */}
      {isAdmin && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <i className="ti ti-clock-hourglass" />
              Antrean Laporan Baru
            </h2>
            <span className={styles.pendingCount}>{pendingLaporan.length} menunggu</span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th><th>Judul</th><th>Wilayah</th>
                  <th>Ketinggian</th><th>Pelapor</th><th>Waktu</th><th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pendingLaporan.length === 0 ? (
                  <tr><td colSpan="7" className={styles.emptyCell}>Tidak ada antrean</td></tr>
                ) : pendingLaporan.map((r, i) => (
                  <tr key={r.id}>
                    <td className={styles.rowNum}>{i + 1}</td>
                    <td><span className={styles.reportTitle}>{r.title}</span></td>
                    <td>{r.wilayah || "-"}</td>
                    <td className={styles.num}>{r.water_level} <span className={styles.unit}>cm</span></td>
                    <td className={styles.pelapor}>{r.pelapor || r.user_id || "-"}</td>
                    <td className={styles.timeCell}>
                      {new Date(r.created_at).toLocaleDateString("id-ID", {
                        day:"numeric", month:"short", year:"numeric"
                      })}
                    </td>
                    <td>
                      <button
                        className={styles.btnVerify}
                        onClick={() => handleVerify(r.id)}
                        disabled={verifLoading === r.id}
                      >
                        {verifLoading === r.id ? "..." : "Verifikasi"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Admin: Grafik Performa Sistem ── */}
      {isAdmin && (
        <div className={styles.grid2}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <i className="ti ti-chart-line" />
                Grafik Performa Sistem
              </h2>
            </div>
            {laporanPerHari.length === 0 ? (
              <p className={styles.empty}>Belum cukup data.</p>
            ) : (
              <div className={styles.lineChart}>
                {laporanPerHari.map(l => {
                  const pct = (l.jumlah / maxPerHari) * 100;
                  const hari = new Date(l.tanggal).toLocaleDateString("id-ID", { weekday:"short" });
                  return (
                    <div key={l.tanggal} className={styles.lineItem}>
                      <span className={styles.lineVal}>{l.jumlah}</span>
                      <div className={styles.lineTrack}>
                        <div className={styles.lineBar} style={{ height: `${pct}%` }} />
                      </div>
                      <span className={styles.lineLabel}>{hari}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card status sistem */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <i className="ti ti-server" />
                Status Sistem
              </h2>
            </div>
            <div className={styles.sysGrid}>
              <div className={styles.sysItem}>
                <i className="ti ti-database" />
                <div>
                  <span className={styles.sysLabel}>Database</span>
                  <span className={`${styles.sysStatus} ${styles.sysOk}`}>Connected</span>
                </div>
              </div>
              <div className={styles.sysItem}>
                <i className="ti ti-cloud-upload" />
                <div>
                  <span className={styles.sysLabel}>API Server</span>
                  <span className={`${styles.sysStatus} ${styles.sysOk}`}>Running</span>
                </div>
              </div>
              <div className={styles.sysItem}>
                <i className="ti ti-report-analytics" />
                <div>
                  <span className={styles.sysLabel}>Total Laporan</span>
                  <span className={styles.sysValue}>{stats?.total_laporan || 0}</span>
                </div>
              </div>
              <div className={styles.sysItem}>
                <i className="ti ti-users" />
                <div>
                  <span className={styles.sysLabel}>User Aktif</span>
                  <span className={styles.sysValue}>{users.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Admin: Manajemen User ── */}
      {isAdmin && users.length > 0 && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <i className="ti ti-users" />
              Manajemen User
            </h2>
            <span className={styles.cardUnit}>{users.length} user</span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th><th>Nama</th><th>Email</th><th>Role</th><th>Bergabung</th><th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id}>
                    <td className={styles.rowNum}>{i + 1}</td>
                    <td><span className={styles.reportTitle}>{u.name}</span></td>
                    <td className={styles.pelapor}>{u.email}</td>
                    <td>
                      <span className={styles.badge} style={{
                        background: u.role === "admin" ? "rgba(239,68,68,0.1)" : "rgba(99,102,241,0.1)",
                        color: u.role === "admin" ? "#dc2626" : "#6366f1"
                      }}>
                        <i className={`ti ${u.role === "admin" ? "ti-shield" : "ti-user"}`} />
                        {u.role}
                      </span>
                    </td>
                    <td className={styles.timeCell}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString("id-ID", {
                        day:"numeric", month:"short", year:"numeric"
                      }) : "-"}
                    </td>
                    <td>
                      {u.role !== "admin" && (
                        <button
                          className={styles.btnDelete}
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          Hapus
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
