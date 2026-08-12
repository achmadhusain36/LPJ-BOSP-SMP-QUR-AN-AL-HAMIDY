import React, { useRef, useState } from "react";
import {
  SchoolInfo,
  BkuTransaction,
  RkasProgramItem,
  AssetRow,
  CashDenomination,
  ChecklistItem,
} from "../types/lpj";
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  X,
  AlertTriangle,
  HardDrive,
} from "lucide-react";

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolInfo: SchoolInfo;
  transactions: BkuTransaction[];
  rkasItems: RkasProgramItem[];
  assets: AssetRow[];
  denominations: CashDenomination[];
  checklistItems: ChecklistItem[];
  onRestoreFullState: (restoredData: {
    schoolInfo: SchoolInfo;
    transactions: BkuTransaction[];
    rkasItems: RkasProgramItem[];
    assets: AssetRow[];
    denominations: CashDenomination[];
    checklistItems: ChecklistItem[];
  }) => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  schoolInfo,
  transactions,
  rkasItems,
  assets,
  denominations,
  checklistItems,
  onRestoreFullState,
}) => {
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // 1. Export Full JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      appVersion: "1.0.0",
      exportTimestamp: new Date().toISOString(),
      schoolInfo,
      transactions,
      rkasItems,
      assets,
      denominations,
      checklistItems,
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const dateStr = new Date().toISOString().slice(0, 10);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Backup_LPJ_BOSP_${schoolInfo.name.replace(
      /\s+/g,
      "_"
    )}_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setMsg({
      type: "success",
      text: "Backup data LPJ BOSP berhasil diunduh dalam format JSON.",
    });
  };

  // 2. Import & Restore JSON Backup
  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed.schoolInfo || !parsed.transactions) {
          throw new Error("Format file JSON backup tidak valid.");
        }

        onRestoreFullState({
          schoolInfo: parsed.schoolInfo,
          transactions: parsed.transactions || [],
          rkasItems: parsed.rkasItems || [],
          assets: parsed.assets || [],
          denominations: parsed.denominations || [],
          checklistItems: parsed.checklistItems || [],
        });

        setMsg({
          type: "success",
          text: `Berhasil memulihkan seluruh data LPJ (${parsed.transactions.length} transaksi BKU).`,
        });

        setTimeout(() => {
          onClose();
          setMsg(null);
        }, 1200);
      } catch (err: any) {
        setMsg({
          type: "error",
          text: `Gagal memulihkan backup: ${err.message || "File rusak"}`,
        });
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-800 rounded-lg">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Backup &amp; Pulihkan Data LPJ BOSP
              </h2>
              <p className="text-xs text-slate-500">
                Cadangkan seluruh basis data LPJ atau pulihkan dari file cadangan
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

        {/* Message Banner */}
        {msg && (
          <div
            className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
              msg.type === "success"
                ? "bg-emerald-50 text-emerald-900 border border-emerald-300"
                : "bg-red-50 text-red-900 border border-red-300"
            }`}
          >
            {msg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Backup Info Cards */}
        <div className="space-y-3">
          {/* Export Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-emerald-600" />
                Unduh Cadangan Full Database (.json)
              </h3>
              <p className="text-[11px] text-slate-500">
                Termasuk {transactions.length} transaksi BKU, profil sekolah, rincian RKAS, dan inventaris.
              </p>
            </div>
            <button
              onClick={handleExportBackup}
              className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Backup</span>
            </button>
          </div>

          {/* Restore Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-blue-600" />
                Pulihkan Database Dari File Backup
              </h3>
              <p className="text-[11px] text-slate-500">
                Pilih file `.json` cadangan LPJ untuk mengembalikan data ke posisi semula.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileRestore}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>Restore</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
