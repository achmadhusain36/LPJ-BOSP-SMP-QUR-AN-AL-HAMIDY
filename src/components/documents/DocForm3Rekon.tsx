import React from "react";
import { SchoolInfo, Form3Row, FinancialSummary } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";
import { formatRupiah } from "../../utils/lpjCalculations";

interface DocForm3RekonProps {
  schoolInfo: SchoolInfo;
  form3Rows: Form3Row[];
  financialSummary: FinancialSummary;
}

export const DocForm3Rekon: React.FC<DocForm3RekonProps> = ({
  schoolInfo,
  form3Rows,
  financialSummary,
}) => {
  const sumBarangJasa = form3Rows.reduce((sum, r) => sum + r.realisasiBarangJasa, 0);
  const sumModalKibB = form3Rows.reduce((sum, r) => sum + r.realisasiModalKibB, 0);
  const sumModalKibE = form3Rows.reduce((sum, r) => sum + r.realisasiModalKibE, 0);
  const sumTotalRealisasi = form3Rows.reduce((sum, r) => sum + r.totalRealisasi, 0);

  return (
    <div className="bg-white p-6 shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0 text-gray-900 text-xs leading-relaxed font-sans max-w-5xl mx-auto">
      <DocumentHeader
        schoolInfo={schoolInfo}
        docTitle="FORM 3 BELANJA DAN REKONSILIASI DANA BOSP"
        docSubtitle={`REKONSILIASI REALISASI TAHAP 1 TAHUN ANGGARAN ${schoolInfo.year}`}
        docCode="REV FORM 3 BOSP"
        isLandscape={true}
      />

      {/* School Info Grid */}
      <div className="mb-4 grid grid-cols-2 gap-4 text-[11px] border border-gray-800 p-3 bg-gray-50/50 print:bg-white">
        <div>
          <p><span className="font-bold w-28 inline-block">NPSN</span>: {schoolInfo.npsn}</p>
          <p><span className="font-bold w-28 inline-block">Nama Sekolah</span>: {schoolInfo.name}</p>
          <p><span className="font-bold w-28 inline-block">Kecamatan</span>: {schoolInfo.district}</p>
          <p><span className="font-bold w-28 inline-block">Kabupaten</span>: {schoolInfo.regency}</p>
        </div>
        <div>
          <p><span className="font-bold w-36 inline-block">Penerimaan Tahap 1</span>: {formatRupiah(financialSummary.totalIncome)}</p>
          <p><span className="font-bold w-36 inline-block">Total Realisasi Belanja</span>: {formatRupiah(financialSummary.totalExpenditure)}</p>
          <p><span className="font-bold w-36 inline-block">Saldo Kas per 30 Juni</span>: {formatRupiah(financialSummary.cashBalance)}</p>
          <p><span className="font-bold w-36 inline-block">Status Selisih Rekon</span>: <strong className="text-emerald-800 font-extrabold uppercase">COCOK (NIHIL)</strong></p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-800 text-[10px] print:text-[9px]">
          <thead>
            <tr className="bg-emerald-900 text-white font-bold text-center print:bg-gray-200 print:text-black">
              <th className="border border-gray-800 px-1 py-2 w-8" rowSpan={2}>No</th>
              <th className="border border-gray-800 px-1 py-2 w-20" rowSpan={2}>Kode Rekening</th>
              <th className="border border-gray-800 px-2 py-2" rowSpan={2}>Uraian Jenis Belanja RKAS BOSP</th>
              <th className="border border-gray-800 px-1 py-2 w-20" rowSpan={2}>Pagu Tahap 1 (Rp)</th>
              <th className="border border-gray-800 px-2 py-1" colSpan={3}>Realisasi Penggunaan Dana (Rp)</th>
              <th className="border border-gray-800 px-2 py-2 w-24" rowSpan={2}>Total Realisasi (Rp)</th>
              <th className="border border-gray-800 px-1 py-1" colSpan={3}>Kewajiban Perpajakan (Rp)</th>
            </tr>
            <tr className="bg-emerald-800 text-white font-bold text-center print:bg-gray-300 print:text-black">
              <th className="border border-gray-800 px-1 py-1 w-20">Barang/Jasa & Honor</th>
              <th className="border border-gray-800 px-1 py-1 w-20">Modal KIB B</th>
              <th className="border border-gray-800 px-1 py-1 w-20">Modal KIB E</th>
              <th className="border border-gray-800 px-1 py-1 w-14">Dipotong</th>
              <th className="border border-gray-800 px-1 py-1 w-14">Disetor</th>
              <th className="border border-gray-800 px-1 py-1 w-14">Sisa Pajak</th>
            </tr>
          </thead>
          <tbody>
            {form3Rows.map((r) => (
              <tr key={r.no} className={r.no % 2 === 0 ? "bg-white" : "bg-gray-50 print:bg-white"}>
                <td className="border border-gray-800 px-1 py-1.5 text-center font-mono">{r.no}</td>
                <td className="border border-gray-800 px-1 py-1.5 text-center font-mono text-[9px] font-semibold">{r.kodeRekening}</td>
                <td className="border border-gray-800 px-2 py-1.5 text-left">{r.namaRekening}</td>
                <td className="border border-gray-800 px-1 py-1.5 text-right font-mono">{r.rkasPaguTahap1.toLocaleString("id-ID")}</td>
                <td className="border border-gray-800 px-1 py-1.5 text-right font-mono">{r.realisasiBarangJasa > 0 ? r.realisasiBarangJasa.toLocaleString("id-ID") : "-"}</td>
                <td className="border border-gray-800 px-1 py-1.5 text-right font-mono font-semibold text-emerald-900">{r.realisasiModalKibB > 0 ? r.realisasiModalKibB.toLocaleString("id-ID") : "-"}</td>
                <td className="border border-gray-800 px-1 py-1.5 text-right font-mono">{r.realisasiModalKibE > 0 ? r.realisasiModalKibE.toLocaleString("id-ID") : "-"}</td>
                <td className="border border-gray-800 px-1 py-1.5 text-right font-mono font-bold">{r.totalRealisasi.toLocaleString("id-ID")}</td>
                <td className="border border-gray-800 px-1 py-1.5 text-center font-mono">0</td>
                <td className="border border-gray-800 px-1 py-1.5 text-center font-mono">0</td>
                <td className="border border-gray-800 px-1 py-1.5 text-center font-mono">0</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-emerald-100 font-bold text-gray-900 print:bg-gray-200">
              <td colSpan={4} className="border border-gray-800 px-2 py-2 text-right uppercase">
                JUMLAH REALISASI FORM 3:
              </td>
              <td className="border border-gray-800 px-1 py-2 text-right font-mono">{sumBarangJasa.toLocaleString("id-ID")}</td>
              <td className="border border-gray-800 px-1 py-2 text-right font-mono text-emerald-900">{sumModalKibB.toLocaleString("id-ID")}</td>
              <td className="border border-gray-800 px-1 py-2 text-right font-mono">{sumModalKibE.toLocaleString("id-ID")}</td>
              <td className="border border-gray-800 px-1 py-2 text-right font-mono text-sm">{sumTotalRealisasi.toLocaleString("id-ID")}</td>
              <td className="border border-gray-800 px-1 py-2 text-center font-mono">0</td>
              <td className="border border-gray-800 px-1 py-2 text-center font-mono">0</td>
              <td className="border border-gray-800 px-1 py-2 text-center font-mono">0</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Verification Formula Box */}
      <div className="mt-4 border border-gray-800 p-3 bg-emerald-50/50 text-[11px] print:bg-transparent">
        <p className="font-bold text-emerald-900 mb-1 uppercase">VERIFIKASI FORMULA REKONSILIASI BOSP TAHAP 1:</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>1. Total Penerimaan BOSP Tahap 1 : {formatRupiah(financialSummary.totalIncome)}</p>
            <p>2. Total Realisasi Belanja Barang/Jasa & Honor : {formatRupiah(sumBarangJasa)}</p>
            <p>3. Total Realisasi Belanja Modal Aset KIB B : {formatRupiah(sumModalKibB)}</p>
          </div>
          <div>
            <p>4. Total Realisasi Belanja Keseluruhan : {formatRupiah(sumTotalRealisasi)}</p>
            <p>5. Sisa Kas Tunai di Brankas Sekolah : {formatRupiah(financialSummary.cashBalance)}</p>
            <p className="font-bold text-emerald-900">6. SELISIH REKONSILIASI KAS (1 - 4 - 5) : Rp 0 (SESUAI/MATCH)</p>
          </div>
        </div>
      </div>

      <DocumentSignature schoolInfo={schoolInfo} dateStr="30 Juni 2026" />
    </div>
  );
};
