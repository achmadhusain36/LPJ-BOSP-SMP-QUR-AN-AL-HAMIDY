import React from "react";
import { SchoolInfo } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";

interface DocRekeningKoranProps {
  schoolInfo: SchoolInfo;
}

export const DocRekeningKoran: React.FC<DocRekeningKoranProps> = ({ schoolInfo }) => {
  return (
    <div className="bg-white p-6 shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0 text-gray-900 text-xs leading-relaxed font-sans max-w-5xl mx-auto">
      <DocumentHeader
        schoolInfo={schoolInfo}
        docTitle="REKAPITULASI MUTASI REKENING KORAN BOSP"
        docSubtitle="SIMULASI CETAK REKENING KORAN BANK LAMPUNG / BPD"
        docCode="REK KORAN BOSP"
        isLandscape={true}
      />

      <div className="border border-gray-800 p-4 font-mono text-[11px] mb-4 bg-gray-50/50 print:bg-white">
        <div className="grid grid-cols-2 gap-4 mb-3 border-b border-gray-300 pb-2 text-[10px]">
          <div>
            <p><strong>NAMA REKENING :</strong> BOSP SMP QURAN AL-HAMIDY</p>
            <p><strong>NO. REKENING   :</strong> 382.03.01.70035-6</p>
            <p><strong>MATA UANG      :</strong> IDR (Rupiah)</p>
          </div>
          <div>
            <p><strong>PERIODE CETAK :</strong> 01/01/2026 S.D. 30/06/2026</p>
            <p><strong>BANK PENERBIT  :</strong> BANK LAMPUNG KC PRINGSEWU</p>
            <p><strong>STATUS REKENING:</strong> AKTIF (TAHAP 1 NIHIL)</p>
          </div>
        </div>

        <table className="w-full border-collapse border border-gray-800 text-[10px]">
          <thead>
            <tr className="bg-gray-800 text-white font-bold text-center">
              <th className="border border-gray-800 px-2 py-1 w-20">TANGGAL</th>
              <th className="border border-gray-800 px-2 py-1">KETERANGAN MUTASI</th>
              <th className="border border-gray-800 px-2 py-1 w-12">D/K</th>
              <th className="border border-gray-800 px-2 py-1 w-28">MUTASI (RP)</th>
              <th className="border border-gray-800 px-2 py-1 w-28">SALDO (RP)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-800 px-2 py-1 text-center">01/01/2026</td>
              <td className="border border-gray-800 px-2 py-1">SALDO AWAL TAHUN 2026</td>
              <td className="border border-gray-800 px-2 py-1 text-center">K</td>
              <td className="border border-gray-800 px-2 py-1 text-right">0</td>
              <td className="border border-gray-800 px-2 py-1 text-right font-bold">0</td>
            </tr>
            <tr className="bg-emerald-50">
              <td className="border border-gray-800 px-2 py-1 text-center">21/01/2026</td>
              <td className="border border-gray-800 px-2 py-1">CR TRF SP2D BOSP REGULER TAHAP 1 2026 KAS NEGARA</td>
              <td className="border border-gray-800 px-2 py-1 text-center font-bold text-emerald-800">K</td>
              <td className="border border-gray-800 px-2 py-1 text-right text-emerald-800">80.850.000</td>
              <td className="border border-gray-800 px-2 py-1 text-right font-bold">80.850.000</td>
            </tr>
            <tr>
              <td className="border border-gray-800 px-2 py-1 text-center">22/01/2026</td>
              <td className="border border-gray-800 px-2 py-1">DB PENARIKAN TUNAI TELLER BANK BENDAHARA BOSP</td>
              <td className="border border-gray-800 px-2 py-1 text-center font-bold text-amber-800">D</td>
              <td className="border border-gray-800 px-2 py-1 text-right text-amber-800">80.850.000</td>
              <td className="border border-gray-800 px-2 py-1 text-right font-bold">0</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-gray-200 font-bold">
              <td colSpan={2} className="border border-gray-800 px-2 py-1.5 text-right">TOTAL MUTASI DEBET / KREDIT:</td>
              <td className="border border-gray-800 px-2 py-1.5 text-center">-</td>
              <td className="border border-gray-800 px-2 py-1.5 text-right">D: 80.850.000 | K: 80.850.000</td>
              <td className="border border-gray-800 px-2 py-1.5 text-right text-sm">SALDO AKHIR: 0</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="text-[11px] text-gray-700 italic border-l-4 border-amber-500 pl-3 py-1">
        * Lembar simulasi rekening koran ini dicetak sebagai dokumen pembantu penjelas mutasi bank LPJ BOSP Reguler Tahap 1 Tahun 2026.
      </div>
    </div>
  );
};
