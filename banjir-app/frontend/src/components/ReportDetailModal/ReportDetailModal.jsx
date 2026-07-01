import { useEffect, useState } from "react";
import useRole from "../../hooks/useRole";
import { getPhotosByReport } from "../../services/api";
import { STATUS_ICON, STATUS_COLOR, waterLevelToStatus } from "../../utils/constant/data";
import styles from "./ReportDetailModal.module.css";

const statusConfig = {
  pending:  { label: "Pending"  },
  bahaya:   { label: "Bahaya"   },
  siaga:    { label: "Siaga"    },
  waspada:  { label: "Waspada"  },
  aman:     { label: "Aman"     },
  verified: { label: "Verified" },
};

function getDisplayStatus(report) {
  const s = report.status?.toLowerCase() ?? "pending";
  if (s === "pending" || s === "verified" || s === "rejected") {
    return waterLevelToStatus(report.water_level);
  }
  return s;
}

function ReportDetailModal({ report, onClose }) {
  const { isAdmin } = useRole();
  const [photos, setPhotos] = useState([]);
  const [photoLoading, setPhotoLoading] = useState(true);

  const displayStatus = getDisplayStatus(report);
  const config = statusConfig[displayStatus] ?? statusConfig.pending;
  const icon = STATUS_ICON[displayStatus] || "ti-info-circle";
  const color = STATUS_COLOR[displayStatus] || STATUS_COLOR.pending;

  const dateStr = report.created_at
    ? new Date(report.created_at).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : null;

  useEffect(() => {
    if (!report?.id) return;
    setPhotoLoading(true);
    getPhotosByReport(report.id)
      .then((res) => {
        setPhotos(Array.isArray(res?.data) ? res.data : []);
      })
      .catch(() => setPhotos([]))
      .finally(() => setPhotoLoading(false));
  }, [report?.id]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const canSeePhotos = isAdmin || report.status !== "pending";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Tutup">
          <i className="ti ti-x" />
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>{report.title}</h2>
          {report.wilayah && (
            <span className={styles.wilayah}>
              <i className="ti ti-map-pin" /> {report.wilayah}
            </span>
          )}
        </div>

        <div className={styles.badges}>
          <span className={styles.badge} style={{ background: color.bg, color: color.text }}>
            <i className={`ti ${icon}`} /> {config.label}
          </span>
          <span className={styles.waterBadge}>
            <i className="ti ti-droplet" /> {report.water_level ?? "—"} cm
          </span>
        </div>

        {report.description && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Deskripsi</h4>
            <p className={styles.description}>{report.description}</p>
          </div>
        )}

        <div className={styles.metaRow}>
          <span><i className="ti ti-user" /> {report.pelapor || "Pelapor"}</span>
          {dateStr && <span><i className="ti ti-calendar-time" /> {dateStr}</span>}
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Foto Dokumentasi</h4>
          <div className={styles.photoArea}>
            {photoLoading ? (
              <div className={styles.photoPlaceholder}>
                <span className={styles.spinner} />
                <p>Memuat foto...</p>
              </div>
            ) : canSeePhotos ? (
              photos.length > 0 ? (
                <div className={styles.photoGrid}>
                  {photos.map((p) => (
                    <div key={p.id} className={styles.photoWrap}>
                      <img
                        src={`http://localhost:3000${p.photo_url}`}
                        alt="Foto laporan"
                        className={styles.photo}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.photoPlaceholder}>
                  <i className="ti ti-photo-off" />
                  <p>Tidak ada foto</p>
                </div>
              )
            ) : (
              <div className={styles.photoPlaceholder}>
                <i className="ti ti-lock" />
                <p>Foto menunggu verifikasi admin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportDetailModal;
