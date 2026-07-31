import React from "react";
import { SchoolInfo, RkasProgramItem, FinancialSummary } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";
import { formatRupiah } from "../../utils/lpjCalculations";

interface DocRealisasiK7aProps {
  schoolInfo: SchoolInfo;
  rkasItems: RkasProgramItem[];
  financialSummary: FinancialSummary;
}

export const DocRealisasiK7a: React.FC<DocRealisasiK7aProps> = ({
  schoolInfo,
  rkasItems,
  financialSummary,
}) => {
  const totalRkasTahap1 = rkasItems.reduce((sum, item) => sum + item.budgetTahap1, 0);
  const totalRealizedTahap1 = rkasItems.reduce((sum, item) => sum + item.realizedTahap1, 0);
  const totalRemaining = totalRkasTahap1 - totalRealizedTahap1;

  return (
    <div className="bg-white p-6 shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0 text-gray-900 text-xs leading-relaxed font-sans max-w-5xl mx-auto">
      <DocumentHeader
        schoolInfo={schoolInfo}
        docTitle="REKAPITULASI REALISASI PENGGUNAAN DANA BOSP (K7a)"
        docSubtitle={`PERIODE: ${schoolInfo.period} | TAHAP 1 TAHUN ${schoolInfo.year}`}
        docCode="FORM K7a BOSP"
        isLandscape={true}
      />

      <div className="mb-4 grid grid-cols-3 gap-2 text-[11px] bg-emerald-50 p-3 rounded border border-emerald-200 print:bg-transparent print:border-none print:p-0">
        <div>
          <p className="text-gray-600 font-medium">Total Penerimaan Tahap 1:</p>
          <p className="text-sm font-bold text-emerald-900">{formatRupiah(financialSummary.totalIncome)}</p>
        </div>
        <div>
          <p className="text-gray-600 font-medium">Total Realisasi Belanja:</p>
          <p className="text-sm font-bold text-amber-900">{formatRupiah(financialSummary.totalExpenditure)} ({financialSummary.realizationPercentage.toFixed(1)}%)</p>
        </div>
        <div>
          <p className="text-gray-600 font-medium">Sisa Kas Tunai:</p>
          <p className="text-sm font-bold text-emerald-900">{formatRupiah(financialSummary.cashBalance)}</p>
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-800 text-[10px] print:text-[9px]">
        <thead>
          <tr className="bg-emerald-900 text-white font-bold text-center print:bg-gray-200 print:text-black">
            <th className="border border-gray-800 px-2 py-2 w-8">No</th>
            <th className="border border-gray-800 px-2 py-2 w-24">Kode Rekening</th>
            <th className="border border-gray-800 px-2 py-2">Program Kegiatan / Jenis Belanja RKAS</th>
            <th className="border border-gray-800 px-2 py-2 w-28">Pagu RKAS Tahap 1 (Rp)</th>
            <th className="border border-gray-800 px-2 py-2 w-28">Realisasi Belanja (Rp)</th>
            <th className="border border-gray-800 px-2 py-2 w-28">Selisih / Sisa (Rp)</th>
            <th className="border border-gray-800 px-2 py-2 w-20">% Realisasi</th>
          </tr>
        </thead>
        <tbody>
          {rkasItems.map((item, idx) => {
            const diff = item.budgetTahap1 - item.realizedTahap1;
            const pct = item.budgetTahap1 > 0 ? (item.realizedTahap1 / item.budgetTahap1) * 100 : 0;
            return (
              <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 print:bg-white"}>
                <td className="border border-gray-800 px-2 py-1.5 text-center font-mono">{idx + 1}</td>
                <td className="border border-gray-800 px-2 py-1.5 text-center font-mono font-semibold">{item.code}</td>
                <td className="border border-gray-800 px-2 py-1.5 text-left font-medium">
                  {item.programName}
                  {item.isMandatoryLibrary && (
                    <span className="block text-[9px] text-red-600 font-bold italic print:text-black">
                      *Wajib Min 10% (Direalisasikan Tahap 2)
                    </span>
                  )}
                </td>
                <td className="border border-gray-800 px-2 py-1.5 text-right font-mono">
                  {item.budgetTahap1.toLocaleString("id-ID")}
                </td>
                <td className="border border-gray-800 px-2 py-1.5 text-right font-mono font-semibold">
                  {item.realizedTahap1.toLocaleString("id-ID")}
                </td>
                <td className="border border-gray-800 px-2 py-1.5 text-right font-mono text-emerald-900">
                  {diff.toLocaleString("id-ID")}
                </td>
                <td className="border border-gray-800 px-2 py-1.5 text-center font-mono font-bold">
                  {pct.toFixed(1)}%
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-emerald-100 font-bold text-gray-900 print:bg-gray-200">
            <td colSpan={3} className="border border-gray-800 px-3 py-2 text-right uppercase">
              JUMLAH TOTAL REALISASI DANA BOSP TAHAP 1:
            </td>
            <td className="border border-gray-800 px-2 py-2 text-right font-mono text-base">
              {totalRkasTahap1.toLocaleString("id-ID")}
            </td>
            <td className="border border-gray-800 px-2 py-2 text-right font-mono text-base text-amber-900 print:text-black">
              {totalRealizedTahap1.toLocaleString("id-ID")}
            </td>
            <td className="border border-gray-800 px-2 py-2 text-right font-mono text-base text-emerald-900 print:text-black">
              {totalRemaining.toLocaleString("id-ID")}
            </td>
            <td className="border border-gray-800 px-2 py-2 text-center font-mono text-base">
              {((totalRealizedTahap1 / totalRkasTahap1) * 100).toFixed(1)}%
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="mt-4 p-3 bg-gray-50 border border-gray-300 rounded text-[11px] print:border-none print:p-0">
        <p className="font-bold mb-1">Analisis Kinerja Realisasi Anggaran (K7a):</p>
        <p>1. Total alokasi penerimaan BOSP Reguler Tahap 1 sebesar <strong>{formatRupiah(totalRkasTahap1)}</strong> telah terealisasi sebesar <strong>{formatRupiah(totalRealizedTahap1)} (64.18%)</strong>.</p>
        <p>2. Sisa saldo kas tunai sebesar <strong>{formatRupiah(totalRemaining)}</strong> akan digunakan untuk mendukung pembiayaan operasional pembelajaran & pengadaan buku teks perpustakaan pada bulan Juli 2026 sebelum pencairan Tahap 2.</p>
      </div>

      <DocumentSignature schoolInfo={schoolInfo} dateStr="30 Juni 2026" />
    </div>
  );
};
