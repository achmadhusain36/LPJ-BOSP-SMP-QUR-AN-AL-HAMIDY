import React from "react";
import { SchoolInfo, RkasProgramItem } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";
import { formatRupiah } from "../../utils/lpjCalculations";

interface DocRkasTriwulanProps {
  schoolInfo: SchoolInfo;
  rkasItems: RkasProgramItem[];
}

export const DocRkasTriwulan: React.FC<DocRkasTriwulanProps> = ({ schoolInfo, rkasItems }) => {
  const totalTahap1Budget = rkasItems.reduce((acc, item) => acc + item.budgetTahap1, 0);
  const totalTahap1Realized = rkasItems.reduce((acc, item) => acc + item.realizedTahap1, 0);

  return (
    <div className="bg-white p-8 sm:p-10 shadow-sm border border-gray-200 min-h-[950px] font-sans text-xs text-gray-900 print:shadow-none print:border-none print:p-6 print:min-h-screen page-break-after-always">
      <DocumentHeader schoolInfo={schoolInfo} />

      <div className="text-center my-4">
        <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-gray-900">
          RENCANA KEGIATAN DAN ANGGARAN SEKOLAH (RKAS) PER TRIWULAN
        </h2>
        <p className="text-xs font-semibold text-emerald-800 uppercase">
          ACUAN ANGGARAN BOSP REGULER TAHAP 1 (TRIWULAN I &amp; TRIWULAN II) TAHUN {schoolInfo.year}
        </p>
      </div>

      <div className="overflow-x-auto my-4">
        <table className="w-full text-left border-collapse border border-gray-400 text-[10.5px]">
          <thead>
            <tr className="bg-emerald-950 text-white text-center">
              <th className="border border-gray-400 p-1.5 w-8">No</th>
              <th className="border border-gray-400 p-1.5 w-24">Kode SNP</th>
              <th className="border border-gray-400 p-1.5">Program &amp; Rincian Kegiatan RKAS</th>
              <th className="border border-gray-400 p-1.5 w-24">Pagu TW I (Rp)</th>
              <th className="border border-gray-400 p-1.5 w-24">Pagu TW II (Rp)</th>
              <th className="border border-gray-400 p-1.5 w-28">Total Pagu Tahap 1</th>
              <th className="border border-gray-400 p-1.5 w-28">Realisasi s.d Jun</th>
            </tr>
          </thead>
          <tbody>
            {rkasItems.map((item, idx) => {
              const tw1Pagu = Math.round(item.budgetTahap1 * 0.5);
              const tw2Pagu = item.budgetTahap1 - tw1Pagu;

              return (
                <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/70"}>
                  <td className="border border-gray-300 p-1.5 text-center">{idx + 1}</td>
                  <td className="border border-gray-300 p-1.5 text-center font-mono font-semibold">{item.code}</td>
                  <td className="border border-gray-300 p-1.5 font-medium">{item.programName}</td>
                  <td className="border border-gray-300 p-1.5 text-right font-mono">{formatRupiah(tw1Pagu)}</td>
                  <td className="border border-gray-300 p-1.5 text-right font-mono">{formatRupiah(tw2Pagu)}</td>
                  <td className="border border-gray-300 p-1.5 text-right font-mono font-bold bg-amber-50/50">
                    {formatRupiah(item.budgetTahap1)}
                  </td>
                  <td className="border border-gray-300 p-1.5 text-right font-mono font-bold text-emerald-900 bg-emerald-50/50">
                    {formatRupiah(item.realizedTahap1)}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-emerald-100 font-bold text-emerald-950 text-xs">
              <td className="border border-gray-400 p-2 text-center" colSpan={3}>
                TOTAL ANGGARAN TRIWULAN I &amp; II (TAHAP 1)
              </td>
              <td className="border border-gray-400 p-2 text-right font-mono">
                {formatRupiah(Math.round(totalTahap1Budget * 0.5))}
              </td>
              <td className="border border-gray-400 p-2 text-right font-mono">
                {formatRupiah(totalTahap1Budget - Math.round(totalTahap1Budget * 0.5))}
              </td>
              <td className="border border-gray-400 p-2 text-right font-mono">
                {formatRupiah(totalTahap1Budget)}
              </td>
              <td className="border border-gray-400 p-2 text-right font-mono">
                {formatRupiah(totalTahap1Realized)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <DocumentSignature schoolInfo={schoolInfo} dateStr="30 Juni 2026" showCommittee={true} />
      </div>
    </div>
  );
};
