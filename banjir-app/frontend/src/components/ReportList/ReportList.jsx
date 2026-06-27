import { useEffect, useState } from "react";
import ReportCard from "../ReportCard/ReportCard";
import { getLaporan, deleteLaporan, verifikasiLaporan } from "../../services/api";
import styles from "./ReportList.module.css";

function Skeleton() {
  return (
    <div className={styles.skelGrid}>
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className={styles.skelCard}>
          <div className={styles.skelAccent} />
          <div className={styles.skelBody}>
            <div className={styles.skelLine} style={{ width:"70%" }} />
            <div className={styles.skelLine} style={{ width:"40%" }} />
            <div className={styles.skelLine} style={{ width:"90%" }} />
            <div className={styles.skelRow}>
              <div className={styles.skelBadge} />
              <div className={styles.skelBadge} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    getLaporan()
      .then(data => setReports(Array.isArray(data) ? data : data.data || []))
      .catch(() => setError("Gagal memuat data laporan."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus laporan ini?")) return;
    try {
      await deleteLaporan(id);
      setReports(prev => prev.filter(r => r.id !== id));
    } catch {
      setError("Gagal menghapus laporan.");
    }
  };

  const handleVerify = async (id) => {
    try {
      await verifikasiLaporan(id);
      const data = await getLaporan();
      setReports(Array.isArray(data) ? data : data.data || []);
    } catch {
      setError("Gagal memverifikasi laporan.");
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <div className={styles.header}>
          <div>
            <span className={styles.badge}>
              <i className="ti ti-list-details" />
              Daftar Laporan
            </span>
            <h2 className={styles.title}>Laporan Banjir Depok</h2>
            <p className={styles.sub}>
              {loading
                ? "Memuat data..."
                : `${reports.length} laporan tercatat`
              }
            </p>
          </div>
          <a href="/buat-laporan" className={styles.btnAdd}>
            <i className="ti ti-plus" />
            Buat Laporan
          </a>
        </div>

        {error && (
          <div className={styles.alert}>
            <i className="ti ti-alert-triangle" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <Skeleton />
        ) : reports.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <i className="ti ti-inbox" />
            </div>
            <p className={styles.emptyTitle}>Belum Ada Laporan</p>
            <p className={styles.emptyDesc}>
              Belum ada laporan banjir yang masuk. Jadilah yang pertama melaporkan!
            </p>
            <a href="/buat-laporan" className={styles.emptyBtn}>
              <i className="ti ti-plus" /> Buat Laporan Sekarang
            </a>
          </div>
        ) : (
          <div className={styles.grid}>
            {reports.map(r => (
              <ReportCard
                key={r.id}
                report={r}
                onDelete={handleDelete}
                onVerify={handleVerify}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ReportList;
