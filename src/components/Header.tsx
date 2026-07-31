import React from "react";
import { SchoolInfo, FinancialSummary } from "../types/lpj";
import {
  FileText,
  Printer,
  Sparkles,
  Settings,
  AlertTriangle,
  Building2,
  CheckCircle2,
  BarChart3,
  BookOpen,
} from "lucide-react";

interface HeaderProps {
  schoolInfo: SchoolInfo;
  financialSummary: FinancialSummary;
  activeTab: "dashboard" | "bku" | "documents" | "compliance" | "ai_assistant";
  setActiveTab: (tab: "dashboard" | "bku" | "documents" | "compliance" | "ai_assistant") => void;
  onOpenProfileModal: () => void;
  onPrintAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  schoolInfo,
  financialSummary,
  activeTab,
  setActiveTab,
  onOpenProfileModal,
  onPrintAll,
}) => {
  return (
    <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-40 shadow-xs print:hidden">
      {/* Top Info Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 text-xs bg-slate-50/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
            AH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold tracking-tight text-sm text-slate-900 uppercase">
                {schoolInfo.name}
              </h1>
              <span className="bg-slate-200/80 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono font-medium">
                NPSN: {schoolInfo.npsn}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {schoolInfo.fundSource} • Periode: {schoolInfo.period}
            </p>
          </div>
        </div>

        {/* Roles Quick Status & Confirmed Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-[11px] transition shadow-xs font-medium"
            title="Klik untuk mengubah atau mengonfirmasi peran Kepala Sekolah & Bendahara"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>
              Kepsek: <strong className="text-slate-900">{schoolInfo.headmaster}</strong> | Bendahara: <strong className="text-slate-900">{schoolInfo.treasurer}</strong>
            </span>
            <Settings className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          <button
            onClick={onPrintAll}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs transition shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Paket LPJ</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition ${
              activeTab === "dashboard"
                ? "bg-slate-900 text-white shadow-xs font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard Financial</span>
          </button>

          <button
            onClick={() => setActiveTab("bku")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition ${
              activeTab === "bku"
                ? "bg-slate-900 text-white shadow-xs font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Kelola BKU & Transaksi</span>
          </button>

          <button
            onClick={() => setActiveTab("compliance")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition relative ${
              activeTab === "compliance"
                ? "bg-slate-900 text-white shadow-xs font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <AlertTriangle className={`w-4 h-4 ${activeTab === "compliance" ? "text-amber-300" : "text-amber-500"}`} />
            <span>Aturan & Kepatuhan</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveTab("documents")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition ${
              activeTab === "documents"
                ? "bg-slate-900 text-white shadow-xs font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>11 Dokumen LPJ</span>
          </button>

          <button
            onClick={() => setActiveTab("ai_assistant")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition ${
              activeTab === "ai_assistant"
                ? "bg-blue-600 text-white shadow-xs font-semibold"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60"
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin-slow" />
            <span>AI Audit & Narator LPJ</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
