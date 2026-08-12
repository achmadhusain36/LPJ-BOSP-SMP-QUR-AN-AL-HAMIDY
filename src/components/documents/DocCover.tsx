import React from "react";
import { SchoolInfo } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";

interface DocCoverProps {
  schoolInfo: SchoolInfo;
}

export const DocCover: React.FC<DocCoverProps> = ({ schoolInfo }) => {
  return (
    <div className="bg-white p-8 sm:p-10 shadow-sm border border-gray-200 min-h-[950px] flex flex-col justify-between text-center print:shadow-none print:border-none print:p-6 print:min-h-screen page-break-after-always">
      <div>
        <DocumentHeader schoolInfo={schoolInfo} />

        <div className="mt-8 mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-emerald-900 text-amber-400 font-bold text-2xl flex items-center justify-center rounded-full border-4 border-amber-400 shadow-md">
            QA
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-emerald-950 mb-2 font-serif">
            LAPORAN PERTANGGUNGJAWABAN (LPJ)
          </h1>
          <h2 className="text-lg sm:text-xl font-bold uppercase text-gray-800 mb-2 font-serif">
            DANA BANTUAN OPERASIONAL SATUAN PENDIDIKAN (BOSP) REGULER
          </h2>
          <div className="inline-block px-6 py-2 bg-amber-100 text-amber-900 border-2 border-amber-500 rounded-full font-extrabold text-xs sm:text-sm uppercase tracking-wide my-2">
            TAHAP 1 (JANUARI – JUNI) TAHUN ANGGARAN {schoolInfo.year}
          </div>
        </div>
      </div>

      <div className="my-6 py-6 border-y-2 border-emerald-900 bg-emerald-50/50 rounded print:bg-transparent">
        <p className="text-xs uppercase font-bold text-gray-500 tracking-widest mb-1">
          SATUAN PENDIDIKAN:
        </p>
        <h3 className="text-xl sm:text-2xl font-black text-emerald-900 uppercase tracking-wide mb-1 font-serif">
          {schoolInfo.name}
        </h3>
        <p className="text-sm font-bold text-gray-800">NPSN: {schoolInfo.npsn}</p>
        <p className="text-xs text-gray-700 mt-2 max-w-lg mx-auto">
          {schoolInfo.address}, {schoolInfo.district}, {schoolInfo.regency}, {schoolInfo.province}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase text-gray-700 mb-4 leading-relaxed">
          DISAMPAIKAN KEPADA YTH: <br />
          <strong className="font-bold text-gray-900">
            TIM MANAJEMEN BOSP KABUPATEN PRINGSEWU / <br />
            KEPALA DINAS PENDIDIKAN DAN KEBUDAYAAN KABUPATEN PRINGSEWU
          </strong>
        </p>

        <DocumentSignature schoolInfo={schoolInfo} dateStr="30 Juni 2026" showCommittee={true} />
      </div>
    </div>
  );
};
