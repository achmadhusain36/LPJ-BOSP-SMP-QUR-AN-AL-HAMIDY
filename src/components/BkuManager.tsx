import React, { useState, useMemo, useCallback } from "react";
import { BkuTransaction, SpendingCategory } from "../types/lpj";
import { formatRupiah } from "../utils/lpjCalculations";
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
} from "lucide-react";

interface BkuManagerProps {
  transactions: BkuTransaction[];
  onAddTransaction: (tx: Omit<BkuTransaction, "id">) => void;
  onUpdateTransaction: (id: string, updated: Partial<BkuTransaction>) => void;
  onDeleteTransaction: (id: string) => void;
  onResetBku: () => void;
}

export const BkuManager: React.FC<BkuManagerProps> = ({
  transactions,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  onResetBku,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>("semua");
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  // OPTIMIZED: Memoize filtered transactions to avoid recalculation on every render
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const monthMatch = selectedMonth === "semua" || tx.month === selectedMonth;
      const catMatch = selectedCategory === "semua" || tx.category === selectedCategory;
      return monthMatch && catMatch;
    });
  }, [transactions, selectedMonth, selectedCategory]);

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

  // OPTIMIZED: Use Blob API instead of data URI for large CSV exports
  const handleExportCsv = useCallback(() => {
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

    const csvLines = [headers.join(",")];

    // Build CSV line by line instead of one giant string
    transactions.forEach((tx, idx) => {
      const row = [
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
      ];
      csvLines.push(row.join(","));
    });

    // Use Blob API instead of data URI for better memory efficiency
    const csvContent = csvLines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `BKU_BOSP_SMP_Quran_AlHamidy_Tahap1_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Free memory
  }, [transactions]);

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

      {/* Filter Bar */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="font-bold text-slate-700">Filter Tampilan:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-slate-500 mr-1.5 font-medium">Bulan:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-hidden"
            >
              <option value="semua">Semua Bulan (Jan-Jun)</option>
              <option value="Januari">Januari</option>
              <option value="Februari">Februari</option>
              <option value="Maret">Maret</option>
              <option value="April">April</option>
              <option value="Mei">Mei</option>
              <option value="Juni">Juni</option>
            </select>
          </div>

          <div>
            <label className="text-slate-500 mr-1.5 font-medium">Kategori:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-hidden"
            >
              <option value="semua">Semua Kategori</option>
              <option value="barang_jasa">Barang & Jasa</option>
              <option value="honor">Honorarium PTK</option>
              <option value="modal">Belanja Modal Aset</option>
              <option value="transfer">Transfer Kas</option>
            </select>
          </div>

          <span className="text-slate-500 font-mono text-[11px] bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
            {filteredTransactions.length} Transaksi Terfilter
          </span>
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
    </div>
  );
};
