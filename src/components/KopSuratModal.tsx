import React, { useState, useRef } from "react";
import { SchoolInfo, LetterheadSettings } from "../types/lpj";
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Sliders,
  RotateCcw,
  Sparkles,
  Maximize2,
  Info,
} from "lucide-react";

interface KopSuratModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolInfo: SchoolInfo;
  onSaveSchoolInfo: (updated: SchoolInfo) => void;
}

export const KopSuratModal: React.FC<KopSuratModalProps> = ({
  isOpen,
  onClose,
  schoolInfo,
  onSaveSchoolInfo,
}) => {
  const [letterheadImage, setLetterheadImage] = useState<string | undefined>(
    schoolInfo.letterheadImage || "/kop_smp_quran_alhamidy.svg"
  );

  const defaultSettings: LetterheadSettings = {
    marginTopMm: 0,
    marginBottomMm: 8,
    borderStyle: "double",
  };

  const [settings, setSettings] = useState<LetterheadSettings>(
    schoolInfo.letterheadSettings || defaultSettings
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);

    if (!file.type.startsWith("image/")) {
      setErrorMessage(
        "Format file tidak valid. Harap unggah gambar PNG, JPG, atau WEBP."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(
        "Ukuran gambar terlalu besar (maksimal 5MB). Harap kompres file Anda."
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        setErrorMessage("Gagal membaca file gambar.");
        return;
      }
      setLetterheadImage(dataUrl);
    };

    reader.onerror = () => {
      setErrorMessage("Terjadi kesalahan saat membaca file.");
    };

    reader.readAsDataURL(file);
  };

  const handleResetDefault = () => {
    setLetterheadImage("/kop_smp_quran_alhamidy.svg");
    setSettings(defaultSettings);
    setErrorMessage(null);
  };

  const handleRemoveImage = () => {
    setLetterheadImage(undefined);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    onSaveSchoolInfo({
      ...schoolInfo,
      letterheadImage: letterheadImage,
      showLetterheadOnLandscape: false,
      letterheadSettings: settings,
    });
    onClose();
  };

  const borderClassMap = {
    double: "border-b-4 border-double border-slate-900",
    solid: "border-b-2 border-slate-900",
    emerald: "border-b-4 border-emerald-700",
    none: "border-b-0",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-wide flex items-center gap-2">
                <span>Edit Kop Surat &amp; Penyesuaian Kertas LPJ</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded border border-emerald-400/30">
                  SMP Qur'an
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Logika otomatis: Kop mepet dari margin kiri ke kanan (170 mm) atau rata tengah jika tinggi &gt; 45 mm
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-xs text-slate-800 max-h-[80vh] overflow-y-auto">
          {/* Information Notice */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5 leading-relaxed text-[11px]">
              <strong className="font-bold text-emerald-950">Aturan Penataan Otomatis LPJ BOSP:</strong>
              <p>
                - <strong>Portrait</strong>: Lebar efektif 170 mm (A4 210mm dengan margin 20mm kiri-kanan). Gambar menempel penuh ke tepi. Jika tinggi &gt; 45 mm, otomatis di-skala ke 45 mm dan rata tengah simetris.<br />
                - <strong>Landscape</strong>: Kop dikosongkan total agar tabel BKU &amp; Laporan muat penuh.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Gagal Mengunggah:</strong> {errorMessage}
              </div>
            </div>
          )}

          {/* Quick Kop Selection Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Option 1: Default Official Kop */}
            <button
              type="button"
              onClick={handleResetDefault}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                letterheadImage === "/kop_smp_quran_alhamidy.svg"
                  ? "bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/20"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Kop Resmi SMP Qur'an
                  </span>
                  {letterheadImage === "/kop_smp_quran_alhamidy.svg" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-[10.5px] text-slate-500 leading-snug">
                  Kop surat banner warna resmi SMP Qur'an Al-Hamidy dengan logo &amp; kontak lengkap.
                </p>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold mt-2 inline-block">
                Gunakan Kop Resmi
              </span>
            </button>

            {/* Option 2: Custom PNG Upload */}
            <div
              className={`p-3 rounded-xl border relative cursor-pointer transition ${
                letterheadImage && letterheadImage !== "/kop_smp_quran_alhamidy.svg"
                  ? "bg-blue-50/80 border-blue-600 ring-2 ring-blue-600/20"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  Unggah Kop Sendiri
                </span>
                {letterheadImage && letterheadImage !== "/kop_smp_quran_alhamidy.svg" && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <p className="text-[10.5px] text-slate-500 leading-snug">
                Pilih file PNG transparan dari komputer Anda (Maksimal 5MB).
              </p>
              <span className="text-[10px] text-blue-700 font-bold mt-2 inline-block">
                {letterheadImage && letterheadImage !== "/kop_smp_quran_alhamidy.svg"
                  ? "Ganti File PNG Custom"
                  : "Pilih File PNG / JPG"}
              </span>
            </div>

            {/* Option 3: Default Text Kop */}
            <button
              type="button"
              onClick={handleRemoveImage}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                !letterheadImage
                  ? "bg-slate-200 border-slate-400 ring-2 ring-slate-400/20"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                    Kop Teks Standar
                  </span>
                  {!letterheadImage && <CheckCircle2 className="w-4 h-4 text-slate-700" />}
                </div>
                <p className="text-[10.5px] text-slate-500 leading-snug">
                  Menggunakan teks instansi biasa (rata kiri) tanpa gambar header.
                </p>
              </div>
              <span className="text-[10px] text-slate-700 font-bold mt-2 inline-block">
                Tanpa Gambar Kop
              </span>
            </button>
          </div>

          {/* MARGIN & BORDER CONTROLS */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Pengaturan Margin Kertas &amp; Garis Pemisah</span>
              </h4>
              <button
                type="button"
                onClick={() => setSettings(defaultSettings)}
                className="text-[10.5px] text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Ke Default
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Control 1: Margin Top (mm) */}
              <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center text-slate-800 font-bold">
                  <label className="text-xs">Margin Atas Kertas (Top):</label>
                  <span className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {settings.marginTopMm ?? 0} mm
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={settings.marginTopMm ?? 0}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      marginTopMm: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>0mm (Standar BOSP)</span>
                  <span>10mm</span>
                  <span>30mm</span>
                </div>
              </div>

              {/* Control 2: Margin Bottom (mm) */}
              <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center text-slate-800 font-bold">
                  <label className="text-xs">Margin Bawah Kop (Ke Dokumen):</label>
                  <span className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {settings.marginBottomMm ?? 8} mm
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={settings.marginBottomMm ?? 8}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      marginBottomMm: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Rapat (0mm)</span>
                  <span>Standar (8mm)</span>
                  <span>Jauh (25mm)</span>
                </div>
              </div>

              {/* Control 3: Border Line Style */}
              <div className="sm:col-span-2 space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
                <label className="block text-xs font-bold text-slate-800">
                  Garis Pemisah Kop Surat:
                </label>
                <select
                  value={settings.borderStyle || "double"}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      borderStyle: e.target.value as any,
                    }))
                  }
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-semibold focus:ring-2 focus:ring-emerald-600 outline-hidden"
                >
                  <option value="double">Garis Ganda Hitam (Double Line - Standar LPJ)</option>
                  <option value="solid">Garis Solid Hitam Single</option>
                  <option value="emerald">Garis Hijau Emerald (Tema Sekolah)</option>
                  <option value="none">Tanpa Garis Pemisah (Polos)</option>
                </select>
              </div>
            </div>
          </div>

          {/* LIVE SIMULATED A4 PAPER PREVIEW */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4 text-emerald-600" />
                Pratinjau Hasil Cetak Kertas A4 Portrait (Full Width 170 mm)
              </span>
              <span className="text-[10px] text-slate-500 italic">
                A4 (210 mm × 297 mm) • Margin 20 mm
              </span>
            </div>

            <div className="bg-slate-200 p-4 rounded-xl border border-slate-300 flex justify-center items-center overflow-x-auto">
              <div className="w-[100%] max-w-[500px] bg-white shadow-md border border-slate-300 p-3 rounded relative min-h-[140px] flex flex-col justify-between">
                <div
                  className={`w-full relative ${
                    borderClassMap[settings.borderStyle || "double"]
                  }`}
                  style={{
                    marginTop: `${(settings.marginTopMm ?? 0) / 2}px`,
                    marginBottom: `${(settings.marginBottomMm ?? 8) / 2}px`,
                    paddingBottom: "2px",
                  }}
                >
                  <div className="w-full">
                    {letterheadImage ? (
                      <img
                        src={letterheadImage}
                        alt="Preview Kop"
                        className="w-full max-h-[45mm] object-fill block"
                      />
                    ) : (
                      <div className="text-left py-2 space-y-0.5">
                        <p className="font-bold text-xs uppercase text-slate-900">
                          {schoolInfo.name}
                        </p>
                        <p className="text-[10px] text-slate-600">
                          {schoolInfo.address}, {schoolInfo.district}
                        </p>
                        <p className="text-[9px] text-slate-500 font-medium">
                          NPSN: {schoolInfo.npsn} | Tahun Anggaran {schoolInfo.year}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Simulation Placeholder */}
                <div className="text-center py-3 border border-dashed border-slate-200 rounded bg-slate-50/50 mt-1">
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    SURAT PERNYATAAN TANGGUNG JAWAB UTAMA (SPTJM) BOSP
                  </p>
                  <p className="text-[9.5px] text-slate-400 mt-1">
                    [Area isi dokumen LPJ BOSP tercetak di bawah kop surat]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleResetDefault}
            className="px-3.5 py-2 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-100 transition text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span>Reset ke Default</span>
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-100 transition text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-xs transition text-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan &amp; Terapkan Ke Kertas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

