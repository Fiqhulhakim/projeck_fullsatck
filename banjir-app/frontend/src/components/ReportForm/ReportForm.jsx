import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLaporan, isLoggedIn } from "../../services/api";
import { WILAYAH_DEPOK } from "../../utils/constant/data";
import styles from "./ReportForm.module.css";

function ReportForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [foto, setFoto]       = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm]       = useState({
    title: "", wilayah: "", description: "",
    water_level: "", address: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

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
        <div className={styles.formHeader}>
          <span className={styles.formBadge}>
            <i className="ti ti-file-plus" />
            Buat Laporan
          </span>
          <h1 className={styles.formTitle}>Laporkan Banjir di Depok</h1>
          <p className={styles.formSub}>Isi form di bawah untuk melaporkan kejadian banjir</p>
        </div>

        <div className={styles.formBody}>
          {error && (
            <div className={styles.alertError}>
              <i className="ti ti-alert-triangle" /> {error}
            </div>
          )}
          {success && (
            <div className={styles.alertSuccess}>
              <i className="ti ti-circle-check" /> {success}
            </div>
          )}

          <p className={styles.sectionLabel}>Informasi Utama</p>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label><i className="ti ti-map-pin" />Wilayah <span className={styles.req}>*</span></label>
              <select name="wilayah" value={form.wilayah} onChange={handleChange} required>
                <option value="">-- Pilih Kecamatan --</option>
                {WILAYAH_DEPOK.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label><i className="ti ti-droplet" />Ketinggian Air <span className={styles.req}>*</span></label>
              <input type="number" name="water_level" placeholder="Contoh: 80"
                min="0" value={form.water_level} onChange={handleChange} required />
              <span className={styles.hint}>dalam satuan cm</span>
            </div>
          </div>

          <div className={styles.field}>
            <label><i className="ti ti-pencil" />Judul Laporan <span className={styles.req}>*</span></label>
            <input type="text" name="title" placeholder="Contoh: Banjir di Jl. Margonda Raya"
              value={form.title} onChange={handleChange} required />
          </div>

          <div className={styles.field}>
            <label><i className="ti ti-home" />Alamat</label>
            <input type="text" name="address" placeholder="Jl. Margonda No.100"
              value={form.address} onChange={handleChange} />
          </div>

          <div className={styles.field}>
            <label><i className="ti ti-notes" />Deskripsi <span className={styles.req}>*</span></label>
            <textarea rows="3" name="description"
              placeholder="Jelaskan kondisi banjir secara detail..."
              value={form.description} onChange={handleChange} required />
          </div>

          <div className={styles.divider} />
          <p className={styles.sectionLabel}>Foto Dokumentasi</p>

          <div className={styles.fileArea} onClick={() => document.getElementById('fotoInput').click()}>
            {preview ? (
              <img src={preview} alt="Preview" className={styles.preview} />
            ) : (
              <>
                <i className="ti ti-cloud-upload" />
                <p className={styles.fileText}>Klik atau seret foto ke sini</p>
              </>
            )}
            <p className={styles.fileHint}>
              {foto ? foto.name : "JPG, PNG, WEBP · Maks 5MB"}
            </p>
            <input id="fotoInput" type="file" accept="image/jpeg,image/png,image/webp"
              style={{ display:"none" }} onChange={handleFile} />
          </div>

          {preview && (
            <button type="button" className={styles.btnRemove}
              onClick={() => { setFoto(null); setPreview(null); }}>
              <i className="ti ti-x" /> Hapus Foto
            </button>
          )}

          <button type="button" className={styles.btnSubmit} disabled={loading} onClick={handleSubmit}>
            {loading ? (
              <><span className={styles.spinner} /> Mengirim...</>
            ) : (
              <><i className="ti ti-send" /> Kirim Laporan</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportForm;
