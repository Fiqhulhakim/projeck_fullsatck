import { useEffect, useState } from "react";
import ReportCard from "../ReportCard/ReportCard";
import { getLaporan, deleteLaporan, verifikasiLaporan } from "../../services/api";
import styles from "./ReportList.module.css";

function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = () => {
    setLoading(true);
    getLaporan()
      .then(data => setReports(Array.isArray(data) ? data : data.data || []))
      .catch(() => setError("Gagal memuat data laporan."))
      .finally(() => setLoading(false));
  };

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
      setReports(prev =>
        prev.map(r => r.id === id ? { ...r, status: "verified" } : r)
      );
    } catch {
      setError("Gagal memverifikasi laporan.");
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>
              <i className="ti ti-list-details" aria-hidden="true" />
              Daftar Laporan Banjir Depok
            </h2>
            <p className={styles.sub}>
              {loading ? "Memuat data..." : `${reports.length} laporan aktif`}
            </p>
          </div>
          <a href="/buat-laporan" className={styles.btnAdd}>
            <i className="ti ti-plus" aria-hidden="true" />
            Buat Laporan
          </a>
        </div>

        {error && <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>}

        {loading ? (
          <p style={{ color: "#64748b" }}>Memuat data dari server...</p>
        ) : reports.length === 0 ? (
          <p style={{ color: "#64748b" }}>Belum ada laporan.</p>
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