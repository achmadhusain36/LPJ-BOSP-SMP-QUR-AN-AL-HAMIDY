import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { BkuTransaction, SpendingCategory } from "../types/lpj";
import { formatRupiah } from "../utils/lpjCalculations";
import {
  FileSpreadsheet,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
  FileCheck,
  RefreshCw,
  Info,
} from "lucide-react";

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingTransactions: BkuTransaction[];
  onImportTransactions: (importedTxs: Omit<BkuTransaction, "id">[]) => void;
}

interface ParsedRow {
  rowNum: number;
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
  isValid: boolean;
  validationError?: string;
  isDuplicate?: boolean;
  selected: boolean;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  existingTransactions,
  onImportTransactions,
}) => {
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // 1. Download Standard Excel Template
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        "Tanggal (dd-mm-yyyy)": "10-02-2026",
        "Bulan": "Februari",
        "No Bukti": "KW-01/FEB/2026",
        "Kode Kegiatan": "03.02.01",
        "Kode Rekening": "5.1.02.01.01",
        "Uraian / Keterangan Transaksi": "Pembelian Alat Tulis Kantor & Kertas A4 80gr",
        "Penerimaan (Rp)": 0,
        "Pengeluaran (Rp)": 1250000,
        "Jenis Kas (bank/tunai)": "tunai",
        "Kategori (barang_jasa/honor/modal)": "barang_jasa",
      },
      {
        "Tanggal (dd-mm-yyyy)": "25-02-2026",
        "Bulan": "Februari",
        "No Bukti": "KW-02/FEB/2026",
        "Kode Kegiatan": "03.02.04",
        "Kode Rekening": "5.1.02.02.01",
        "Uraian / Keterangan Transaksi": "Pembayaran Honorarium Guru Non-ASN Bulan Feb 2026",
        "Penerimaan (Rp)": 0,
        "Pengeluaran (Rp)": 4695000,
        "Jenis Kas (bank/tunai)": "tunai",
        "Kategori (barang_jasa/honor/modal)": "honor",
      },
      {
        "Tanggal (dd-mm-yyyy)": "15-03-2026",
        "Bulan": "Maret",
        "No Bukti": "KW-03/MAR/2026",
        "Kode Kegiatan": "04.01.02",
        "Kode Rekening": "5.2.02.08.01",
        "Uraian / Keterangan Transaksi": "Pembelian Laptop Inventaris Sekolah (Belanja Modal Aset)",
        "Penerimaan (Rp)": 0,
        "Pengeluaran (Rp)": 8500000,
        "Jenis Kas (bank/tunai)": "bank",
        "Kategori (barang_jasa/honor/modal)": "modal",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template BKU BOSP");

    // Adjust Column Widths
    worksheet["!cols"] = [
      { wch: 18 },
      { wch: 12 },
      { wch: 18 },
      { wch: 14 },
      { wch: 16 },
      { wch: 45 },
      { wch: 16 },
      { wch: 16 },
      { wch: 16 },
      { wch: 20 },
    ];

    XLSX.writeFile(workbook, "Template_Import_BKU_BOSP_2026.xlsx");
  };

  // Helper to parse dates
  const parseExcelDate = (rawDate: any): string => {
    if (!rawDate) return "01-02-2026";
    if (typeof rawDate === "number") {
      // Excel serial date integer
      const dateObj = XLSX.SSF.parse_date_code(rawDate);
      if (dateObj) {
        const dd = String(dateObj.d).padStart(2, "0");
        const mm = String(dateObj.m).padStart(2, "0");
        const yyyy = dateObj.y;
        return `${dd}-${mm}-${yyyy}`;
      }
    }
    const str = String(rawDate).trim();
    if (str.includes("/")) {
      const parts = str.split("/");
      if (parts.length === 3) {
        return `${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}-${parts[2]}`;
      }
    }
    return str;
  };

  // Helper to infer Month name from date string or month column
  const inferMonthName = (
    rawMonth: string,
    dateStr: string
  ): "Januari" | "Februari" | "Maret" | "April" | "Mei" | "Juni" => {
    const validMonths = ["Januari", "Februari", "Maret", "April", "Mei", "Juni"];
    if (rawMonth && validMonths.includes(rawMonth.trim())) {
      return rawMonth.trim() as any;
    }
    if (dateStr && dateStr.includes("-")) {
      const monthNum = parseInt(dateStr.split("-")[1], 10);
      if (monthNum === 1) return "Januari";
      if (monthNum === 2) return "Februari";
      if (monthNum === 3) return "Maret";
      if (monthNum === 4) return "April";
      if (monthNum === 5) return "Mei";
      if (monthNum === 6) return "Juni";
    }
    return "Februari";
  };

  // Process File Reading
  const processFile = (file: File) => {
    setFileName(file.name);
    setIsProcessing(true);
    setImportSuccessMsg(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (!jsonRows || jsonRows.length === 0) {
          alert("File Excel/CSV kosong atau format tidak terbaca.");
          setIsProcessing(false);
          return;
        }

        const parsed: ParsedRow[] = jsonRows.map((row, index) => {
          // Flexible key lookup
          const dateRaw =
            row["Tanggal (dd-mm-yyyy)"] ||
            row["Tanggal"] ||
            row["tanggal"] ||
            row["DATE"];
          const monthRaw = row["Bulan"] || row["bulan"] || row["MONTH"];
          const proofNoRaw =
            row["No Bukti"] ||
            row["No. Bukti"] ||
            row["NO BUKTI"] ||
            row["ProofNo"];
          const activityCodeRaw =
            row["Kode Kegiatan"] || row["Kode_Kegiatan"] || row["Kegiatan"];
          const accountCodeRaw =
            row["Kode Rekening"] || row["Kode_Rekening"] || row["Rekening"];
          const descRaw =
            row["Uraian / Keterangan Transaksi"] ||
            row["Uraian"] ||
            row["Keterangan"] ||
            row["Description"];
          const receiptRaw =
            row["Penerimaan (Rp)"] || row["Penerimaan"] || row["Receipt"] || 0;
          const expenseRaw =
            row["Pengeluaran (Rp)"] || row["Pengeluaran"] || row["Expense"] || 0;
          const cashTypeRaw =
            row["Jenis Kas (bank/tunai)"] || row["Jenis Kas"] || row["CashType"];
          const categoryRaw =
            row["Kategori (barang_jasa/honor/modal)"] ||
            row["Kategori"] ||
            row["Category"];

          const date = parseExcelDate(dateRaw);
          const month = inferMonthName(String(monthRaw), date);
          const proofNo = String(proofNoRaw || `KW-${index + 1}`).trim();
          const activityCode = String(activityCodeRaw || "03.02.01").trim();
          const accountCode = String(accountCodeRaw || "5.1.02.01.01").trim();
          const description = String(descRaw || "").trim();
          const receipt = Number(String(receiptRaw).replace(/[^0-9.]/g, "")) || 0;
          const expense = Number(String(expenseRaw).replace(/[^0-9.]/g, "")) || 0;

          const cashTypeStr = String(cashTypeRaw || "tunai").toLowerCase();
          const cashType: "bank" | "tunai" = cashTypeStr.includes("bank")
            ? "bank"
            : "tunai";

          const catStr = String(categoryRaw || "barang_jasa").toLowerCase();
          let category: SpendingCategory = "barang_jasa";
          if (catStr.includes("honor") || accountCode.startsWith("5.1.02.02")) {
            category = "honor";
          } else if (
            catStr.includes("modal") ||
            accountCode.startsWith("5.2")
          ) {
            category = "modal";
          }

          // Validation logic
          let isValid = true;
          let validationError = "";

          if (!description) {
            isValid = false;
            validationError = "Uraian transaksi tidak boleh kosong";
          } else if (receipt === 0 && expense === 0) {
            isValid = false;
            validationError = "Nilai Penerimaan atau Pengeluaran harus > 0";
          }

          // Check duplicate proof number in existing BKU
          const isDuplicate = existingTransactions.some(
            (t) =>
              t.proofNo.toLowerCase() === proofNo.toLowerCase() &&
              t.expense === expense
          );

          return {
            rowNum: index + 2,
            date,
            month,
            proofNo,
            activityCode,
            accountCode,
            description,
            receipt,
            expense,
            cashType,
            category,
            isValid,
            validationError,
            isDuplicate,
            selected: isValid, // default selected if valid
          };
        });

        setParsedRows(parsed);
        setIsProcessing(false);
      } catch (err) {
        console.error("Error parsing spreadsheet:", err);
        alert("Gagal membaca file spreadsheet. Pastikan format file .xlsx atau .csv valid.");
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const toggleSelectRow = (rowNum: number) => {
    setParsedRows((prev) =>
      prev.map((r) => (r.rowNum === rowNum ? { ...r, selected: !r.selected } : r))
    );
  };

  const toggleSelectAll = (select: boolean) => {
    setParsedRows((prev) =>
      prev.map((r) => ({ ...r, selected: r.isValid ? select : false }))
    );
  };

  // Submit Selected Rows to Main State
  const handleConfirmImport = () => {
    const selectedRows = parsedRows.filter((r) => r.selected && r.isValid);
    if (selectedRows.length === 0) {
      alert("Tidak ada transaksi valid yang dipilih untuk di-import.");
      return;
    }

    const newTransactions: Omit<BkuTransaction, "id">[] = selectedRows.map((r) => ({
      date: r.date,
      month: r.month,
      proofNo: r.proofNo,
      activityCode: r.activityCode,
      accountCode: r.accountCode,
      description: r.description,
      receipt: r.receipt,
      expense: r.expense,
      balance: 0,
      cashType: r.cashType,
      category: r.category,
    }));

    onImportTransactions(newTransactions);
    setImportSuccessMsg(
      `Berhasil mengimpor ${newTransactions.length} transaksi ke BKU.`
    );

    setTimeout(() => {
      onClose();
      setParsedRows([]);
      setFileName("");
      setImportSuccessMsg(null);
    }, 1200);
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const selectedCount = parsedRows.filter((r) => r.selected && r.isValid).length;
  const duplicateCount = parsedRows.filter((r) => r.isDuplicate).length;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-5xl w-full p-6 space-y-5 my-8">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Import Transaksi BKU dari File Excel / CSV
              </h2>
              <p className="text-xs text-slate-500">
                Unggah spreadsheet transaksi bulk untuk memproses entri BKU secara otomatis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {importSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{importSuccessMsg}</span>
          </div>
        )}

        {/* Step 1: Upload Zone or Template Download */}
        {parsedRows.length === 0 ? (
          <div className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3 ${
                isDragging
                  ? "border-emerald-500 bg-emerald-50/50"
                  : "border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-400"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="p-3 bg-white shadow-xs border border-slate-200 rounded-full text-emerald-700">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Klik untuk pilih file atau Seret file Excel / CSV ke sini
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Format yang didukung: <strong>.XLSX, .XLS, .CSV</strong> (Maksimal 10 MB)
                </p>
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl flex items-start gap-3 text-xs text-amber-900">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <p className="font-bold">Belum punya format file yang sesuai?</p>
                <p className="text-[11px] text-amber-800">
                  Unduh template Excel resmi BOSP yang sudah dikonfigurasi dengan header kolom standar. Anda cukup mengisi baris transaksi lalu mengunggahnya kembali.
                </p>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-md font-semibold text-xs hover:bg-amber-700 transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Template Excel LPJ BOSP (.xlsx)</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Step 2: Preview & Validation Table */
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-800">
                  File: <span className="text-emerald-700">{fileName}</span>
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-600">
                  Total: <strong>{parsedRows.length}</strong> baris | Valid:{" "}
                  <strong className="text-emerald-700">{validCount}</strong>
                  {duplicateCount > 0 && (
                    <span className="text-amber-700 ml-1">
                      ({duplicateCount} Terdeteksi Duplikat)
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleSelectAll(true)}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Pilih Semua Valid
                </button>
                <button
                  type="button"
                  onClick={() => toggleSelectAll(false)}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Batal Pilih
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setParsedRows([]);
                    setFileName("");
                  }}
                  className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded text-[11px] font-semibold hover:bg-slate-300 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Ganti File
                </button>
              </div>
            </div>

            {/* Table Scroll Area */}
            <div className="overflow-x-auto max-h-[340px] border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 z-10">
                  <tr>
                    <th className="p-2 border-b border-slate-200 text-center w-10">
                      Pilih
                    </th>
                    <th className="p-2 border-b border-slate-200 w-12 text-center">
                      Baris
                    </th>
                    <th className="p-2 border-b border-slate-200 w-24">Tanggal</th>
                    <th className="p-2 border-b border-slate-200 w-28">No Bukti</th>
                    <th className="p-2 border-b border-slate-200">Uraian Transaksi</th>
                    <th className="p-2 border-b border-slate-200 w-24 text-right">
                      Pengeluaran
                    </th>
                    <th className="p-2 border-b border-slate-200 w-20 text-center">
                      Kas
                    </th>
                    <th className="p-2 border-b border-slate-200 w-24 text-center">
                      Kategori
                    </th>
                    <th className="p-2 border-b border-slate-200 w-32 text-center">
                      Status Data
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {parsedRows.map((row) => (
                    <tr
                      key={row.rowNum}
                      className={`hover:bg-slate-50 ${
                        !row.isValid
                          ? "bg-red-50/50 opacity-80"
                          : row.isDuplicate
                          ? "bg-amber-50/50"
                          : row.selected
                          ? "bg-emerald-50/30"
                          : ""
                      }`}
                    >
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          disabled={!row.isValid}
                          checked={row.selected}
                          onChange={() => toggleSelectRow(row.rowNum)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                        />
                      </td>
                      <td className="p-2 text-center font-mono text-slate-500">
                        #{row.rowNum}
                      </td>
                      <td className="p-2 font-mono whitespace-nowrap">{row.date}</td>
                      <td className="p-2 font-mono font-bold text-slate-800">
                        {row.proofNo}
                      </td>
                      <td className="p-2 max-w-xs truncate font-medium text-slate-900">
                        {row.description}
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        {row.expense > 0 ? formatRupiah(row.expense) : "-"}
                      </td>
                      <td className="p-2 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            row.cashType === "bank"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {row.cashType}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                          {row.category}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        {!row.isValid ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 rounded text-[10px] font-bold">
                            <XCircle className="w-3 h-3 text-red-600" />
                            {row.validationError}
                          </span>
                        ) : row.isDuplicate ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Potensi Duplikat
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Valid
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Import Confirmation Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Terpilih: <strong className="text-emerald-700">{selectedCount}</strong> transaksi dari {validCount} baris valid.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  disabled={selectedCount === 0}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Simpan &amp; Import ({selectedCount} Transaksi)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
