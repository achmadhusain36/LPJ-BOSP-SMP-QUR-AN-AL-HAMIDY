import React from "react";
import {
  SchoolInfo,
  FinancialSummary,
  MonthlySummary,
  ComplianceRule,
  ChecklistItem,
} from "../types/lpj";
import { formatRupiah } from "../utils/lpjCalculations";
import { SpendingTrendChart } from "./SpendingTrendChart";
import {
  Wallet,
  TrendingDown,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  FileSpreadsheet,
  FileCheck,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

interface DashboardProps {
  schoolInfo: SchoolInfo;
  financialSummary: FinancialSummary;
  monthlySummaries: MonthlySummary[];
  complianceRules: ComplianceRule[];
  checklistItems: ChecklistItem[];
  setActiveTab: (tab: "dashboard" | "bku" | "documents" | "compliance" | "ai_assistant") => void;
  onOpenProfileModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  schoolInfo,
  financialSummary,
  monthlySummaries,
  complianceRules,
  checklistItems,
  setActiveTab,
  onOpenProfileModal,
}) => {
  const maxMonthlyExpenditure = Math.max(...monthlySummaries.map((m) => m.totalExpenditure), 1);
  const totalChecklistCount = checklistItems.length;
  const availableCount = checklistItems.filter((i) => i.status === "ADA").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-blue-600 text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded tracking-wider">
                LPJ BOSP TAHAP 1 2026
              </span>
              <span className="text-slate-400 text-xs">SMP Quran Al-Hamidy</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Sistem Generator & Rekonsiliasi LPJ BOSP
            </h2>
            <p className="text-slate-400 text-xs mt-1 max-w-2xl leading-relaxed">
              Olah otomatis data BKU, hitung rekonsiliasi Form 3, periksa kepatuhan aturan Permendikdasmen No. 8/2026, dan hasilkan 11 dokumen lengkap siap cetak.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("ai_assistant")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-2 shadow-xs transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Audit LPJ via AI Gemini</span>
            </button>
            <button
              onClick={onOpenProfileModal}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-lg text-xs flex items-center gap-2 transition"
            >
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Konfirmasi Pejabat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Financial Metric Cards (Matching HTML Template) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Penerimaan */}
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 transition hover:border-slate-200">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Total Penerimaan Tahap 1</p>
          <h2 className="text-2xl font-bold mt-1 text-slate-900 font-mono">
            {formatRupiah(financialSummary.totalIncome)}
          </h2>
          <p className="text-[10px] text-blue-600 font-semibold mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            <span>Cair 21 Jan 2026 • 100% Pagu</span>
          </p>
        </div>

        {/* Card 2: Realisasi Belanja */}
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 transition hover:border-slate-200">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Total Realisasi Belanja</p>
          <h2 className="text-2xl font-bold mt-1 text-slate-800 font-mono">
            {formatRupiah(financialSummary.totalExpenditure)}
          </h2>
          <div className="w-full bg-slate-200 h-1.5 mt-3 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full"
              style={{ width: `${Math.min(financialSummary.realizationPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5 font-medium flex justify-between">
            <span>Realisasi</span>
            <span className="font-bold text-slate-800">{financialSummary.realizationPercentage.toFixed(1)}%</span>
          </p>
        </div>

        {/* Card 3: Saldo Kas */}
        <div className="p-5 bg-slate-900 rounded-xl transition shadow-xs">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Saldo Akhir Kas (30 Jun)</p>
          <h2 className="text-2xl font-bold mt-1 text-white font-mono">
            {formatRupiah(financialSummary.cashBalance)}
          </h2>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">
            100% Kas Tunai • Rp 0 Bank
          </p>
        </div>

        {/* Card 4: Kepatuhan Aturan */}
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 transition hover:border-slate-200">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Validasi Regulasi</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px] border border-amber-200">
              1 Peringatan Buku
            </span>
            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold text-[10px] border border-green-200">
              2 Patuh
            </span>
          </div>
          <p className="mt-2.5 text-[10px] text-slate-500 leading-tight">
            Perpustakaan 0% (Komitmen Tahap 2)
          </p>
        </div>
      </div>

      {/* Summary Spending Trend & BOSP Allocation Chart (Recharts) */}
      <SpendingTrendChart
        financialSummary={financialSummary}
        monthlySummaries={monthlySummaries}
      />

      {/* Monthly Realization & Spending Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Expenditures Table & Bars */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl flex flex-col overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Rincian Belanja Per Bulan</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Alokasi realisasi BKU Januari – Juni 2026</p>
            </div>
            <button
              onClick={() => setActiveTab("bku")}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
            >
              <span>Detail BKU</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] uppercase text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 font-bold">Bulan</th>
                  <th className="px-6 py-3 font-bold">Barang/Jasa</th>
                  <th className="px-6 py-3 font-bold">Honor</th>
                  <th className="px-6 py-3 font-bold">Modal</th>
                  <th className="px-6 py-3 font-bold">Total</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-50">
                {monthlySummaries.map((m) => (
                  <tr key={m.month} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-3 font-medium text-slate-900">{m.month}</td>
                    <td className="px-6 py-3 text-slate-600 font-mono">{formatRupiah(m.barangJasa)}</td>
                    <td className="px-6 py-3 text-slate-600 font-mono">{formatRupiah(m.honor)}</td>
                    <td className="px-6 py-3 text-slate-600 font-mono">
                      {m.modal > 0 ? (
                        <span className="font-bold text-blue-600">{formatRupiah(m.modal)}</span>
                      ) : (
                        formatRupiah(m.modal)
                      )}
                    </td>
                    <td className="px-6 py-3 font-semibold text-slate-900 font-mono">
                      {formatRupiah(m.totalExpenditure)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Visual Legend / Summary Footer */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-4 text-[11px] font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <span>Barang/Jasa: <strong>{formatRupiah(financialSummary.categoryExpenditure.barangJasa)}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Honor PTK: <strong>{formatRupiah(financialSummary.categoryExpenditure.honor)}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>Modal Aset: <strong>{formatRupiah(financialSummary.categoryExpenditure.modal)}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Col: Compliance & Document Checklist */}
        <div className="space-y-6">
          {/* Compliance Status Card (Matching HTML) */}
          <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Validasi Kepatuhan</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  !
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Perpustakaan (Buku)</p>
                  <p className="text-[10px] text-slate-500">Realisasi 0% (Min. 10% / Rp 8.085.000)</p>
                  <span className="text-[9px] text-amber-700 font-bold uppercase mt-1 inline-block bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    Peringatan
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Batas Honorarium Non-ASN</p>
                  <p className="text-[10px] text-slate-500">
                    Realisasi 36.1% ({formatRupiah(financialSummary.categoryExpenditure.honor)}) — Max. 40%
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Pemeliharaan Sarpras</p>
                  <p className="text-[10px] text-slate-500">
                    Realisasi 1.5% ({formatRupiah(financialSummary.categoryExpenditure.barangJasa)}) — Max. 20%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Document Checklist Card (Matching HTML) */}
          <div className="p-6 border border-slate-100 rounded-xl bg-white shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Kelengkapan Berkas (LPJ)</h3>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              <div className="flex items-center justify-between text-[11px] p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-800 font-medium">Buku Kas Umum (K3)</span>
                <span className="text-green-600 font-bold uppercase text-[9px] bg-green-50 px-2 py-0.5 rounded border border-green-200">SIAP</span>
              </div>
              <div className="flex items-center justify-between text-[11px] p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-800 font-medium">Rekap Realisasi (K7a)</span>
                <span className="text-green-600 font-bold uppercase text-[9px] bg-green-50 px-2 py-0.5 rounded border border-green-200">SIAP</span>
              </div>
              <div className="flex items-center justify-between text-[11px] p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-800 font-medium">Form 3 Belanja & Rekon</span>
                <span className="text-green-600 font-bold uppercase text-[9px] bg-green-50 px-2 py-0.5 rounded border border-green-200">SIAP</span>
              </div>
              <div className="flex items-center justify-between text-[11px] p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-800 font-medium">BA Pemeriksaan Kas</span>
                <span className="text-green-600 font-bold uppercase text-[9px] bg-green-50 px-2 py-0.5 rounded border border-green-200">SIAP</span>
              </div>
              <div className="flex items-center justify-between text-[11px] p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400">Foto Kegiatan & Nota</span>
                <span className="text-slate-400 font-bold uppercase text-[9px]">MANUAL</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("documents")}
              className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              LIHAT & CETAK 11 DOKUMEN LPJ
            </button>
          </div>
        </div>
      </div>

      {/* Quick Feature Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab("bku")}
          className="bg-white p-5 rounded-xl border border-slate-100 hover:border-slate-300 shadow-xs cursor-pointer transition group"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-3 group-hover:bg-slate-900 group-hover:text-white transition">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm mb-1">
            Pencatatan & Kelola BKU
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Tambah, edit, atau hapus transaksi BKU. Rekalkulasi otomatis running balance tunai dan bank.
          </p>
        </div>

        <div
          onClick={() => setActiveTab("compliance")}
          className="bg-white p-5 rounded-xl border border-slate-100 hover:border-slate-300 shadow-xs cursor-pointer transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-white transition">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm mb-1">
            Pemeriksaan Kepatuhan Aturan
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Audit rasio belanja buku (10%), honor (40%), dan sarpras (20%) sesuai Juknis BOSP Tahap 1.
          </p>
        </div>

        <div
          onClick={() => setActiveTab("ai_assistant")}
          className="bg-white p-5 rounded-xl border border-slate-100 hover:border-blue-200 shadow-xs cursor-pointer transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm mb-1">
            AI Assistant & Narasi LPJ
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Hasikan narasi kata pengantar LPJ, analisis temuan audit, dan konsultasi aturan BOSP.
          </p>
        </div>
      </div>
    </div>
  );
};
