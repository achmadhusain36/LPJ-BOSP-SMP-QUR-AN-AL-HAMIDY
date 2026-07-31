import React from "react";
import { SchoolInfo } from "../../types/lpj";

interface DocumentSignatureProps {
  schoolInfo: SchoolInfo;
  dateStr?: string;
  showCommittee?: boolean;
}

export const DocumentSignature: React.FC<DocumentSignatureProps> = ({
  schoolInfo,
  dateStr = "30 Juni 2026",
  showCommittee = false,
}) => {
  return (
    <div className="w-full mt-8 pt-4 text-xs font-serif text-gray-900 print:mt-6 print:text-[11px] page-break-inside-avoid">
      <div className="flex justify-between items-start text-center">
        {/* Left Side: Bendahara */}
        <div className="w-5/12">
          <p className="mb-1 text-gray-600 font-sans text-[11px]">Mengetahui / Mengesahkan,</p>
          <p className="font-bold uppercase">Bendahara BOSP Sekolah</p>
          <div className="h-20 flex items-end justify-center">
            {/* Signature Area */}
            <span className="text-[10px] text-gray-400 italic print:hidden">[Tanda Tangan & Stempel]</span>
          </div>
          <p className="font-bold underline uppercase text-sm print:text-xs">
            {schoolInfo.treasurer}
          </p>
          <p className="text-gray-700">NIP. {schoolInfo.treasurerNip || "-"}</p>
        </div>

        {/* Right Side: Kepala Sekolah */}
        <div className="w-5/12">
          <p className="mb-1 text-gray-600 font-sans text-[11px]">
            Pringsewu, {dateStr}
          </p>
          <p className="font-bold uppercase">Kepala SMP Quran Al-Hamidy</p>
          <div className="h-20 flex items-end justify-center">
            {/* Signature Area */}
            <span className="text-[10px] text-gray-400 italic print:hidden">[Tanda Tangan & Stempel]</span>
          </div>
          <p className="font-bold underline uppercase text-sm print:text-xs">
            {schoolInfo.headmaster}
          </p>
          <p className="text-gray-700">NIP. {schoolInfo.headmasterNip || "-"}</p>
        </div>
      </div>

      {showCommittee && schoolInfo.committeeName && (
        <div className="mt-8 text-center w-full">
          <p className="font-bold uppercase">Menyetujui, Ketua Komite Sekolah</p>
          <div className="h-16 flex items-end justify-center">
            <span className="text-[10px] text-gray-400 italic print:hidden">[Tanda Tangan Komite]</span>
          </div>
          <p className="font-bold underline uppercase text-sm print:text-xs">
            {schoolInfo.committeeName}
          </p>
        </div>
      )}
    </div>
  );
};
