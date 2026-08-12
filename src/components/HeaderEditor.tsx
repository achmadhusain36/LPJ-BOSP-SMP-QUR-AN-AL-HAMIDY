import React, { useState, useRef } from "react";
import { SchoolInfo, LetterheadSettings } from "../types/lpj";
import {
  Upload,
  Sliders,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Maximize2,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Info,
} from "lucide-react";

interface HeaderEditorProps {
  schoolInfo: SchoolInfo;
  onUpdateSchoolInfo: (updated: SchoolInfo) => void;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
}

export const HeaderEditor: React.FC<HeaderEditorProps> = ({
  schoolInfo,
  onUpdateSchoolInfo,
  isCollapsible = true,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultSettings: LetterheadSettings = {
    marginTopMm: 0,
    marginBottomMm: 8,
    borderStyle: "double",
  };

  const settings: LetterheadSettings = {
    ...defaultSettings,
    ...schoolInfo.letterheadSettings,
  };

  const updateSettings = (newSettings: Partial<LetterheadSettings>) => {
    onUpdateSchoolInfo({
      ...schoolInfo,
      letterheadSettings: {
        ...settings,
        ...newSettings,
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);

    if (!file.type.startsWith("image/") && !file.type.includes("svg")) {
      setErrorMessage("Format file tidak valid. Harap unggah PNG, JPG, WEBP, atau SVG.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Ukuran gambar maksimal 5MB. Harap kompres file gambar Anda.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onUpdateSchoolInfo({
          ...schoolInfo,
          letterheadImage: dataUrl,
        });
      }
    };
    reader.onerror = () => {
      setErrorMessage("Terjadi kesalahan saat membaca file gambar.");
    };
    reader.readAsDataURL(file);
  };

  const handleUseOfficial = () => {
    onUpdateSchoolInfo({
      ...schoolInfo,
      letterheadImage: "/kop_smp_quran_alhamidy.svg",
      letterheadSettings: defaultSettings,
    });
    setErrorMessage(null);
  };

  const handleUseTextDefault = () => {
    onUpdateSchoolInfo({
      ...schoolInfo,
      letterheadImage: undefined,
    });
    setErrorMessage(null);
  };

  const borderClassMap = {
    double: "border-b-4 border-double border-slate-900",
    solid: "border-b-2 border-slate-900",
    emerald: "border-b-4 border-emerald-700",
    none: "border-b-0",
  };

  return (
    <div className="w-full bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden print:hidden transition-all duration-200">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shadow-md shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base tracking-wide text-white flex items-center gap-2 flex-wrap">
              <span>Bilah Pengaturan Kop Surat A4</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded border border-emerald-400/30 font-bold">
                Otomatis Full Width 170mm
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Pengaturan otomatis presisi LPJ BOSP: Gambar menempel penuh ke margin (170mm) atau rata tengah jika tinggi &gt; 45mm.
            </p>
          </div>
        </div>

        {isCollapsible && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <span>{isExpanded ? "Sembunyikan" : "Buka Bilah Edit"}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Editor Content Body */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6 text-xs bg-slate-900">
          {/* Automatic Layout Rule Explanation Banner */}
          <div className="p-3.5 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-200 flex items-start gap-2.5">
            <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-emerald-100">
              <strong className="font-bold text-white block">Aturan Otomatis Presisi LPJ BOSP:</strong>
              <p className="text-[11px] leading-relaxed text-emerald-200/90">
                1. <strong>Halaman Portrait</strong>: Gambar kop otomatis melebar penuh (170 mm) dari margin kiri ke kanan. Jika tinggi asli &gt; 45 mm, otomatis di-skala ke 45 mm &amp; diposisikan rata tengah simetris.<br />
                2. <strong>Halaman Landscape</strong>: Header/kop surat dikosongkan total agar tabel BKU &amp; Rekonsiliasi muat dari paling atas.<br />
                3. <strong>Tanpa Gambar</strong>: Menggunakan teks header instansi standar (rata kiri).
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded-xl text-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Perhatian:</strong> {errorMessage}
              </div>
            </div>
          )}

          {/* Quick Presets Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Preset 1: Official SVG */}
            <button
              type="button"
              onClick={handleUseOfficial}
              className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                schoolInfo.letterheadImage === "/kop_smp_quran_alhamidy.svg"
                  ? "bg-emerald-900/50 border-emerald-500 ring-2 ring-emerald-500/30"
                  : "bg-slate-800/80 border-slate-700 hover:bg-slate-800"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-white text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Kop Resmi SMP Qur'an
                  </span>
                  {schoolInfo.letterheadImage === "/kop_smp_quran_alhamidy.svg" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <p className="text-[10.5px] text-slate-400 leading-relaxed">
                  Kop banner warna resmi Yayasan Al-Hamidy lengkap logo, NPSN, &amp; alamat Podomoro.
                </p>
              </div>
              <span className="text-[10px] text-emerald-300 font-bold mt-2">
                Aktifkan Kop Resmi
              </span>
            </button>

            {/* Preset 2: Custom File Upload */}
            <div
              className={`p-3.5 rounded-xl border relative cursor-pointer transition ${
                schoolInfo.letterheadImage &&
                schoolInfo.letterheadImage !== "/kop_smp_quran_alhamidy.svg"
                  ? "bg-blue-900/50 border-blue-500 ring-2 ring-blue-500/30"
                  : "bg-slate-800/80 border-slate-700 hover:bg-slate-800"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-white text-xs flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                  Unggah Gambar Kop (PNG/JPG)
                </span>
                {schoolInfo.letterheadImage &&
                  schoolInfo.letterheadImage !== "/kop_smp_quran_alhamidy.svg" && (
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  )}
              </div>
              <p className="text-[10.5px] text-slate-400 leading-relaxed">
                Pilih file PNG transparan sekolah Anda sendiri dari laptop / HP.
              </p>
              <span className="text-[10px] text-blue-300 font-bold mt-2 inline-block">
                {schoolInfo.letterheadImage &&
                schoolInfo.letterheadImage !== "/kop_smp_quran_alhamidy.svg"
                  ? "Ganti File Kop Custom"
                  : "Pilih File Gambar PNG"}
              </span>
            </div>

            {/* Preset 3: Text Only */}
            <button
              type="button"
              onClick={handleUseTextDefault}
              className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                !schoolInfo.letterheadImage
                  ? "bg-slate-700/80 border-slate-500 ring-2 ring-slate-500/30"
                  : "bg-slate-800/80 border-slate-700 hover:bg-slate-800"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-white text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                    Kop Teks Standar
                  </span>
                  {!schoolInfo.letterheadImage && (
                    <CheckCircle2 className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                <p className="text-[10.5px] text-slate-400 leading-relaxed">
                  Menggunakan teks instansi biasa tanpa file gambar header (rata kiri).
                </p>
              </div>
              <span className="text-[10px] text-slate-300 font-bold mt-2">
                Gunakan Kop Teks Polos
              </span>
            </button>
          </div>

          {/* SLIDERS GRID CONTROLS */}
          <div className="bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Pengaturan Margin Kertas A4 &amp; Garis Pemisah</span>
              </h4>
              <button
                type="button"
                onClick={() => updateSettings(defaultSettings)}
                className="text-[10.5px] text-slate-400 hover:text-white flex items-center gap-1 font-semibold underline"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Ke Default
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Slider 1: Vertical Top Margin (Margin Atas Kertas) */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-200">
                    Margin Atas Kertas (Top):
                  </label>
                  <span className="font-mono text-blue-300 font-bold bg-blue-950 px-2 py-0.5 rounded border border-blue-800 text-xs">
                    {settings.marginTopMm ?? 0} mm
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="1"
                  value={settings.marginTopMm ?? 0}
                  onChange={(e) => updateSettings({ marginTopMm: Number(e.target.value) })}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[9.5px] text-slate-400">
                  <span>0mm (Standar BOSP)</span>
                  <span>10mm</span>
                  <span>35mm</span>
                </div>
              </div>

              {/* Slider 2: Vertical Bottom Margin (Jarak Kop ke Isi Dokumen) */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-200">
                    Margin Bawah Kop (Ke Dokumen):
                  </label>
                  <span className="font-mono text-blue-300 font-bold bg-blue-950 px-2 py-0.5 rounded border border-blue-800 text-xs">
                    {settings.marginBottomMm ?? 8} mm
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={settings.marginBottomMm ?? 8}
                  onChange={(e) => updateSettings({ marginBottomMm: Number(e.target.value) })}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[9.5px] text-slate-400">
                  <span>0mm (Rapat)</span>
                  <span>8mm (Standar)</span>
                  <span>30mm</span>
                </div>
              </div>
            </div>

            {/* Line Border Style Select */}
            <div className="pt-2 border-t border-slate-700 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <label className="font-bold text-slate-300 text-xs shrink-0">
                  Garis Bawah Pemisah Kop:
                </label>
                <select
                  value={settings.borderStyle || "double"}
                  onChange={(e) => updateSettings({ borderStyle: e.target.value as any })}
                  className="bg-slate-900 text-white border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-hidden w-full sm:w-auto"
                >
                  <option value="double">Garis Ganda Hitam (Double Line - Standar BOSP)</option>
                  <option value="solid">Garis Solid Hitam Single</option>
                  <option value="emerald">Garis Hijau Emerald (Tema Sekolah)</option>
                  <option value="none">Tanpa Garis Pemisah (Polos)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SIMULATED LIVE A4 PAPER PREVIEW CANVAS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-white text-xs flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-emerald-400" />
                Simulasi Pratinjau Kertas A4 Portrait (170mm Lebar Efektif)
              </span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <FileCheck2 className="w-3.5 h-3.5" />
                Presisi Siap Cetak PDF
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-center items-center overflow-x-auto">
              <div className="w-[100%] max-w-[560px] bg-white text-slate-900 shadow-2xl border border-slate-300 p-4 rounded relative min-h-[160px] flex flex-col justify-between">
                {/* Visual Kop Container */}
                <div
                  className={`w-full relative ${
                    borderClassMap[settings.borderStyle || "double"]
                  }`}
                  style={{
                    marginTop: `${(settings.marginTopMm ?? 0) / 2}px`,
                    marginBottom: `${(settings.marginBottomMm ?? 8) / 2}px`,
                    paddingBottom: "3px",
                  }}
                >
                  <div className="w-full">
                    {schoolInfo.letterheadImage ? (
                      <img
                        src={schoolInfo.letterheadImage}
                        alt="Preview Kop"
                        className="w-full max-h-[45mm] object-fill block"
                      />
                    ) : (
                      <div className="text-left py-2 space-y-0.5">
                        <p className="font-extrabold text-sm uppercase text-slate-900">
                          {schoolInfo.name}
                        </p>
                        <p className="text-xs text-slate-700">
                          {schoolInfo.address}, {schoolInfo.district}, {schoolInfo.regency}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-600">
                          NPSN: {schoolInfo.npsn} | Tahun Anggaran {schoolInfo.year}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Simulated Document Section */}
                <div className="text-center py-4 border border-dashed border-slate-300 rounded bg-slate-50/70 mt-2">
                  <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                    SURAT PERNYATAAN TANGGUNG JAWAB MUTLAK (SPTJM)
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium">
                    Tahun Anggaran {schoolInfo.year} — {schoolInfo.stage} ({schoolInfo.period})
                  </p>
                  <p className="text-[9px] text-slate-400 mt-2 italic">
                    [Teks isi dokumen BOSP berada presisi di bawah garis kop surat]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

