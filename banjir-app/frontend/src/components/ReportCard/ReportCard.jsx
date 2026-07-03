import useRole from "../../hooks/useRole";
import { STATUS_ICON, waterLevelToStatus } from "../../utils/constant/data";
import styles from "./ReportCard.module.css";

const statusConfig = {
  pending:  { cls: styles.pending,  label: "Pending"  },
  bahaya:   { cls: styles.bahaya,   label: "Bahaya"   },
  siaga:    { cls: styles.siaga,    label: "Siaga"    },
  waspada:  { cls: styles.waspada,  label: "Waspada"  },
  aman:     { cls: styles.aman,     label: "Aman"     },
  verified: { cls: styles.verified, label: "Terverifikasi" },
  rejected: { cls: styles.rejected, label: "Ditolak" },
};

function getDisplayStatus(report) {
  const s = report.status?.toLowerCase() ?? "pending";
  if (s === "verified") {
    return waterLevelToStatus(report.water_level);
  }
  return s;
}

function ReportCard({ report, onDelete, onVerify, onClick }) {
  const { isAdmin } = useRole();
  const key    = getDisplayStatus(report);
  const config = statusConfig[key] ?? statusConfig.pending;
  const icon   = STATUS_ICON[key] || "ti-info-circle";

  const dateStr = report.created_at
    ? new Date(report.created_at).toLocaleDateString("id-ID", {
        day: "numeric", month: "short", year: "numeric"
      })
    : null;

  const handleClick = () => {
    if (onClick) onClick(report);
  };

  const handleAction = (e, fn) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div className={`${styles.card} ${config.cls}`} onClick={handleClick} style={{ cursor: "pointer" }}>
      <div className={styles.topAccent} />
      <div className={styles.body}>
        <div className={styles.headerGroup}>
          <h3 className={styles.title}>{report.title}</h3>
          {report.wilayah && (
            <span className={styles.location}>
              <i className="ti ti-map-pin" /> {report.wilayah}
            </span>
          )}
        </div>

        {report.description && (
          <p className={styles.description}>{report.description}</p>
        )}

        <div className={styles.meta}>
          <span className={`${styles.badge} ${config.cls}`}>
            <i className={`ti ${icon}`} /> {config.label}
          </span>
          <span className={styles.waterLevel}>
            <i className="ti ti-droplet" /> {report.water_level ?? "—"} cm
          </span>
        </div>

        {isAdmin && (
          <div className={styles.adminActions}>
            {key !== "verified" && (
              <button className={styles.btnVerify} onClick={(e) => handleAction(e, () => onVerify?.(report.id))}>
                <i className="ti ti-circle-check" /> Verifikasi
              </button>
            )}
            <button className={styles.btnDelete} onClick={(e) => handleAction(e, () => onDelete?.(report.id))}>
              <i className="ti ti-trash" /> Hapus
            </button>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <i className="ti ti-user" />
        <span>{report.pelapor || "Pelapor"}</span>
        {dateStr && (
          <span className={styles.footerDate}>
            <i className="ti ti-calendar-time" /> {dateStr}
          </span>
        )}
      </div>
    </div>
  );
}

export default ReportCard;
