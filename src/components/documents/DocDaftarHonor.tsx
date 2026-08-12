import React from "react";
import { SchoolInfo, BkuTransaction } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";
import { formatRupiah } from "../../utils/lpjCalculations";
import { FIXED_HONOR_RECIPIENTS, APRIL_INCIDENTAL_HONOR } from "../../data/honorData";

interface DocDaftarHonorProps {
  schoolInfo: SchoolInfo;
  transactions: BkuTransaction[];
}

export const DocDaftarHonor: React.FC<DocDaftarHonorProps> = ({ schoolInfo, transactions }) => {
  // Extract honor transactions from BKU
  const honorTx = transactions.filter(
    (tx) => tx.category === "honor" || tx.description.toLowerCase().includes("honor")
  );

  const totalHonorBku = honorTx.reduce((sum, tx) => sum + tx.expense, 0);

  // Compute recipient row totals
  // Each recipient gets:
  // Feb (Jan & Feb) = 2 * monthlyAmount
  // Mar = 1 * monthlyAmount
  // Apr = 1 * monthlyAmount
  // Mei = 1 * monthlyAmount
  // Jun = 1 * monthlyAmount
  // Total = 6 * monthlyAmount

  const recipientRecap = FIXED_HONOR_RECIPIENTS.map((r) => {
    const febAmount = r.monthlyAmount * 2;
    const marAmount = r.monthlyAmount * 1;
    const aprAmount = r.monthlyAmount * 1;
    const meiAmount = r.monthlyAmount * 1;
    const junAmount = r.monthlyAmount * 1;
    const totalPeriod = febAmount + marAmount + aprAmount + meiAmount + junAmount;

    return {
      ...r,
      febAmount,
      marAmount,
      aprAmount,
      meiAmount,
      junAmount,
      totalPeriod,
    };
  });

  const totalMonthlyRate = FIXED_HONOR_RECIPIENTS.reduce((sum, r) => sum + r.monthlyAmount, 0);
  const totalFeb = recipientRecap.reduce((sum, r) => sum + r.febAmount, 0);
  const totalMar = recipientRecap.reduce((sum, r) => sum + r.marAmount, 0);
  const totalAprMonthly = recipientRecap.reduce((sum, r) => sum + r.aprAmount, 0);
  const totalMei = recipientRecap.reduce((sum, r) => sum + r.meiAmount, 0);
  const totalJun = recipientRecap.reduce((sum, r) => sum + r.junAmount, 0);
  const totalRutinPeriod = recipientRecap.reduce((sum, r) => sum + r.totalPeriod, 0);

  const grandTotalRealisasi = totalRutinPeriod + APRIL_INCIDENTAL_HONOR.grossAmount;

  return (
    <div className="bg-white p-8 sm:p-10 shadow-sm border border-gray-200 min-h-[950px] font-sans text-xs text-gray-900 print:shadow-none print:border-none print:p-6 print:min-h-screen page-break-after-always">
      <DocumentHeader schoolInfo={schoolInfo} />

      <div className="text-center my-4">
        <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-gray-900">
          DAFTAR REKAPITULASI HONORARIUM GURU &amp; TENAGA KEPENDIDIKAN (NON-ASN)
        </h2>
        <p className="text-xs font-semibold text-emerald-800 uppercase">
          REKAPITULASI PER INDIVIDU SELURUH PERIODE BOSP REGULER TAHAP 1 TAHUN ANGGARAN {schoolInfo.year}
        </p>
      </div>

      <div className="my-3 text-[11px] bg-emerald-50 border border-emerald-200 p-2.5 rounded font-medium text-emerald-950 flex justify-between items-center">
        <span>
          Akumulasi Total Realisasi Belanja Honorarium (Kode 5.1.02.02) Tahap 1 BKU:
        </span>
        <strong className="font-mono font-bold text-sm text-emerald-950">
          {formatRupiah(totalHonorBku || grandTotalRealisasi)}
        </strong>
      </div>

      {/* REKAPITULASI ROUTINE MONTHLY TABLE */}
      <div className="overflow-x-auto my-4">
        <p className="font-bold text-[11px] text-gray-800 mb-1.5 uppercase">
          A. Rekapitulasi Pembayaran Honorarium Rutin Bulanan (Februari – Juni 2026)
        </p>
        <table className="w-full text-left border-collapse border border-gray-400 text-[10px]">
          <thead>
            <tr className="bg-emerald-950 text-white text-center font-bold">
              <th className="border border-gray-400 p-1.5 w-6">No</th>
              <th className="border border-gray-400 p-1.5">Nama Penerima Honor</th>
              <th className="border border-gray-400 p-1.5 w-24">Jabatan / Peran</th>
              <th className="border border-gray-400 p-1.5 w-20">Honor / Bln</th>
              <th className="border border-gray-400 p-1.5 w-20">Feb (Jan-Feb)</th>
              <th className="border border-gray-400 p-1.5 w-16">Maret</th>
              <th className="border border-gray-400 p-1.5 w-16">April</th>
              <th className="border border-gray-400 p-1.5 w-16">Mei</th>
              <th className="border border-gray-400 p-1.5 w-16">Juni</th>
              <th className="border border-gray-400 p-1.5 w-24">Total s.d Juni</th>
            </tr>
          </thead>
          <tbody>
            {recipientRecap.map((r) => (
              <tr key={r.no} className={r.no % 2 === 0 ? "bg-white" : "bg-gray-50/70"}>
                <td className="border border-gray-300 p-1.5 text-center font-semibold">{r.no}</td>
                <td className="border border-gray-300 p-1.5 font-bold">{r.name}</td>
                <td className="border border-gray-300 p-1.5 text-gray-700">{r.role}</td>
                <td className="border border-gray-300 p-1.5 text-right font-mono bg-gray-50/50">
                  {formatRupiah(r.monthlyAmount)}
                </td>
                <td className="border border-gray-300 p-1.5 text-right font-mono">{formatRupiah(r.febAmount)}</td>
                <td className="border border-gray-300 p-1.5 text-right font-mono">{formatRupiah(r.marAmount)}</td>
                <td className="border border-gray-300 p-1.5 text-right font-mono">{formatRupiah(r.aprAmount)}</td>
                <td className="border border-gray-300 p-1.5 text-right font-mono">{formatRupiah(r.meiAmount)}</td>
                <td className="border border-gray-300 p-1.5 text-right font-mono">{formatRupiah(r.junAmount)}</td>
                <td className="border border-gray-300 p-1.5 text-right font-mono font-bold text-emerald-950 bg-emerald-50/50">
                  {formatRupiah(r.totalPeriod)}
                </td>
              </tr>
            ))}
            <tr className="bg-emerald-100 font-bold text-emerald-950">
              <td className="border border-gray-400 p-2 text-center" colSpan={3}>
                TOTAL HONORARIUM RUTIN (10 PENERIMA)
              </td>
              <td className="border border-gray-400 p-2 text-right font-mono">
                {formatRupiah(totalMonthlyRate)}
              </td>
              <td className="border border-gray-400 p-2 text-right font-mono">
                {formatRupiah(totalFeb)}
              </td>
              <td className="border border-gray-400 p-2 text-right font-mono">
                {formatRupiah(totalMar)}
              </td>
              <td className="border border-gray-400 p-2 text-right font-mono">
                {formatRupiah(totalAprMonthly)}
              </td>
              <td className="border border-gray-400 p-2 text-right font-mono">
                {formatRupiah(totalMei)}
              </td>
              <td className="border border-gray-400 p-2 text-right font-mono">
                {formatRupiah(totalJun)}
              </td>
              <td className="border border-gray-400 p-2 text-right font-mono">
                {formatRupiah(totalRutinPeriod)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* REKAPITULASI INCIDENTAL HONOR TABLE */}
      <div className="my-4">
        <p className="font-bold text-[11px] text-gray-800 mb-1.5 uppercase">
          B. Honorarium Insidentil (Narasumber / Moderator Kegiatan Khusus)
        </p>
        <table className="w-full text-left border-collapse border border-gray-400 text-[10.5px]">
          <thead>
            <tr className="bg-amber-100 text-amber-950 font-bold text-center">
              <th className="border border-gray-400 p-1.5 w-6">No</th>
              <th className="border border-gray-400 p-1.5">Nama Penerima</th>
              <th className="border border-gray-400 p-1.5">Uraian / Kegiatan</th>
              <th className="border border-gray-400 p-1.5 w-20">Bulan</th>
              <th className="border border-gray-400 p-1.5 w-24">Jumlah Kotor</th>
              <th className="border border-gray-400 p-1.5 w-20">PPh 21 (5%)</th>
              <th className="border border-gray-400 p-1.5 w-24">Jumlah Bersih</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-1.5 text-center font-bold">1</td>
              <td className="border border-gray-300 p-1.5 font-bold">{APRIL_INCIDENTAL_HONOR.recipientName}</td>
              <td className="border border-gray-300 p-1.5 text-gray-700">{APRIL_INCIDENTAL_HONOR.description}</td>
              <td className="border border-gray-300 p-1.5 text-center">April 2026</td>
              <td className="border border-gray-300 p-1.5 text-right font-mono">{formatRupiah(APRIL_INCIDENTAL_HONOR.grossAmount)}</td>
              <td className="border border-gray-300 p-1.5 text-right font-mono font-semibold text-amber-900">{formatRupiah(APRIL_INCIDENTAL_HONOR.taxAmount)}</td>
              <td className="border border-gray-300 p-1.5 text-right font-mono font-bold text-emerald-900">{formatRupiah(APRIL_INCIDENTAL_HONOR.netAmount)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* GRAND TOTAL SUMMARY BOX */}
      <div className="p-3 bg-emerald-50 border border-emerald-300 rounded font-sans text-xs flex justify-between items-center my-4 text-emerald-950">
        <div>
          <span className="font-bold uppercase block text-[11px]">
            GRAND TOTAL REKAPITULASI HONORARIUM TAHAP 1 (RUTIN + INSIDENTIL):
          </span>
          <span className="text-[10px] text-emerald-800">
            Rutin Bulanan ({formatRupiah(totalRutinPeriod)}) + Insidentil ({formatRupiah(APRIL_INCIDENTAL_HONOR.grossAmount)})
          </span>
        </div>
        <div className="font-mono font-bold text-base text-emerald-950">
          {formatRupiah(grandTotalRealisasi)}
        </div>
      </div>

      <div className="mt-8">
        <DocumentSignature schoolInfo={schoolInfo} dateStr="30 Juni 2026" showCommittee={true} />
      </div>
    </div>
  );
};
