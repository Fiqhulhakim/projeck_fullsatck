import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLaporan, isLoggedIn } from "../../services/api";
import { WILAYAH_DEPOK, STATUS_BANJIR } from "../../utils/constant/data";
import styles from "./ReportForm.module.css";

function ReportForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [foto, setFoto]       = useState(null);
  const [form, setForm]       = useState({
    title: "", wilayah: "", description: "",
    water_level: "", status: "pending", address: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      setError("Anda harus login terlebih dahulu.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    if (!form.title || !form.wilayah || !form.water_level || !form.description) {
      setError("Judul, wilayah, ketinggian air, dan deskripsi wajib diisi.");
      return;
    }
    setError(""); setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title",       `Banjir ${form.wilayah} - ${form.title}`);
      formData.append("wilayah",     form.wilayah);
      formData.append("description", form.description);
      formData.append("water_level", form.water_level);
      formData.append("status",      form.status);
      if (form.address) formData.append("address", form.address);
      if (foto)         formData.append("photo",   foto);

      const data = await createLaporan(formData);
      if (data.reportId) {
        setSuccess("Laporan berhasil dikirim! Mengalihkan...");
        setTimeout(() => navigate("/daftar-laporan"), 1500);
      } else {
        setError(data.message || "Gagal mengirim laporan.");
      }
    } catch { setError("Tidak dapat terhubung ke server."); }
    finally  { setLoading(false); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrap}>

        {/* Header */}
        <div className={styles.formHeader}>
          <div className={styles.formBadge}>
            <i className="ti ti-file-plus" aria-hidden="true" />
            Buat Laporan
          </div>
          <p className={styles.formTitle}>Laporkan Banjir di Depok</p>
          <p className={styles.formSub}>Isi form di bawah untuk melaporkan kejadian banjir</p>
        </div>

        {/* Body */}
        <div className={styles.formBody}>
          {error   && <div className={styles.errorMsg}>⚠ {error}</div>}
          {success && <div className={styles.successMsg}>✅ {success}</div>}

          <p className={styles.sectionLabel}>Informasi Utama</p>

          <div className={styles.row2}>
            <div className={styles.form__group}>
              <label><i className="ti ti-map-pin" aria-hidden="true" />Wilayah <span className={styles.req}>*</span></label>
              <select name="wilayah" value={form.wilayah} onChange={handleChange} required>
                <option value="">-- Pilih Kecamatan --</option>
                {WILAYAH_DEPOK.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            <div className={styles.form__group}>
              <label><i className="ti ti-droplet" aria-hidden="true" />Ketinggian Air <span className={styles.req}>*</span></label>
              <input type="number" name="water_level" placeholder="Contoh: 80"
                min="0" value={form.water_level} onChange={handleChange} required />
              <span className={styles.hint}>dalam satuan cm</span>
            </div>
          </div>

          <div className={styles.form__group}>
            <label><i className="ti ti-pencil" aria-hidden="true" />Judul Laporan <span className={styles.req}>*</span></label>
            <input type="text" name="title" placeholder="Contoh: Banjir di Jl. Margonda Raya"
              value={form.title} onChange={handleChange} required />
          </div>

          <div className={styles.row2}>
            <div className={styles.form__group}>
              <label><i className="ti ti-alert-triangle" aria-hidden="true" />Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="pending">Belum diverifikasi</option>
                {STATUS_BANJIR.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div className={styles.form__group}>
              <label><i className="ti ti-home" aria-hidden="true" />Alamat</label>
              <input type="text" name="address" placeholder="Jl. Margonda No.100"
                value={form.address} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.form__group}>
            <label><i className="ti ti-notes" aria-hidden="true" />Deskripsi <span className={styles.req}>*</span></label>
            <textarea rows="3" name="description"
              placeholder="Jelaskan kondisi banjir secara detail..."
              value={form.description} onChange={handleChange} required />
          </div>

          <div className={styles.divider} />
          <p className={styles.sectionLabel}>Foto Dokumentasi</p>

          <div className={styles.fileArea} onClick={() => document.getElementById('fotoInput').click()}>
            <i className="ti ti-cloud-upload file-icon" aria-hidden="true" style={{ fontSize:"24px", color:"#00b4d8" }} />
            <p className={styles.fileText}>
              {foto ? foto.name : "Klik atau seret foto ke sini"}
            </p>
            <p className={styles.fileHint}>JPG, PNG, WEBP · Maks 5MB</p>
            <input id="fotoInput" type="file" accept="image/jpeg,image/png,image/webp"
              style={{ display:"none" }} onChange={(e) => setFoto(e.target.files[0])} />
          </div>

          <div className={styles.btnRow}>
            <button type="button" className={styles.form__button} disabled={loading}
              onClick={handleSubmit}>
              <i className="ti ti-send" aria-hidden="true" />
              {loading ? "Mengirim..." : "Kirim Laporan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportForm;