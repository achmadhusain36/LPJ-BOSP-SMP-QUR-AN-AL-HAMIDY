import React from "react";
import { SchoolInfo, CashDenomination } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";
import { formatRupiah } from "../../utils/lpjCalculations";

interface DocPenutupanKasK7bProps {
  schoolInfo: SchoolInfo;
  denominations: CashDenomination[];
  totalCashBalance?: number;
}

export const DocPenutupanKasK7b: React.FC<DocPenutupanKasK7bProps> = ({
  schoolInfo,
  denominations,
  totalCashBalance = 28964000,
}) => {
  const totalPaperMoney = denominations.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="bg-white p-6 shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0 text-gray-900 text-xs leading-relaxed font-sans max-w-5xl mx-auto">
      <DocumentHeader
        schoolInfo={schoolInfo}
        docTitle="REGISTER PENUTUPAN KAS (K7b)"
        docSubtitle={`TANGGAL PENUTUPAN KAS: 30 JUNI 2026 | TAHAP 1 TAHUN ${schoolInfo.year}`}
        docCode="FORM K7b BOSP"
      />

      <div className="mb-4 text-xs space-y-1">
        <p>Pada hari ini <strong>Selasa</strong> tanggal <strong>Tiga Puluh bulan Juni tahun Dua Ribu Dua Puluh Enam</strong>, kami yang bertanda tangan di bawah ini melakukan penutupan Kas BOSP {schoolInfo.name} dengan rincian sebagai berikut:</p>
      </div>

      <div className="grid grid-cols-2 gap-6 my-4">
        {/* Table A: Buku Kas */}
        <div className="border border-gray-800 p-3 bg-gray-50/50 print:bg-white">
          <p className="font-bold text-sm text-center border-b border-gray-800 pb-1 mb-2 uppercase">
            I. PENCATATAN SALDO KAS PADA BKU
          </p>
          <table className="w-full text-xs">
            <tbody>
              <tr>
                <td className="py-1">a. Saldo Buku Kas Umum (BKU)</td>
                <td className="py-1 text-right font-mono font-bold">: {formatRupiah(totalCashBalance)}</td>
              </tr>
              <tr>
                <td className="py-1">b. Saldo Buku Bantu Bank</td>
                <td className="py-1 text-right font-mono font-bold">: Rp 0</td>
              </tr>
              <tr>
                <td className="py-1">c. Saldo Buku Bantu Pajak</td>
                <td className="py-1 text-right font-mono font-bold">: Rp 0</td>
              </tr>
              <tr className="border-t border-gray-800 font-bold text-emerald-900">
                <td className="py-1">TOTAL SALDO KAS MENURUT BUKU</td>
                <td className="py-1 text-right font-mono">: {formatRupiah(totalCashBalance)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Table B: Hasil Opname Fisik Kas */}
        <div className="border border-gray-800 p-3 bg-gray-50/50 print:bg-white">
          <p className="font-bold text-sm text-center border-b border-gray-800 pb-1 mb-2 uppercase">
            II. HASIL PERHITUNGAN FISIK KAS (OPNAME)
          </p>
          <table className="w-full text-xs">
            <tbody>
              <tr>
                <td className="py-1">a. Saldo Kas Tunai di Brankas</td>
                <td className="py-1 text-right font-mono font-bold">: {formatRupiah(totalCashBalance)}</td>
              </tr>
              <tr>
                <td className="py-1">b. Saldo Rekening Bank Giro</td>
                <td className="py-1 text-right font-mono font-bold">: Rp 0</td>
              </tr>
              <tr>
                <td className="py-1">c. Surat/Surat Berharga/Surat Tugas</td>
                <td className="py-1 text-right font-mono font-bold">: Rp 0</td>
              </tr>
              <tr className="border-t border-gray-800 font-bold text-emerald-900">
                <td className="py-1">TOTAL FISIK KAS NYATA</td>
                <td className="py-1 text-right font-mono">: {formatRupiah(totalCashBalance)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Rincian Pecahan Lembar Uang Kertas */}
      <div className="my-4 border border-gray-800 p-3">
        <p className="font-bold text-xs uppercase mb-2 text-center border-b border-gray-400 pb-1">
          III. RINCIAN PERHITUNGAN UANG KERTAS DAN UANG LOGAM (FISIK BRANKAS)
        </p>

        <table className="w-full border-collapse border border-gray-800 text-[10px] print:text-[9px]">
          <thead>
            <tr className="bg-emerald-900 text-white font-bold text-center print:bg-gray-200 print:text-black">
              <th className="border border-gray-800 px-2 py-1 w-10">No</th>
              <th className="border border-gray-800 px-2 py-1">Pecahan / Lembaran Uang</th>
              <th className="border border-gray-800 px-2 py-1 w-24">Banyaknya</th>
              <th className="border border-gray-800 px-2 py-1 w-36">Jumlah Nominal (Rp)</th>
            </tr>
          </thead>
          <tbody>
            {denominations.map((d, idx) => (
              <tr key={d.value} className="text-center">
                <td className="border border-gray-800 px-2 py-1 font-mono">{idx + 1}</td>
                <td className="border border-gray-800 px-2 py-1 text-left">
                  Uang Kertas Nominal {formatRupiah(d.value)}
                </td>
                <td className="border border-gray-800 px-2 py-1 font-mono font-bold">
                  {d.count} lembar
                </td>
                <td className="border border-gray-800 px-2 py-1 text-right font-mono font-semibold">
                  {d.total.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-emerald-100 font-bold text-gray-900 print:bg-gray-200">
              <td colSpan={3} className="border border-gray-800 px-3 py-1.5 text-right uppercase">
                JUMLAH FISIK KAS NYATA:
              </td>
              <td className="border border-gray-800 px-2 py-1.5 text-right font-mono text-emerald-900 text-sm">
                {totalPaperMoney.toLocaleString("id-ID")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-[11px] print:bg-transparent print:border-none print:p-0">
        <p className="font-bold text-emerald-900 mb-0.5">KESIMPULAN HASIL PENUTUPAN KAS:</p>
        <p>Perbedaan antara Saldo BKU dengan Saldo Fisik Nyata Kas = <strong>Rp 0 (NIHIL / COCOK / TEPAT)</strong>.</p>
      </div>

      <DocumentSignature schoolInfo={schoolInfo} dateStr="30 Juni 2026" />
    </div>
  );
};
