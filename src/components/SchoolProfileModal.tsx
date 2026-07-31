import React, { useState } from "react";
import { SchoolInfo, RoleOption } from "../types/lpj";
import { X, Check, Building2, UserCheck, ShieldCheck } from "lucide-react";

interface SchoolProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolInfo: SchoolInfo;
  onSaveSchoolInfo: (updated: SchoolInfo) => void;
}

export const SchoolProfileModal: React.FC<SchoolProfileModalProps> = ({
  isOpen,
  onClose,
  schoolInfo,
  onSaveSchoolInfo,
}) => {
  const [formData, setFormData] = useState<SchoolInfo>(schoolInfo);

  if (!isOpen) return null;

  const handleRoleOptionChange = (option: RoleOption) => {
    if (option === "bku_default") {
      setFormData((prev) => ({
        ...prev,
        roleConfig: "bku_default",
        headmaster: "Achmad Husain",
        headmasterNip: "197804122005011002",
        treasurer: "Fatimatus Syaadah, M.Pd.",
        treasurerNip: "198509152010012008",
      }));
    } else if (option === "rkas_default") {
      setFormData((prev) => ({
        ...prev,
        roleConfig: "rkas_default",
        headmaster: "Fatimatus Syaadah, M.Pd.",
        headmasterNip: "198509152010012008",
        treasurer: "Achmad Husain",
        treasurerNip: "197804122005011002",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        roleConfig: "custom",
      }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSchoolInfo(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-lg border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-wide">
                Identitas Sekolah & Konfirmasi Pejabat
              </h3>
              <p className="text-xs text-slate-400">
                Sesuaikan nama Kepala Sekolah, Bendahara, dan profil SMP Quran Al-Hamidy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          {/* Role Choice Radio Box */}
          <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Konfirmasi Peran Kepala Sekolah & Bendahara</span>
            </div>
            <p className="text-[11px] text-amber-900/80">
              Terdapat perbedaan catatan posisi antara BKU dan RKAS. Silakan pilih susunan pejabat yang sah digunakan untuk penandatanganan dokumen LPJ:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label
                className={`p-3 rounded-lg border cursor-pointer transition flex items-start gap-2.5 ${
                  formData.roleConfig === "bku_default"
                    ? "border-blue-600 bg-blue-50/50 text-slate-900 shadow-2xs font-semibold"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="roleConfig"
                  checked={formData.roleConfig === "bku_default"}
                  onChange={() => handleRoleOptionChange("bku_default")}
                  className="mt-0.5 text-blue-600 focus:ring-blue-600"
                />
                <div>
                  <span className="font-bold text-xs block text-slate-900">
                    Opsi A: Mengacu BKU
                  </span>
                  <span className="text-[10.5px] block mt-0.5 text-slate-500">
                    • <strong>Kepala Sekolah:</strong> Achmad Husain <br />• <strong>Bendahara:</strong> Fatimatus Syaadah, M.Pd.
                  </span>
                </div>
              </label>

              <label
                className={`p-3 rounded-lg border cursor-pointer transition flex items-start gap-2.5 ${
                  formData.roleConfig === "rkas_default"
                    ? "border-blue-600 bg-blue-50/50 text-slate-900 shadow-2xs font-semibold"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="roleConfig"
                  checked={formData.roleConfig === "rkas_default"}
                  onChange={() => handleRoleOptionChange("rkas_default")}
                  className="mt-0.5 text-blue-600 focus:ring-blue-600"
                />
                <div>
                  <span className="font-bold text-xs block text-slate-900">
                    Opsi B: Mengacu RKAS (Rekomendasi / Terpilih)
                  </span>
                  <span className="text-[10.5px] block mt-0.5 text-slate-500">
                    • <strong>Kepala Sekolah:</strong> Fatimatus Syaadah, M.Pd. <br />• <strong>Bendahara:</strong> Achmad Husain
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Pejabat Details Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <h4 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Kepala Sekolah</span>
              </h4>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={formData.headmaster}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, headmaster: e.target.value, roleConfig: "custom" }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 text-xs font-semibold outline-hidden"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">NIP / NIK Kepala Sekolah</label>
                <input
                  type="text"
                  value={formData.headmasterNip || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, headmasterNip: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-mono text-xs outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <h4 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Bendahara BOSP</span>
              </h4>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={formData.treasurer}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, treasurer: e.target.value, roleConfig: "custom" }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 text-xs font-semibold outline-hidden"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">NIP / NIK Bendahara</label>
                <input
                  type="text"
                  value={formData.treasurerNip || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, treasurerNip: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-mono text-xs outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <h4 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Ketua Komite Sekolah</span>
              </h4>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={formData.committeeName || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, committeeName: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 text-xs font-semibold outline-hidden"
                  placeholder="Syekh Al-Ngarifin, M.Pd."
                />
              </div>
            </div>
          </div>

          {/* School Identity Profile Fields */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-1">
              Data Profile Sekolah
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Sekolah</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-bold text-xs outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">NPSN</label>
                <input
                  type="text"
                  value={formData.npsn}
                  onChange={(e) => setFormData((prev) => ({ ...prev, npsn: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-mono text-xs outline-hidden"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 text-xs outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Kecamatan & Kabupaten</label>
                <input
                  type="text"
                  value={`${formData.district}, ${formData.regency}`}
                  onChange={(e) => {
                    const parts = e.target.value.split(",");
                    setFormData((prev) => ({
                      ...prev,
                      district: parts[0]?.trim() || prev.district,
                      regency: parts[1]?.trim() || prev.regency,
                    }));
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 text-xs outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Sumber Dana & Periode</label>
                <input
                  type="text"
                  value={`${formData.fundSource} - ${formData.period}`}
                  readOnly
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 text-xs font-medium cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Kop Surat PNG Upload Section */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center justify-between">
              <span>Kop Surat Resmi Sekolah (PNG)</span>
              <span className="text-[10px] text-slate-500 lowercase font-normal">(Opsi Gambar Transparan)</span>
            </h4>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 text-xs block">
                    Upload Gambar Kop Surat (PNG)
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Maks 5MB • Resolusi disarankan &gt; 1000px width. Jika tidak diunggah, otomatis menggunakan Kop Teks Default.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="kopFileInputModal"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!file.type.startsWith("image/")) {
                        alert("Format file harus berupa gambar PNG / JPG.");
                        return;
                      }
                      if (file.size > 5 * 1024 * 1024) {
                        alert("Ukuran file maksimal 5MB.");
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        const url = evt.target?.result as string;
                        if (url) {
                          setFormData((prev) => ({ ...prev, letterheadImage: url }));
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  <label
                    htmlFor="kopFileInputModal"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs transition"
                  >
                    {formData.letterheadImage ? "Ganti File PNG" : "Pilih File PNG"}
                  </label>

                  {formData.letterheadImage && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, letterheadImage: undefined }))
                      }
                      className="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg text-xs transition"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>

              {formData.letterheadImage && (
                <div className="bg-white p-2 border border-slate-200 rounded-lg text-center">
                  <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase">Pratinjau Kop Gambar</p>
                  <img
                    src={formData.letterheadImage}
                    alt="Pratinjau Kop Surat"
                    className="max-h-16 max-w-full object-contain mx-auto"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="modalLandscapeToggle"
                  checked={formData.showLetterheadOnLandscape || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      showLetterheadOnLandscape: e.target.checked,
                    }))
                  }
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-600 w-3.5 h-3.5"
                />
                <label htmlFor="modalLandscapeToggle" className="text-[11px] text-slate-700 cursor-pointer font-medium">
                  Tampilkan gambar kop di halaman Landscape (Horizontal) — Default: Tidak (Header Teks)
                </label>
              </div>
            </div>
          </div>

          {/* Modal Buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-xs transition"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
