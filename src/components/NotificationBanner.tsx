import React, { useState } from "react";
import { ComplianceRule } from "../types/lpj";
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle2,
  X,
  ChevronRight,
  Info,
} from "lucide-react";

interface NotificationBannerProps {
  complianceRules: ComplianceRule[];
  onNavigateToCompliance: () => void;
  onNavigateToBku: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  complianceRules,
  onNavigateToCompliance,
  onNavigateToBku,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Target Deadline: 30 Juni 2026 (Penutupan LPJ BOSP Reguler Tahap 1)
  const deadlineDate = new Date("2026-06-30");
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Count compliance status
  const failedRules = complianceRules.filter((r) => r.status === "warning");
  const passedRulesCount = complianceRules.filter((r) => r.status === "pass").length;

  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white px-4 py-2.5 shadow-md border-b border-emerald-800 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        {/* Left Status Summary */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-emerald-800/60 px-2.5 py-1 rounded-full border border-emerald-600/50 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>
              Deadline Pelaporan Tahap 1: <strong>30 Juni 2026</strong>
              {remainingDays > 0 ? (
                <span className="ml-1 text-amber-300 font-bold">
                  ({remainingDays} Hari Lagi)
                </span>
              ) : (
                <span className="ml-1 text-emerald-300 font-bold">
                  (Masa Pelaporan Selesai)
                </span>
              )}
            </span>
          </div>

          {failedRules.length > 0 ? (
            <button
              onClick={onNavigateToCompliance}
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold hover:underline"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{failedRules.length} Aturan Juknis Memerlukan Perhatian</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-1 text-emerald-300 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Kepatuhan Juknis BOSP Verified ({passedRulesCount} Indikator Lulus)</span>
            </div>
          )}
        </div>

        {/* Right Actions & Dismiss */}
        <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
          <button
            onClick={onNavigateToCompliance}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-[11px] transition shadow-xs flex items-center gap-1"
          >
            <Bell className="w-3 h-3" />
            <span>Cek Compliance Report</span>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800/80 transition"
            title="Tutup Pengingat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
