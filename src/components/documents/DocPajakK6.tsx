import React from "react";
import { SchoolInfo } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";

interface DocPajakK6Props {
  schoolInfo: SchoolInfo;
}

export const DocPajakK6: React.FC<DocPajakK6Props> = ({ schoolInfo }) => {
  return (
    <div className="bg-white p-6 shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0 text-gray-900 text-xs leading-relaxed font-sans max-w-5xl mx-auto">
      <DocumentHeader
        schoolInfo={schoolInfo}
        docTitle="BUKU BANTU PAJAK (K6)"
        docSubtitle={`PERIODE: ${schoolInfo.period} | TAHAP 1 TAHUN ${schoolInfo.year}`}
        docCode="FORM K6 BOSP"
        isLandscape={true}
      />

      <div className="relative border border-gray-800 p-2">
        {/* Watermark NIHIL */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <span className="text-8xl font-black tracking-widest text-red-600 border-8 border-red-600 p-6 rounded-3xl transform -rotate-12">
            NIHIL
          </span>
        </div>

        <table className="w-full border-collapse border border-gray-800 text-[10px] print:text-[9px]">
          <thead>
            <tr className="bg-emerald-900 text-white font-bold text-center print:bg-gray-200 print:text-black">
              <th className="border border-gray-800 px-2 py-1.5 w-8">No</th>
              <th className="border border-gray-800 px-2 py-1.5 w-20">Tanggal</th>
              <th className="border border-gray-800 px-2 py-1.5 w-20">No. Bukti</th>
              <th className="border border-gray-800 px-2 py-1.5">Uraian Transaksi Perpajakan</th>
              <th className="border border-gray-800 px-2 py-1.5 w-20">PPN (Rp)</th>
              <th className="border border-gray-800 px-2 py-1.5 w-20">PPh 21 (Rp)</th>
              <th className="border border-gray-800 px-2 py-1.5 w-20">PPh 22 (Rp)</th>
              <th className="border border-gray-800 px-2 py-1.5 w-20">PPh 23 (Rp)</th>
              <th className="border border-gray-800 px-2 py-1.5 w-20">Setor (Rp)</th>
              <th className="border border-gray-800 px-2 py-1.5 w-20">Saldo (Rp)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-800 px-2 py-6 text-center font-mono font-bold" colSpan={10}>
                --- TIDAK ADA TRANSAKSI PERPAJAKAN WAJIB PUNGUT (NIHIL) PERIODE JANUARI S.D. JUNI 2026 ---
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-emerald-100 font-bold text-gray-900 print:bg-gray-200 text-center">
              <td colSpan={4} className="border border-gray-800 px-2 py-2 text-right uppercase">
                JUMLAH TOTAL POTONGAN & SETORAN PAJAK:
              </td>
              <td className="border border-gray-800 px-1 py-2 font-mono">0</td>
              <td className="border border-gray-800 px-1 py-2 font-mono">0</td>
              <td className="border border-gray-800 px-1 py-2 font-mono">0</td>
              <td className="border border-gray-800 px-1 py-2 font-mono">0</td>
              <td className="border border-gray-800 px-1 py-2 font-mono">0</td>
              <td className="border border-gray-800 px-1 py-2 font-mono text-emerald-900">0</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-[11px] print:bg-transparent print:border-none print:p-0">
        <p className="font-bold text-emerald-900 mb-1">Keterangan Bebas Pungut Pajak Bendahara BOSP:</p>
        <p>1. <strong>Belanja Barang/Jasa:</strong> Nilai tiap lembar bukti pembayaran/kwitansi berada di bawah batas ambang pemotongan PPN/PPh Pasal 22 Wajib Pungut Bendahara (transaksi di bawah Rp 2.000.000 e-purchasing / ritel biasa).</p>
        <p>2. <strong>Belanja Honorarium:</strong> Penerima honorarium merupakan Guru & Tenaga Kependidikan Non-ASN swasta dengan besaran honor bulanan di bawah PTKP (Penghasilan Tidak Kena Pajak) / Golongan I & II (Tarif PPh 21 = 0%).</p>
      </div>

      <DocumentSignature schoolInfo={schoolInfo} dateStr="30 Juni 2026" />
    </div>
  );
};
