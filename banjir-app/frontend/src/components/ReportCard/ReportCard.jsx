import useRole from "../../hooks/useRole";
import styles from "./ReportCard.module.css";

const statusConfig = {
  pending:  { cls: styles.pending,  icon: "⏳", label: "Pending"  },
  bahaya:   { cls: styles.bahaya,   icon: "🔴", label: "Bahaya"   },
  siaga:    { cls: styles.siaga,    icon: "⚠️", label: "Siaga"    },
  waspada:  { cls: styles.waspada,  icon: "🟡", label: "Waspada"  },
  aman:     { cls: styles.aman,     icon: "✅", label: "Aman"     },
  verified: { cls: styles.verified, icon: "✔️", label: "Verified" },
};

function ReportCard({ report, onDelete, onVerify }) {
  const { isAdmin } = useRole();
  const key    = report.status?.toLowerCase() ?? "pending";
  const config = statusConfig[key] ?? statusConfig.pending;

  return (
    <div className={`${styles.card} ${config.cls}`}>
      <div className={styles.topAccent} />

      <div className={styles.body}>
        {/* Title + lokasi */}
        <div className={styles.headerGroup}>
          <h3 className={styles.title}>{report.title}</h3>
          <span className={styles.location}>
            <i className="ti ti-map-pin" /> {report.wilayah}
          </span>
        </div>

        {/* Deskripsi */}
        {report.description && (
          <p className={styles.description}>{report.description}</p>
        )}

        {/* Status + ketinggian */}
        <div className={styles.meta}>
          <span className={`${styles.badge} ${config.cls}`}>
            {config.icon} {config.label}
          </span>
          <span className={styles.waterLevel}>
            <i className="ti ti-droplet" /> {report.water_level ?? "—"} cm
          </span>
        </div>

        {/* Tombol admin — hanya muncul jika role admin */}
        {isAdmin && (
          <div className={styles.adminActions}>
            {key !== "verified" && (
              <button
                className={styles.btnVerify}
                onClick={() => onVerify?.(report.id)}
              >
                <i className="ti ti-circle-check" /> Verifikasi
              </button>
            )}
            <button
              className={styles.btnDelete}
              onClick={() => onDelete?.(report.id)}
            >
              <i className="ti ti-trash" /> Hapus
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <i className="ti ti-user" />
        <span>{report.user_name || "Pelapor"}</span>
      </div>
    </div>
  );
}

export default ReportCard;