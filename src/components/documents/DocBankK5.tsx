import React from "react";
import { SchoolInfo } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";
import { formatRupiah } from "../../utils/lpjCalculations";

interface DocBankK5Props {
  schoolInfo: SchoolInfo;
}

export const DocBankK5: React.FC<DocBankK5Props> = ({ schoolInfo }) => {
  return (
    <div className="bg-white p-6 shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0 text-gray-900 text-xs leading-relaxed font-sans max-w-5xl mx-auto">
      <DocumentHeader
        schoolInfo={schoolInfo}
        docTitle="BUKU BANTU BANK (K5)"
        docSubtitle={`PERIODE: ${schoolInfo.period} | TAHAP 1 TAHUN ${schoolInfo.year}`}
        docCode="FORM K5 BOSP"
        isLandscape={true}
      />

      <div className="mb-4 text-xs">
        <p className="font-semibold">Nama Bank: Bank Lampung / Bank BPD Cabang Pringsewu</p>
        <p className="font-semibold">No. Rekening BOSP: 382.03.01.70035-6</p>
        <p className="font-semibold">Atas Nama: BOSP SMP QURAN AL-HAMIDY</p>
      </div>

      <table className="w-full border-collapse border border-gray-800 text-[10px] print:text-[9px]">
        <thead>
          <tr className="bg-emerald-900 text-white font-bold text-center print:bg-gray-200 print:text-black">
            <th className="border border-gray-800 px-2 py-1.5 w-8">No</th>
            <th className="border border-gray-800 px-2 py-1.5 w-24">Tanggal</th>
            <th className="border border-gray-800 px-2 py-1.5 w-24">No. Bukti</th>
            <th className="border border-gray-800 px-2 py-1.5">Uraian Transaksi Bank</th>
            <th className="border border-gray-800 px-2 py-1.5 w-28">Setoran (Rp)</th>
            <th className="border border-gray-800 px-2 py-1.5 w-28">Penarikan (Rp)</th>
            <th className="border border-gray-800 px-2 py-1.5 w-28">Saldo Bank (Rp)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-800 px-2 py-1 text-center font-mono">1</td>
            <td className="border border-gray-800 px-2 py-1 text-center font-mono">01-01-2026</td>
            <td className="border border-gray-800 px-2 py-1 text-center font-mono">-</td>
            <td className="border border-gray-800 px-2 py-1">Saldo Awal Kas Bank per 1 Januari 2026</td>
            <td className="border border-gray-800 px-2 py-1 text-right font-mono">0</td>
            <td className="border border-gray-800 px-2 py-1 text-right font-mono">0</td>
            <td className="border border-gray-800 px-2 py-1 text-right font-mono font-semibold">0</td>
          </tr>
          <tr className="bg-emerald-50/30 print:bg-white">
            <td className="border border-gray-800 px-2 py-1 text-center font-mono">2</td>
            <td className="border border-gray-800 px-2 py-1 text-center font-mono">21-01-2026</td>
            <td className="border border-gray-800 px-2 py-1 text-center font-mono">TRF-01/BOSP</td>
            <td className="border border-gray-800 px-2 py-1">
              Penerimaan Dana BOSP Reguler Tahap 1 Tahun 2026 via Transfer RKUD / Kas Negara
            </td>
            <td className="border border-gray-800 px-2 py-1 text-right font-mono">80.850.000</td>
            <td className="border border-gray-800 px-2 py-1 text-right font-mono">0</td>
            <td className="border border-gray-800 px-2 py-1 text-right font-mono font-semibold">80.850.000</td>
          </tr>
          <tr>
            <td className="border border-gray-800 px-2 py-1 text-center font-mono">3</td>
            <td className="border border-gray-800 px-2 py-1 text-center font-mono">22-01-2026</td>
            <td className="border border-gray-800 px-2 py-1 text-center font-mono">CKS-01/BOSP</td>
            <td className="border border-gray-800 px-2 py-1">
              Penarikan Tunai Penuh dari Rekening BOSP untuk Kas Tunai Bendahara Sekolah
            </td>
            <td className="border border-gray-800 px-2 py-1 text-right font-mono">0</td>
            <td className="border border-gray-800 px-2 py-1 text-right font-mono">80.850.000</td>
            <td className="border border-gray-800 px-2 py-1 text-right font-mono font-semibold text-emerald-900">0</td>
          </tr>
        </tbody>
        <tfoot>
          <tr className="bg-emerald-100 font-bold text-gray-900 print:bg-gray-200">
            <td colSpan={4} className="border border-gray-800 px-3 py-2 text-right uppercase">
              JUMLAH MUTASI BANK & SALDO AKHIR REKENING (PER 30 JUNI 2026):
            </td>
            <td className="border border-gray-800 px-2 py-2 text-right font-mono">80.850.000</td>
            <td className="border border-gray-800 px-2 py-2 text-right font-mono">80.850.000</td>
            <td className="border border-gray-800 px-2 py-2 text-right font-mono font-extrabold text-emerald-900">
              0
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-[11px] print:border-none print:p-0">
        <p className="font-bold mb-1">Catatan Buku Bantu Bank:</p>
        <p>1. Seluruh dana transfer BOSP Tahap 1 sebesar {formatRupiah(80850000)} telah ditarik tunai secara penuh oleh Bendahara pada tanggal 22 Januari 2026.</p>
        <p>2. Saldo akhir rekening bank BOSP per tanggal 30 Juni 2026 adalah <strong>Rp 0 (Nihil)</strong>.</p>
        <p>3. Tidak terdapat pendapatan bunga bank maupun potongan biaya administrasi bank pada rekening giro BOSP.</p>
      </div>

      <DocumentSignature schoolInfo={schoolInfo} dateStr="30 Juni 2026" />
    </div>
  );
};
