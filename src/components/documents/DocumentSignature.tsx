import React from "react";
import { SchoolInfo } from "../../types/lpj";

interface DocumentSignatureProps {
  schoolInfo: SchoolInfo;
  dateStr?: string;
  showCommittee?: boolean;
  locationStr?: string;
}

export const DocumentSignature: React.FC<DocumentSignatureProps> = ({
  schoolInfo,
  dateStr = "30 Juni 2026",
  showCommittee = false,
  locationStr = "Pringsewu",
}) => {
  const committeeName = schoolInfo.committeeName || "SYEKH AL-NGARIFIN, M.PD.";

  return (
    <div className="w-full mt-8 pt-4 text-xs font-serif text-gray-900 print:mt-6 print:text-[11px] page-break-inside-avoid break-inside-avoid mb-6 print:mb-[20mm]">
      {showCommittee ? (
        /* UNIFIED SIGNATURE BLOCK INCLUDING KOMITE (PENANGANAN KOMITE UNTUK HALAMAN PENGESAHAN) */
        <div className="space-y-6">
          <div className="flex justify-between items-start text-center">
            {/* Left: Bendahara */}
            <div className="w-5/12">
              <p className="mb-1 text-gray-600 font-sans text-[11px]">Mengetahui / Mengesahkan,</p>
              <p className="font-bold uppercase">Bendahara BOSP Sekolah</p>
              <div className="h-16 flex items-end justify-center my-1">
                <span className="text-[10px] text-gray-400 italic print:hidden">[Tanda Tangan & Stempel]</span>
              </div>
              <p className="font-bold underline uppercase text-sm print:text-xs">
                {schoolInfo.treasurer}
              </p>
              <p className="text-gray-700 font-sans text-[10px]">
                NIP. {schoolInfo.treasurerNip || "..........................."}
              </p>
            </div>

            {/* Right: Kepala Sekolah */}
            <div className="w-5/12">
              <p className="mb-1 text-gray-600 font-sans text-[11px]">
                Kec. {locationStr}, {dateStr}
              </p>
              <p className="font-bold uppercase">Kepala Sekolah</p>
              <div className="h-16 flex items-end justify-center my-1">
                <span className="text-[10px] text-gray-400 italic print:hidden">[Tanda Tangan & Stempel]</span>
              </div>
              <p className="font-bold underline uppercase text-sm print:text-xs">
                {schoolInfo.headmaster}
              </p>
              <p className="text-gray-700 font-sans text-[10px]">
                NIP. {schoolInfo.headmasterNip || "..........................."}
              </p>
            </div>
          </div>

          {/* Unified Committee Block (Di bawah Bendahara & Kepala Sekolah, bersatu dalam 1 area) */}
          <div className="text-center w-full pt-2">
            <div className="inline-block max-w-sm text-center">
              <p className="font-bold uppercase tracking-wide">Menyetujui,</p>
              <p className="font-bold uppercase tracking-wide">Ketua Komite Sekolah</p>
              <div className="h-16 flex items-end justify-center my-1">
                <span className="text-[10px] text-gray-400 italic print:hidden">[Tanda Tangan Komite]</span>
              </div>
              <p className="font-bold underline uppercase text-sm print:text-xs">
                {committeeName}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD 2-COLUMN SIGNATURE BLOCK (BENDAHARA & KEPALA SEKOLAH) */
        <div className="flex justify-between items-start text-center">
          {/* Left Side: Bendahara */}
          <div className="w-5/12">
            <p className="mb-1 text-gray-600 font-sans text-[11px]">Mengetahui / Mengesahkan,</p>
            <p className="font-bold uppercase">Bendahara BOSP Sekolah</p>
            <div className="h-16 flex items-end justify-center my-1">
              <span className="text-[10px] text-gray-400 italic print:hidden">[Tanda Tangan & Stempel]</span>
            </div>
            <p className="font-bold underline uppercase text-sm print:text-xs">
              {schoolInfo.treasurer}
            </p>
            <p className="text-gray-700 font-sans text-[10px]">
              NIP. {schoolInfo.treasurerNip || "..........................."}
            </p>
          </div>

          {/* Right Side: Kepala Sekolah */}
          <div className="w-5/12">
            <p className="mb-1 text-gray-600 font-sans text-[11px]">
              Kec. {locationStr}, {dateStr}
            </p>
            <p className="font-bold uppercase">Kepala Sekolah</p>
            <div className="h-16 flex items-end justify-center my-1">
              <span className="text-[10px] text-gray-400 italic print:hidden">[Tanda Tangan & Stempel]</span>
            </div>
            <p className="font-bold underline uppercase text-sm print:text-xs">
              {schoolInfo.headmaster}
            </p>
            <p className="text-gray-700 font-sans text-[10px]">
              NIP. {schoolInfo.headmasterNip || "..........................."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
