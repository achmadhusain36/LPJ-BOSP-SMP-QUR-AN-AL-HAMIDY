import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { SchoolInfo } from "../../types/lpj";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

interface DocVerificationStampProps {
  schoolInfo: SchoolInfo;
  documentTitle?: string;
}

export const DocVerificationStamp: React.FC<DocVerificationStampProps> = ({
  schoolInfo,
  documentTitle = "DOKUMEN LPJ BOSP REGULER TAHAP 1",
}) => {
  const verifyUrl = `https://bosp.kemdikbud.go.id/verifikasi?npsn=${schoolInfo.npsn}&tahap=1&tahun=${schoolInfo.year}&ts=${Date.now()}`;

  return (
    <div className="mt-8 pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-900 font-serif text-[10px]">
      {/* Left Text Detail */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-900">
          <ShieldCheck className="w-4 h-4 text-emerald-800" />
          <span>Sistem Validasi &amp; Verifikasi Digital LPJ BOSP</span>
        </div>
        <p className="text-slate-600">
          Dokumen ini diterbitkan secara otomatis dan sah sesuai Permendikbudristek Juknis BOSP.
        </p>
        <p className="font-mono text-slate-700">
          NPSN: <strong>{schoolInfo.npsn}</strong> | Hash Dokumen:{" "}
          <strong className="font-mono">VERIF-BOSP-{schoolInfo.npsn}-2026-T1-OK</strong>
        </p>
      </div>

      {/* Right QR Code Stamp */}
      <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-800 p-2 rounded">
        <QRCodeSVG value={verifyUrl} size={54} level="M" />
        <div className="text-[9px] space-y-0.5 leading-tight">
          <p className="font-bold uppercase text-emerald-900 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            TERVERIFIKASI TTD
          </p>
          <p className="font-mono font-semibold text-slate-800">
            {schoolInfo.headmaster}
          </p>
          <p className="text-slate-500 font-mono">
            {new Date().toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
