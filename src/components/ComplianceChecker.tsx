import React, { useState } from "react";
import { ComplianceRule, SchoolInfo, FinancialSummary } from "../types/lpj";
import { formatRupiah } from "../utils/lpjCalculations";
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Users,
  Wrench,
  Sparkles,
  Info,
  FileCheck,
} from "lucide-react";

interface ComplianceCheckerProps {
  rules: ComplianceRule[];
  schoolInfo: SchoolInfo;
  financialSummary: FinancialSummary;
  setActiveTab: (tab: "dashboard" | "bku" | "documents" | "compliance" | "ai_assistant") => void;
}

export const ComplianceChecker: React.FC<ComplianceCheckerProps> = ({
  rules,
  schoolInfo,
  financialSummary,
  setActiveTab,
}) => {
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRunAiAudit = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/gemini/analyze-lpj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolInfo, financialSummary, rules }),
      });
      const data = await res.json();
      setAiAnalysisResult(data.analysis);
    } catch (error) {
      setAiAnalysisResult("Gagal melakukan analisis kepatuhan AI.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Instrumen Kepatuhan Permendikdasmen No. 8 Tahun 2026
              </h2>
              <p className="text-xs text-slate-500">
                Pemeriksaan otomatis batas rasio belanja BOSP Reguler Tahap 1 SMP Quran Al-Hamidy
              </p>
            </div>
          </div>

          <button
            onClick={handleRunAiAudit}
            disabled={isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-2 shadow-xs transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>{isAnalyzing ? "Menganalisis Kepatuhan via AI..." : "Jalankan Audit AI Gemini"}</span>
          </button>
        </div>
      </div>

      {/* Compliance Rule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rules.map((rule) => {
          const isWarning = rule.status === "WARNING";
          return (
            <div
              key={rule.id}
              className={`bg-white rounded-xl p-5 border shadow-xs transition space-y-4 flex flex-col justify-between ${
                isWarning
                  ? "border-amber-300 bg-amber-50/10"
                  : "border-slate-100 bg-white hover:border-slate-200"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {rule.id === "perpustakaan" ? (
                      <BookOpen className="w-5 h-5 text-amber-600" />
                    ) : rule.id === "honor" ? (
                      <Users className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Wrench className="w-5 h-5 text-slate-600" />
                    )}
                    <h3 className="font-bold text-sm text-slate-900">{rule.ruleName}</h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      isWarning
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {isWarning ? "Peringatan" : "Patuh (OK)"}
                  </span>
                </div>

                {/* Progress Stats */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">Ketentuan Aturan:</span>
                    <span className="font-bold text-slate-900">{rule.thresholdDescription}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">Batas Max/Min (Rp):</span>
                    <span className="font-mono font-bold text-slate-800">{formatRupiah(rule.maxAllowedAmount)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-1.5 border-t border-slate-200">
                    <span className="text-slate-700">Realisasi Tahap 1:</span>
                    <span
                      className={`font-mono font-bold ${
                        isWarning ? "text-amber-800" : "text-green-600"
                      }`}
                    >
                      {formatRupiah(rule.actualAmount)} ({rule.actualPercentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">{rule.notes}</p>
              </div>

              {/* Solution / Action Box if Warning */}
              {isWarning && (
                <div className="bg-amber-50/80 p-3 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1 text-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Solusi Pertanggungjawaban LPJ:</span>
                  </p>
                  <p className="text-[11px] leading-relaxed text-amber-900/90">
                    Sistem otomatis melengkapi <strong>Surat Komitmen Pengadaan Buku Teks Perpustakaan Tahap 2</strong> senilai {formatRupiah(rule.maxAllowedAmount)} agar LPJ Tahap 1 disetujui Inspektorat Dinas Pendidikan.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Compliance Report Display */}
      {aiAnalysisResult && (
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">
              Hasil Analisis & Opini Kepatuhan LPJ oleh AI Gemini
            </h3>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans bg-slate-800/60 p-4 rounded-lg border border-slate-800">
            {aiAnalysisResult}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setActiveTab("documents")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <FileCheck className="w-4 h-4" />
              <span>Cetak Berkas LPJ Dengan Pernyataan</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
