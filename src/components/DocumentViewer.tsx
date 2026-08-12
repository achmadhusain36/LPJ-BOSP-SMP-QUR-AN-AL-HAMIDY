import React, { useState, useMemo } from "react";
import {
  SchoolInfo,
  BkuTransaction,
  RkasProgramItem,
  FinancialSummary,
  Form3Row,
  AssetRow,
  CashDenomination,
  ChecklistItem,
} from "../types/lpj";
import {
  calculateFinancialSummary,
  generateForm3Rows,
  recalculateBkuBalances,
  formatRupiah,
} from "../utils/lpjCalculations";
import { DocCover } from "./documents/DocCover";
import { DocSuratPengantar } from "./documents/DocSuratPengantar";
import { DocNarasiLpj } from "./documents/DocNarasiLpj";
import { DocSptjm } from "./documents/DocSptjm";
import { DocRkasTriwulan } from "./documents/DocRkasTriwulan";
import { DocBkuK3 } from "./documents/DocBkuK3";
import { DocBankK5 } from "./documents/DocBankK5";
import { DocPajakK6 } from "./documents/DocPajakK6";
import { DocRealisasiK7a } from "./documents/DocRealisasiK7a";
import { DocRekeningKoran } from "./documents/DocRekeningKoran";
import { DocPenutupanKasK7b } from "./documents/DocPenutupanKasK7b";
import { DocBAPemeriksaanKasK7c } from "./documents/DocBAPemeriksaanKasK7c";
import { DocSkTim } from "./documents/DocSkTim";
import { DocBuktiKasPengeluaran } from "./documents/DocBuktiKasPengeluaran";
import { DocDaftarHonor } from "./documents/DocDaftarHonor";
import { DocDokumentasiFoto } from "./documents/DocDokumentasiFoto";
import { DocAsetForm09 } from "./documents/DocAsetForm09";
import { DocRekapPajakNihil } from "./documents/DocRekapPajakNihil";
import { DocForm3Rekon } from "./documents/DocForm3Rekon";
import { DocChecklist28 } from "./documents/DocChecklist28";
import { DocFullBundle } from "./documents/DocFullBundle";
import { KopSuratModal } from "./KopSuratModal";
import { HeaderEditor } from "./HeaderEditor";
import { generateLpjWordDocument } from "../utils/exportWord";
import { Printer, FileText, Layers, Filter, RefreshCw, Calendar, Clock, Image as ImageIcon, Sliders, Download } from "lucide-react";

interface DocumentViewerProps {
  schoolInfo: SchoolInfo;
  transactions: BkuTransaction[];
  rkasItems: RkasProgramItem[];
  financialSummary: FinancialSummary;
  form3Rows: Form3Row[];
  assets: AssetRow[];
  denominations: CashDenomination[];
  checklistItems: ChecklistItem[];
  onSaveSchoolInfo?: (updated: SchoolInfo) => void;
}

export type DocumentType =
  | "BUNDLE_ALL"
  | "DOC_1_COVER"
  | "DOC_2_PENGANTAR"
  | "DOC_3_4_5_NARASI"
  | "DOC_6_SPTJM"
  | "DOC_7_RKAS_TRIWULAN"
  | "DOC_8_BKU"
  | "DOC_9_BANK"
  | "DOC_10_PAJAK"
  | "DOC_11_REALISASI_K7A"
  | "DOC_12_REK_KORAN"
  | "DOC_13_PENUTUPAN_KAS_K7B"
  | "DOC_14_BA_KAS_K7C"
  | "DOC_15_SK_TIM"
  | "DOC_16_BUKTI_KAS_BPU"
  | "DOC_17_HONOR"
  | "DOC_18_DOKUMENTASI"
  | "DOC_19_ASET_FORM09"
  | "FORM3_REKON"
  | "CHECKLIST28";

export const DocumentViewer: React.FC<DocumentViewerProps> = (props) => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentType>("BUNDLE_ALL");
  const [isKopModalOpen, setIsKopModalOpen] = useState(false);
  const [showQuickKopToolbar, setShowQuickKopToolbar] = useState(false);

  // Filter States: Tahapan, Triwulan, Bulan
  const [selectedStage, setSelectedStage] = useState<string>("semua");
  const [selectedQuarter, setSelectedQuarter] = useState<string>("semua");
  const [selectedMonth, setSelectedMonth] = useState<string>("semua");

  // Filter change handlers
  const handleStageChange = (val: string) => {
    setSelectedStage(val);
    if (val === "tahap1") {
      if (selectedQuarter === "tw3" || selectedQuarter === "tw4") setSelectedQuarter("semua");
      if (["Juli", "Agustus", "September", "Oktober", "November", "Desember"].includes(selectedMonth)) {
        setSelectedMonth("semua");
      }
    } else if (val === "tahap2") {
      if (selectedQuarter === "tw1" || selectedQuarter === "tw2") setSelectedQuarter("semua");
      if (["Januari", "Februari", "Maret", "April", "Mei", "Juni"].includes(selectedMonth)) {
        setSelectedMonth("semua");
      }
    }
  };

  const handleQuarterChange = (val: string) => {
    setSelectedQuarter(val);
    if (val === "tw1" || val === "tw2") {
      setSelectedStage("tahap1");
    } else if (val === "tw3" || val === "tw4") {
      setSelectedStage("tahap2");
    }

    const qMonths: Record<string, string[]> = {
      tw1: ["Januari", "Februari", "Maret"],
      tw2: ["April", "Mei", "Juni"],
      tw3: ["Juli", "Agustus", "September"],
      tw4: ["Oktober", "November", "Desember"],
    };
    if (val !== "semua" && !qMonths[val]?.includes(selectedMonth)) {
      setSelectedMonth("semua");
    }
  };

  const handleMonthChange = (val: string) => {
    setSelectedMonth(val);
    if (val !== "semua") {
      if (["Januari", "Februari", "Maret"].includes(val)) {
        setSelectedStage("tahap1");
        setSelectedQuarter("tw1");
      } else if (["April", "Mei", "Juni"].includes(val)) {
        setSelectedStage("tahap1");
        setSelectedQuarter("tw2");
      } else if (["Juli", "Agustus", "September"].includes(val)) {
        setSelectedStage("tahap2");
        setSelectedQuarter("tw3");
      } else if (["Oktober", "November", "Desember"].includes(val)) {
        setSelectedStage("tahap2");
        setSelectedQuarter("tw4");
      }
    }
  };

  const handleResetFilters = () => {
    setSelectedStage("semua");
    setSelectedQuarter("semua");
    setSelectedMonth("semua");
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    const raw = props.transactions.filter((tx) => {
      // Filter Month
      if (selectedMonth !== "semua" && tx.month !== selectedMonth) {
        return false;
      }

      // Filter Quarter
      if (selectedQuarter !== "semua") {
        const qMonths: Record<string, string[]> = {
          tw1: ["Januari", "Februari", "Maret"],
          tw2: ["April", "Mei", "Juni"],
          tw3: ["Juli", "Agustus", "September"],
          tw4: ["Oktober", "November", "Desember"],
        };
        if (!qMonths[selectedQuarter]?.includes(tx.month)) return false;
      }

      // Filter Stage
      if (selectedStage !== "semua") {
        const stageMonths: Record<string, string[]> = {
          tahap1: ["Januari", "Februari", "Maret", "April", "Mei", "Juni"],
          tahap2: ["Juli", "Agustus", "September", "Oktober", "November", "Desember"],
        };
        if (!stageMonths[selectedStage]?.includes(tx.month)) return false;
      }

      return true;
    });

    return recalculateBkuBalances(raw);
  }, [props.transactions, selectedMonth, selectedQuarter, selectedStage]);

  // Recalculated Financial Summary
  const filteredFinancialSummary = useMemo(() => {
    return calculateFinancialSummary(filteredTransactions);
  }, [filteredTransactions]);

  // Recalculated Form 3 Rows
  const filteredForm3Rows = useMemo(() => {
    return generateForm3Rows(props.rkasItems, filteredTransactions);
  }, [props.rkasItems, filteredTransactions]);

  // Dynamic Period Text for Documents
  const periodText = useMemo(() => {
    if (selectedMonth !== "semua") {
      return `BULAN ${selectedMonth.toUpperCase()} ${props.schoolInfo.year}`;
    }
    if (selectedQuarter !== "semua") {
      const qLabels: Record<string, string> = {
        tw1: "TRIWULAN I (JANUARI – MARET)",
        tw2: "TRIWULAN II (APRIL – JUNI)",
        tw3: "TRIWULAN III (JULI – SEPTEMBER)",
        tw4: "TRIWULAN IV (OKTOBER – DESEMBER)",
      };
      return `${qLabels[selectedQuarter]} ${props.schoolInfo.year}`;
    }
    if (selectedStage !== "semua") {
      return selectedStage === "tahap1"
        ? `TAHAP 1 (JANUARI – JUNI) TAHUN ${props.schoolInfo.year}`
        : `TAHAP 2 (JULI – DESEMBER) TAHUN ${props.schoolInfo.year}`;
    }
    return `JANUARI – JUNI TAHUN ${props.schoolInfo.year}`;
  }, [selectedMonth, selectedQuarter, selectedStage, props.schoolInfo.year]);

  const filteredSchoolInfo = useMemo(() => {
    return {
      ...props.schoolInfo,
      period: periodText,
      stage:
        selectedStage !== "semua"
          ? selectedStage === "tahap1"
            ? "Tahap 1"
            : "Tahap 2"
          : props.schoolInfo.stage,
    };
  }, [props.schoolInfo, periodText, selectedStage]);

  const [isExportingWord, setIsExportingWord] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = async () => {
    try {
      setIsExportingWord(true);
      await generateLpjWordDocument({
        schoolInfo: filteredSchoolInfo,
        transactions: filteredTransactions,
        financialSummary: filteredFinancialSummary,
        form3Rows: filteredForm3Rows,
        docType: selectedDoc,
      });
    } catch (err) {
      console.error("Gagal mengunduh dokumen Word:", err);
      alert("Gagal mengunduh dokumen Word. Silakan coba kembali.");
    } finally {
      setIsExportingWord(false);
    }
  };

  const docTitles: Record<DocumentType, string> = {
    BUNDLE_ALL: "📦 BUNDEL URUTAN RESMI LPJ (19 DOKUMEN LENGKAP SIAP CETAK)",
    DOC_1_COVER: "1. Cover / Sampul LPJ",
    DOC_2_PENGANTAR: "2. Surat Pengantar (Tim BOSP Pringsewu)",
    DOC_3_4_5_NARASI: "3-5. Pendahuluan, Pelaksanaan & Permasalahan",
    DOC_6_SPTJM: "6. Surat Pernyataan Tanggung Jawab Mutlak (SPTJM)",
    DOC_7_RKAS_TRIWULAN: "7. RKAS Per Triwulan (Triwulan I-IV)",
    DOC_8_BKU: "8. Buku Kas Umum (BKU Per Bulan)",
    DOC_9_BANK: "9. Buku Pembantu Bank Per Bulan",
    DOC_10_PAJAK: "10. Buku Bantu Pajak Per Bulan",
    DOC_11_REALISASI_K7A: "11. Rekap Realisasi 1 Tahap (Form K7a)",
    DOC_12_REK_KORAN: "12. Rekening Koran / Surat Pernyataan",
    DOC_13_PENUTUPAN_KAS_K7B: "13. Register Penutupan Kas (Form K7b)",
    DOC_14_BA_KAS_K7C: "14. Berita Acara Penutupan Kas (Form K7c)",
    DOC_15_SK_TIM: "15. SK Tim BOSP, Pengadaan & PPHP",
    DOC_16_BUKTI_KAS_BPU: "16. Bukti Kas Pengeluaran (BPU C5)",
    DOC_17_HONOR: "17. Daftar Honorarium Guru & Tendik",
    DOC_18_DOKUMENTASI: "18. Dokumentasi Pembelanjaan Urut BKU",
    DOC_19_ASET_FORM09: "19. Rekap Pembelian Barang Aset (Form 09 BMD)",
    FORM3_REKON: "Form 3 Belanja dan Rekonsiliasi (BOSP)",
    CHECKLIST28: "Checklist 28 Instrumen Kelengkapan",
  };

  const isFiltered =
    selectedStage !== "semua" || selectedQuarter !== "semua" || selectedMonth !== "semua";

  const activeDocProps = {
    schoolInfo: filteredSchoolInfo,
    transactions: filteredTransactions,
    rkasItems: props.rkasItems,
    financialSummary: filteredFinancialSummary,
    form3Rows: filteredForm3Rows,
    assets: props.assets,
    denominations: props.denominations,
    checklistItems: props.checklistItems,
  };

  return (
    <div className="space-y-6">
      {/* Selector & Actions Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Dokumen Kelengkapan LPJ BOSP (19 Berkas Resm)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih dokumen atau cetak Bundel Urutan Resmi (1 s.d. 19) langsung ke kertas A4.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedDoc}
            onChange={(e) => setSelectedDoc(e.target.value as DocumentType)}
            className="px-3.5 py-2 bg-slate-900 text-white font-semibold border border-slate-800 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 outline-hidden max-w-md"
          >
            <option value="BUNDLE_ALL">📦 ALL-IN-ONE (Urutan Cetak Resmi 19 Item)</option>
            <option value="DOC_1_COVER">1. Cover / Sampul LPJ</option>
            <option value="DOC_2_PENGANTAR">2. Surat Pengantar Tim BOSP</option>
            <option value="DOC_3_4_5_NARASI">3-5. Pendahuluan &amp; Laporan Narasi</option>
            <option value="DOC_6_SPTJM">6. Surat Pernyataan Tanggung Jawab Mutlak (SPTJM)</option>
            <option value="DOC_7_RKAS_TRIWULAN">7. RKAS Per Triwulan I-IV</option>
            <option value="DOC_8_BKU">8. Buku Kas Umum (BKU K3)</option>
            <option value="DOC_9_BANK">9. Buku Pembantu Bank (Form K5)</option>
            <option value="DOC_10_PAJAK">10. Buku Bantu Pajak (Form K6)</option>
            <option value="DOC_11_REALISASI_K7A">11. Rekap Realisasi (Form K7a)</option>
            <option value="DOC_12_REK_KORAN">12. Rekening Koran / Pernyataan</option>
            <option value="DOC_13_PENUTUPAN_KAS_K7B">13. Register Penutupan Kas (K7b)</option>
            <option value="DOC_14_BA_KAS_K7C">14. BA Pemeriksaan Kas (K7c)</option>
            <option value="DOC_15_SK_TIM">15. SK Tim BOSP, Pengadaan &amp; PPHP</option>
            <option value="DOC_16_BUKTI_KAS_BPU">16. Bukti Kas Pengeluaran (BPU C5)</option>
            <option value="DOC_17_HONOR">17. Daftar Honorarium Guru &amp; Tendik</option>
            <option value="DOC_18_DOKUMENTASI">18. Dokumentasi Pembelanjaan Urut BKU</option>
            <option value="DOC_19_ASET_FORM09">19. Rekap Pembelian Barang Aset (Form 09)</option>
            <option value="FORM3_REKON">Lampiran: Form 3 Belanja &amp; Rekon</option>
            <option value="CHECKLIST28">Lampiran: Checklist 28 Instrumen</option>
          </select>

          <button
            onClick={() => setShowQuickKopToolbar((prev) => !prev)}
            className={`px-3.5 py-2 border rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              showQuickKopToolbar
                ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                : "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
            }`}
            title="Buka / Tutup Bilah Edit Kop Surat"
          >
            <Sliders className="w-4 h-4" />
            <span>Bilah Edit Kop</span>
          </button>

          <button
            onClick={() => setIsKopModalOpen(true)}
            className={`px-3 py-2 border rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              props.schoolInfo.letterheadImage
                ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
            title="Pengaturan Gambar Kop Surat Sekolah"
          >
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>
              {props.schoolInfo.letterheadImage ? "Pengaturan Kop" : "Unggah Kop PNG"}
            </span>
          </button>

          <button
            onClick={handleExportWord}
            disabled={isExportingWord}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
            title="Unduh berkas dokumen LPJ dalam format Microsoft Word (.docx) untuk disunting"
          >
            <Download className="w-4 h-4 text-emerald-200" />
            <span>
              {isExportingWord ? "Menyiapkan Word..." : "Unduh Word (.docx)"}
            </span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF LPJ</span>
          </button>
        </div>
      </div>

      {/* BILAH EDIT KOP SURAT (HEADER EDITOR COMPONENT) */}
      {showQuickKopToolbar && props.onSaveSchoolInfo && (
        <HeaderEditor
          schoolInfo={props.schoolInfo}
          onUpdateSchoolInfo={props.onSaveSchoolInfo}
          isCollapsible={false}
          defaultExpanded={true}
        />
      )}

      {/* Filter Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs print:hidden">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-slate-800">Filter Periode LPJ:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Tahapan */}
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <label className="text-slate-500 font-medium">Tahapan:</label>
            <select
              value={selectedStage}
              onChange={(e) => handleStageChange(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-hidden"
            >
              <option value="semua">Semua Tahapan</option>
              <option value="tahap1">Tahap 1 (Jan–Jun)</option>
              <option value="tahap2">Tahap 2 (Jul–Des)</option>
            </select>
          </div>

          {/* Filter Triwulan */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <label className="text-slate-500 font-medium">Triwulan:</label>
            <select
              value={selectedQuarter}
              onChange={(e) => handleQuarterChange(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-hidden"
            >
              <option value="semua">Semua Triwulan</option>
              <option value="tw1">Triwulan I (Jan–Mar)</option>
              <option value="tw2">Triwulan II (Apr–Jun)</option>
              <option value="tw3">Triwulan III (Jul–Sep)</option>
              <option value="tw4">Triwulan IV (Okt–Des)</option>
            </select>
          </div>

          {/* Filter Bulan */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <label className="text-slate-500 font-medium">Bulan:</label>
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-hidden"
            >
              <option value="semua">Semua Bulan</option>
              <option value="Januari">Januari</option>
              <option value="Februari">Februari</option>
              <option value="Maret">Maret</option>
              <option value="April">April</option>
              <option value="Mei">Mei</option>
              <option value="Juni">Juni</option>
            </select>
          </div>

          {/* Reset button if active */}
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition cursor-pointer"
              title="Reset Filter"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <span className="text-slate-600 font-mono text-[11px] bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
            {filteredTransactions.length} Transaksi ({formatRupiah(filteredFinancialSummary.totalExpenditure)})
          </span>
        </div>
      </div>

      {/* Quick Title & Active Filter Indicator */}
      <div className="bg-slate-900 text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between print:hidden">
        <span className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <span>
            Pratinjau Dokumen: <strong className="font-bold text-white">{docTitles[selectedDoc]}</strong>
          </span>
        </span>
        <span className="text-[11px] text-slate-300 font-medium">
          {filteredSchoolInfo.name} | {filteredSchoolInfo.period}
        </span>
      </div>

      {/* Document View Area */}
      <div className="bg-slate-100/70 p-4 sm:p-8 rounded-xl border border-slate-200/60 shadow-inner min-h-[600px] overflow-x-auto print:bg-white print:p-0 print:shadow-none print:border-none">
        {selectedDoc === "BUNDLE_ALL" && <DocFullBundle {...activeDocProps} />}
        {selectedDoc === "DOC_1_COVER" && <DocCover schoolInfo={filteredSchoolInfo} />}
        {selectedDoc === "DOC_2_PENGANTAR" && <DocSuratPengantar schoolInfo={filteredSchoolInfo} />}
        {selectedDoc === "DOC_3_4_5_NARASI" && (
          <DocNarasiLpj schoolInfo={filteredSchoolInfo} financialSummary={filteredFinancialSummary} />
        )}
        {selectedDoc === "DOC_6_SPTJM" && (
          <DocSptjm schoolInfo={filteredSchoolInfo} financialSummary={filteredFinancialSummary} />
        )}
        {selectedDoc === "DOC_7_RKAS_TRIWULAN" && (
          <DocRkasTriwulan schoolInfo={filteredSchoolInfo} rkasItems={props.rkasItems} />
        )}
        {selectedDoc === "DOC_8_BKU" && (
          <DocBkuK3 schoolInfo={filteredSchoolInfo} transactions={filteredTransactions} />
        )}
        {selectedDoc === "DOC_9_BANK" && <DocBankK5 schoolInfo={filteredSchoolInfo} />}
        {selectedDoc === "DOC_10_PAJAK" && <DocPajakK6 schoolInfo={filteredSchoolInfo} />}
        {selectedDoc === "DOC_11_REALISASI_K7A" && (
          <DocRealisasiK7a
            schoolInfo={filteredSchoolInfo}
            rkasItems={props.rkasItems}
            financialSummary={filteredFinancialSummary}
          />
        )}
        {selectedDoc === "DOC_12_REK_KORAN" && <DocRekeningKoran schoolInfo={filteredSchoolInfo} />}
        {selectedDoc === "DOC_13_PENUTUPAN_KAS_K7B" && (
          <DocPenutupanKasK7b schoolInfo={filteredSchoolInfo} denominations={props.denominations} />
        )}
        {selectedDoc === "DOC_14_BA_KAS_K7C" && <DocBAPemeriksaanKasK7c schoolInfo={filteredSchoolInfo} />}
        {selectedDoc === "DOC_15_SK_TIM" && <DocSkTim schoolInfo={filteredSchoolInfo} />}
        {selectedDoc === "DOC_16_BUKTI_KAS_BPU" && (
          <DocBuktiKasPengeluaran schoolInfo={filteredSchoolInfo} transactions={filteredTransactions} />
        )}
        {selectedDoc === "DOC_17_HONOR" && (
          <DocDaftarHonor schoolInfo={filteredSchoolInfo} transactions={filteredTransactions} />
        )}
        {selectedDoc === "DOC_18_DOKUMENTASI" && (
          <DocDokumentasiFoto schoolInfo={filteredSchoolInfo} transactions={filteredTransactions} />
        )}
        {selectedDoc === "DOC_19_ASET_FORM09" && (
          <DocAsetForm09 schoolInfo={filteredSchoolInfo} assets={props.assets} />
        )}
        {selectedDoc === "FORM3_REKON" && (
          <DocForm3Rekon
            schoolInfo={filteredSchoolInfo}
            form3Rows={filteredForm3Rows}
            financialSummary={filteredFinancialSummary}
          />
        )}
        {selectedDoc === "CHECKLIST28" && (
          <DocChecklist28 schoolInfo={filteredSchoolInfo} checklistItems={props.checklistItems} />
        )}
      </div>

      {props.onSaveSchoolInfo && (
        <KopSuratModal
          isOpen={isKopModalOpen}
          onClose={() => setIsKopModalOpen(false)}
          schoolInfo={props.schoolInfo}
          onSaveSchoolInfo={props.onSaveSchoolInfo}
        />
      )}
    </div>
  );
};
