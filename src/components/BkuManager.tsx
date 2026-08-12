import React, { useState } from "react";
import { BkuTransaction, SpendingCategory } from "../types/lpj";
import { formatRupiah } from "../utils/lpjCalculations";
import { ExcelImportModal } from "./ExcelImportModal";
import { BackupRestoreModal } from "./BackupRestoreModal";
import {
  Plus,
  Trash2,
  Edit2,
  Download,
  Filter,
  Sparkles,
  Check,
  X,
  FileSpreadsheet,
  RefreshCw,
  Search,
  Upload,
  Database,
  SlidersHorizontal,
  Bookmark,
} from "lucide-react";

interface BkuManagerProps {
  transactions: BkuTransaction[];
  onAddTransaction: (tx: Omit<BkuTransaction, "id">) => void;
  onUpdateTransaction: (id: string, updated: Partial<BkuTransaction>) => void;
  onDeleteTransaction: (id: string) => void;
  onResetBku: () => void;
  onRestoreFullState?: (data: any) => void;
}

export const BkuManager: React.FC<BkuManagerProps> = ({
  transactions,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  onResetBku,
  onRestoreFullState,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>("semua");
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");
  const [selectedCashType, setSelectedCashType] = useState<string>("semua");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isAiPasteModalOpen, setIsAiPasteModalOpen] = useState(false);
  const [rawPastedText, setRawPastedText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New Transaction Form State
  const [newTx, setNewTx] = useState<{
    date: string;
    month: "Januari" | "Februari" | "Maret" | "April" | "Mei" | "Juni";
    proofNo: string;
    activityCode: string;
    accountCode: string;
    description: string;
    receipt: number;
    expense: number;
    cashType: "bank" | "tunai";
    category: SpendingCategory;
  }>({
    date: "15-06-2026",
    month: "Juni",
    proofNo: "KW-05/JUN/2026",
    activityCode: "03.02.04",
    accountCode: "5.1.02.01.01",
    description: "",
    receipt: 0,
    expense: 0,
    cashType: "tunai",
    category: "barang_jasa",
  });

  // Advanced Multi-Criteria Filter Logic
  const filteredTransactions = transactions.filter((tx) => {
    // 1. Month match
    const monthMatch = selectedMonth === "semua" || tx.month === selectedMonth;

    // 2. Category match
    const catMatch = selectedCategory === "semua" || tx.category === selectedCategory;

    // 3. Cash type match
    const cashMatch = selectedCashType === "semua" || tx.cashType === selectedCashType;

    // 4. Keyword search (proofNo, description, activityCode, accountCode)
    const kw = searchKeyword.trim().toLowerCase();
    const keywordMatch =
      !kw ||
      tx.proofNo.toLowerCase().includes(kw) ||
      tx.description.toLowerCase().includes(kw) ||
      tx.activityCode.toLowerCase().includes(kw) ||
      tx.accountCode.toLowerCase().includes(kw);

    // 5. Amount Range
    const val = tx.expense > 0 ? tx.expense : tx.receipt;
    const minVal = minAmount ? Number(minAmount) : 0;
    const maxVal = maxAmount ? Number(maxAmount) : Infinity;
    const amountMatch = val >= minVal && val <= maxVal;

    return monthMatch && catMatch && cashMatch && keywordMatch && amountMatch;
  });

  const activeFiltersCount =
    (selectedMonth !== "semua" ? 1 : 0) +
    (selectedCategory !== "semua" ? 1 : 0) +
    (selectedCashType !== "semua" ? 1 : 0) +
    (searchKeyword ? 1 : 0) +
    (minAmount || maxAmount ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedMonth("semua");
    setSelectedCategory("semua");
    setSelectedCashType("semua");
    setSearchKeyword("");
    setMinAmount("");
    setMaxAmount("");
  };

  const handleApplyPreset = (preset: "large" | "honor" | "bank" | "modal") => {
    resetAllFilters();
    if (preset === "large") {
      setMinAmount("1000000");
    } else if (preset === "honor") {
      setSelectedCategory("honor");
    } else if (preset === "bank") {
      setSelectedCashType("bank");
    } else if (preset === "modal") {
      setSelectedCategory("modal");
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.description || (newTx.receipt === 0 && newTx.expense === 0)) return;

    onAddTransaction({
      ...newTx,
      balance: 0, // Recalculated automatically
    });

    setIsAddModalOpen(false);
    setNewTx({
      date: "15-06-2026",
      month: "Juni",
      proofNo: "KW-05/JUN/2026",
      activityCode: "03.02.04",
      accountCode: "5.1.02.01.01",
      description: "",
      receipt: 0,
      expense: 0,
      cashType: "tunai",
      category: "barang_jasa",
    });
  };

  // Export BKU to CSV
  const handleExportCsv = () => {
    const headers = [
      "No",
      "Tanggal",
      "Bulan",
      "No Bukti",
      "Kode Kegiatan",
      "Kode Rekening",
      "Uraian Transaksi",
      "Penerimaan (Rp)",
      "Pengeluaran (Rp)",
      "Saldo Kas (Rp)",
      "Kategori",
    ];

    const rows = transactions.map((tx, idx) => [
      idx + 1,
      `"${tx.date}"`,
      `"${tx.month}"`,
      `"${tx.proofNo}"`,
      `"${tx.activityCode}"`,
      `"${tx.accountCode}"`,
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.receipt,
      tx.expense,
      tx.balance,
      `"${tx.category}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BKU_BOSP_SMP_Quran_AlHamidy_Tahap1_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // AI Parse Raw File / Text Paste
  const handleAiParse = async () => {
    if (!rawPastedText.trim()) return;
    setIsParsing(true);
    try {
      const res = await fetch("/api/gemini/parse-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: rawPastedText }),
      });
      const data = await res.json();
      if (Array.isArray(data.data)) {
        data.data.forEach((parsedTx: any) => {
          onAddTransaction({
            date: parsedTx.date || "15-06-2026",
            month: parsedTx.month || "Juni",
            proofNo: parsedTx.proofNo || "KW-AI/2026",
            activityCode: parsedTx.activityCode || "03.02.04",
            accountCode: parsedTx.accountCode || "5.1.02.01.01",
            description: parsedTx.description || "Transaksi Impor AI",
            receipt: Number(parsedTx.receipt) || 0,
            expense: Number(parsedTx.expense) || 0,
            balance: 0,
            cashType: "tunai",
            category: parsedTx.category || "barang_jasa",
          });
        });
        setIsAiPasteModalOpen(false);
        setRawPastedText("");
      }
    } catch (error) {
      alert("Gagal memproses teks transaksi via AI.");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <span>Manajemen Buku Kas Umum (BKU) K3</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola transaksi belanja & penerimaan. Saldo kumulatif dihitung otomatis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Transaksi BKU</span>
          </button>

          <button
            onClick={() => setIsExcelModalOpen(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
          >
            <Upload className="w-4 h-4" />
            <span>Import Excel / CSV</span>
          </button>

          <button
            onClick={() => setIsBackupModalOpen(true)}
            className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Backup / Restore</span>
          </button>

          <button
            onClick={() => setIsAiPasteModalOpen(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Impor Teks AI</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={onResetBku}
            title="Reset transaksi BKU ke data default SMP Quran Al-Hamidy"
            className="bg-white hover:bg-slate-50 text-slate-500 p-2 rounded-lg border border-slate-200 transition shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
        {/* Search Input & Basic Selects */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Cari kata kunci uraian, no bukti (KW-...), kode kegiatan/rekening..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Month Filter */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-hidden"
            >
              <option value="semua">Semua Bulan</option>
              <option value="Januari">Januari</option>
              <option value="Februari">Februari</option>
              <option value="Maret">Maret</option>
              <option value="April">April</option>
              <option value="Mei">Mei</option>
              <option value="Juni">Juni</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-hidden"
            >
              <option value="semua">Semua Kategori</option>
              <option value="barang_jasa">Barang &amp; Jasa</option>
              <option value="honor">Honorarium PTK</option>
              <option value="modal">Belanja Modal Aset</option>
              <option value="transfer">Transfer Kas</option>
            </select>

            {/* Cash Type Filter */}
            <select
              value={selectedCashType}
              onChange={(e) => setSelectedCashType(e.target.value)}
              className="px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-hidden"
            >
              <option value="semua">Semua Kas</option>
              <option value="tunai">Kas Tunai</option>
              <option value="bank">Kas Bank</option>
            </select>

            {/* Toggle Advanced Filters (Amount Range) */}
            <button
              onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
              className={`px-3 py-2 rounded-lg border font-semibold flex items-center gap-1.5 transition ${
                isAdvancedFilterOpen || minAmount || maxAmount
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Rentang Nominal</span>
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Nominal Range & Presets */}
        {isAdvancedFilterOpen && (
          <div className="pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            {/* Amount Range inputs */}
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-semibold shrink-0">Rentang Transaksi (Rp):</span>
              <input
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder="Min Rp 0"
                className="w-28 px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
              />
              <span className="text-slate-400">s.d</span>
              <input
                type="number"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                placeholder="Maksimal Rp"
                className="w-28 px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
              />
            </div>

            {/* Quick Filter Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-500 font-semibold flex items-center gap-1 text-[11px]">
                <Bookmark className="w-3 h-3 text-blue-600" /> Preset:
              </span>
              <button
                type="button"
                onClick={() => handleApplyPreset("large")}
                className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-blue-50 hover:border-blue-300 text-[11px] font-medium text-slate-700"
              >
                &ge; Rp 1 Jt
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset("honor")}
                className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-amber-50 hover:border-amber-300 text-[11px] font-medium text-slate-700"
              >
                Honor Non-ASN
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset("bank")}
                className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-blue-50 hover:border-blue-300 text-[11px] font-medium text-slate-700"
              >
                Transaksi Bank
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset("modal")}
                className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-blue-50 hover:border-blue-300 text-[11px] font-medium text-slate-700"
              >
                Belanja Modal
              </button>
            </div>
          </div>
        )}

        {/* Filter Summary Bar */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <div className="flex items-center gap-2">
            <span>
              Menampilkan <strong>{filteredTransactions.length}</strong> dari {transactions.length} transaksi.
            </span>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-full">
                {activeFiltersCount} Filter Aktif
              </span>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetAllFilters}
              className="text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Reset Semua Filter
            </button>
          )}
        </div>
      </div>

      {/* BKU Main Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-3 w-10 text-center">No</th>
                <th className="p-3 w-24">Tanggal</th>
                <th className="p-3 w-28">No. Bukti</th>
                <th className="p-3 w-28">Kode Rekening</th>
                <th className="p-3">Uraian Transaksi</th>
                <th className="p-3 w-28 text-right">Penerimaan</th>
                <th className="p-3 w-28 text-right">Pengeluaran</th>
                <th className="p-3 w-32 text-right">Saldo Kas</th>
                <th className="p-3 w-16 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-sans">
              {filteredTransactions.map((tx, idx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 text-center font-mono text-slate-400">{idx + 1}</td>
                  <td className="p-3 font-mono font-semibold whitespace-nowrap text-slate-800">{tx.date}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-500">{tx.proofNo}</td>
                  <td className="p-3 font-mono text-[11px] font-bold text-slate-900">{tx.accountCode}</td>
                  <td className="p-3">
                    <p className="font-medium text-slate-900">{tx.description}</p>
                    <span
                      className={`inline-block mt-1 text-[9.5px] px-2 py-0.5 rounded font-bold uppercase ${
                        tx.category === "honor"
                          ? "bg-amber-100/80 text-amber-800"
                          : tx.category === "modal"
                          ? "bg-blue-100/80 text-blue-800"
                          : tx.category === "transfer"
                          ? "bg-purple-100/80 text-purple-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {tx.category.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-green-600">
                    {tx.receipt > 0 ? formatRupiah(tx.receipt) : "-"}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-800">
                    {tx.expense > 0 ? formatRupiah(tx.expense) : "-"}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    {formatRupiah(tx.balance)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-100 transition"
                      title="Hapus Transaksi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-xl w-full shadow-lg border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <span>Tambah Transaksi Baru BKU</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tanggal Transaksi</label>
                  <input
                    type="text"
                    placeholder="15-06-2026"
                    value={newTx.date}
                    onChange={(e) => setNewTx((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-mono text-xs outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Bulan LPJ</label>
                  <select
                    value={newTx.month}
                    onChange={(e) =>
                      setNewTx((prev) => ({
                        ...prev,
                        month: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 text-xs font-semibold outline-hidden"
                  >
                    <option value="Januari">Januari</option>
                    <option value="Februari">Februari</option>
                    <option value="Maret">Maret</option>
                    <option value="April">April</option>
                    <option value="Mei">Mei</option>
                    <option value="Juni">Juni</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">No. Bukti / Kwitansi</label>
                  <input
                    type="text"
                    value={newTx.proofNo}
                    onChange={(e) => setNewTx((prev) => ({ ...prev, proofNo: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-mono text-xs outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kode Rekening RKAS</label>
                  <input
                    type="text"
                    value={newTx.accountCode}
                    onChange={(e) => setNewTx((prev) => ({ ...prev, accountCode: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-mono text-xs outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Uraian Transaksi / Belanja</label>
                <textarea
                  rows={2}
                  value={newTx.description}
                  onChange={(e) => setNewTx((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Contoh: Pembelian Alat Kebersihan, Kertas HVS, Tinta Printer..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 text-xs outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kategori Belanja</label>
                  <select
                    value={newTx.category}
                    onChange={(e) =>
                      setNewTx((prev) => ({
                        ...prev,
                        category: e.target.value as SpendingCategory,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 text-xs font-semibold outline-hidden"
                  >
                    <option value="barang_jasa">Barang & Jasa Operasional</option>
                    <option value="honor">Honorarium PTK Non-ASN</option>
                    <option value="modal">Belanja Modal Aset (KIB B/E)</option>
                    <option value="transfer">Transfer Kas / Penarikan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nominal Pengeluaran (Rp)</label>
                  <input
                    type="number"
                    value={newTx.expense}
                    onChange={(e) => setNewTx((prev) => ({ ...prev, expense: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-mono font-bold text-xs outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Ke BKU</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Raw Text/CSV Import Modal */}
      {isAiPasteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-xl w-full shadow-lg border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2 text-white">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Impor Teks / Catatan BKU via AI Gemini</span>
              </h3>
              <button onClick={() => setIsAiPasteModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600">
                Tempelkan teks transaksi dari Excel, Word, atau catatan BKU manual di bawah ini. AI Gemini akan mengekstrak tanggal, kwitansi, uraian, dan nominal secara otomatis ke dalam BKU:
              </p>

              <textarea
                rows={6}
                value={rawPastedText}
                onChange={(e) => setRawPastedText(e.target.value)}
                placeholder={`Contoh tempel teks:
15-06-2026 KW-02/JUN/2026 Pembelian Cat Tembok Rp 1.250.000
18-06-2026 KW-03/JUN/2026 Pembelian Tinta Printer & ATK Rp 2.436.000`}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-600 outline-hidden"
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => setIsAiPasteModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleAiParse}
                  disabled={isParsing || !rawPastedText.trim()}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs transition disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isParsing ? "Ekstrak Transaksi AI..." : "Proses & Tambah ke BKU"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Excel & CSV Bulk Import Modal */}
      <ExcelImportModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        existingTransactions={transactions}
        onImportTransactions={(importedTxs) => {
          importedTxs.forEach((tx) => onAddTransaction(tx));
        }}
      />

      {/* Backup & Restore Full Database Modal */}
      <BackupRestoreModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        schoolInfo={{
          name: "SMP Quran Al-Hamidy Pringsewu",
          npsn: "69987654",
          address: "Jl. Lapangan Sepak Bola, Podomoro, Kab. Pringsewu, Lampung",
          headmaster: "Ustadz M. Ridwan, M.Pd.",
          headmasterNip: "19820512 200801 1 008",
          treasurer: "Ahmad Fauzi, S.Pd.",
          treasurerNip: "19880914 201202 1 003",
          komite: "H. Abdullah Syukri",
          phase: "Tahap 1 (Januari - Juni 2026)",
          year: "2026",
          studentCount: 180,
          unitCostPerStudent: 1100000,
        }}
        transactions={transactions}
        rkasItems={[]}
        assets={[]}
        denominations={[]}
        checklistItems={[]}
        onRestoreFullState={(data) => {
          if (onRestoreFullState) {
            onRestoreFullState(data);
          }
        }}
      />
    </div>
  );
};
