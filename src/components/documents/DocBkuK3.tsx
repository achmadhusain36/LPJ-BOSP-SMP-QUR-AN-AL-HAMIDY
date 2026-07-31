import React from "react";
import { SchoolInfo, BkuTransaction } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";
import { formatRupiah } from "../../utils/lpjCalculations";

interface DocBkuK3Props {
  schoolInfo: SchoolInfo;
  transactions: BkuTransaction[];
}

export const DocBkuK3: React.FC<DocBkuK3Props> = ({ schoolInfo, transactions }) => {
  const totalReceipt = transactions.reduce((sum, tx) => sum + tx.receipt, 0);
  const totalExpense = transactions.reduce((sum, tx) => sum + tx.expense, 0);
  const lastBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;

  return (
    <div className="bg-white p-6 shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0 text-gray-900 text-xs leading-relaxed font-sans max-w-5xl mx-auto">
      <DocumentHeader
        schoolInfo={schoolInfo}
        docTitle="BUKU KAS UMUM (BKU) / K3"
        docSubtitle={`PERIODE: ${schoolInfo.period} | TAHAP 1 TAHUN ${schoolInfo.year}`}
        docCode="FORM K3 BOSP"
        isLandscape={true}
      />

      <div className="mb-4 grid grid-cols-2 gap-4 text-[11px] bg-emerald-50/50 p-3 rounded border border-emerald-100 print:bg-transparent print:border-none print:p-0 print:mb-2">
        <div>
          <p><span className="font-semibold text-gray-700">Nama Sekolah:</span> {schoolInfo.name}</p>
          <p><span className="font-semibold text-gray-700">NPSN:</span> {schoolInfo.npsn}</p>
          <p><span className="font-semibold text-gray-700">Kabupaten/Provinsi:</span> {schoolInfo.regency}, {schoolInfo.province}</p>
        </div>
        <div>
          <p><span className="font-semibold text-gray-700">Sumber Dana:</span> {schoolInfo.fundSource}</p>
          <p><span className="font-semibold text-gray-700">Tahun Anggaran:</span> {schoolInfo.year}</p>
          <p><span className="font-semibold text-gray-700">Total Pagu Tahap 1:</span> {formatRupiah(80850000)}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-800 text-[10px] print:text-[9px]">
          <thead>
            <tr className="bg-emerald-900 text-white font-bold text-center print:bg-gray-200 print:text-black">
              <th className="border border-gray-800 px-2 py-1.5 w-8">No</th>
              <th className="border border-gray-800 px-2 py-1.5 w-20">Tanggal</th>
              <th className="border border-gray-800 px-2 py-1.5 w-20">No. Bukti</th>
              <th className="border border-gray-800 px-2 py-1.5 w-24">Kode Rek.</th>
              <th className="border border-gray-800 px-2 py-1.5">Uraian / Transaksi</th>
              <th className="border border-gray-800 px-2 py-1.5 w-24">Penerimaan (Rp)</th>
              <th className="border border-gray-800 px-2 py-1.5 w-24">Pengeluaran (Rp)</th>
              <th className="border border-gray-800 px-2 py-1.5 w-24">Saldo Kas (Rp)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={tx.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50 print:bg-white"}>
                <td className="border border-gray-800 px-2 py-1 text-center font-mono">{idx + 1}</td>
                <td className="border border-gray-800 px-2 py-1 text-center font-mono whitespace-nowrap">{tx.date}</td>
                <td className="border border-gray-800 px-2 py-1 text-center font-mono text-[9px]">{tx.proofNo}</td>
                <td className="border border-gray-800 px-2 py-1 text-center font-mono text-[9px]">{tx.accountCode}</td>
                <td className="border border-gray-800 px-2 py-1 text-left">{tx.description}</td>
                <td className="border border-gray-800 px-2 py-1 text-right font-mono">
                  {tx.receipt > 0 ? tx.receipt.toLocaleString("id-ID") : "-"}
                </td>
                <td className="border border-gray-800 px-2 py-1 text-right font-mono">
                  {tx.expense > 0 ? tx.expense.toLocaleString("id-ID") : "-"}
                </td>
                <td className="border border-gray-800 px-2 py-1 text-right font-mono font-semibold">
                  {tx.balance.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-emerald-100 font-bold text-gray-900 print:bg-gray-200">
              <td colSpan={5} className="border border-gray-800 px-3 py-2 text-right uppercase">
                TOTAL PENERIMAAN & PENGELUARAN (JAN-JUN 2026):
              </td>
              <td className="border border-gray-800 px-2 py-2 text-right font-mono">
                {totalReceipt.toLocaleString("id-ID")}
              </td>
              <td className="border border-gray-800 px-2 py-2 text-right font-mono text-amber-900 print:text-black">
                {totalExpense.toLocaleString("id-ID")}
              </td>
              <td className="border border-gray-800 px-2 py-2 text-right font-mono text-emerald-900 print:text-black">
                {lastBalance.toLocaleString("id-ID")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 p-3 bg-emerald-50 rounded border border-emerald-200 text-[11px] print:bg-transparent print:border-none print:p-0">
        <p className="font-bold text-emerald-900 print:text-black mb-1">
          REKAPITULASI BUKU KAS UMUM PER 30 JUNI 2026:
        </p>
        <ul className="list-disc pl-5 space-y-0.5 text-gray-800">
          <li>Total Penerimaan BOSP Tahap 1 : <strong>{formatRupiah(80850000)}</strong></li>
          <li>Total Belanja Realisasi s.d. 30 Juni 2026 : <strong>{formatRupiah(totalExpense)}</strong></li>
          <li>Saldo Akhir Kas Tunai di Brankas : <strong>{formatRupiah(lastBalance)}</strong></li>
          <li>Saldo Rekening Bank BOSP : <strong>Rp 0 (Penarikan Tunai Penuh)</strong></li>
        </ul>
      </div>

      <DocumentSignature schoolInfo={schoolInfo} dateStr="30 Juni 2026" />
    </div>
  );
};
