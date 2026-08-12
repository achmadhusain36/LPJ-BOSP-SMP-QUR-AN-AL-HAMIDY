import React from "react";
import { SchoolInfo } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";

interface DocSuratPengantarProps {
  schoolInfo: SchoolInfo;
}

export const DocSuratPengantar: React.FC<DocSuratPengantarProps> = ({ schoolInfo }) => {
  return (
    <div className="bg-white p-8 sm:p-10 shadow-sm border border-gray-200 min-h-[950px] font-serif text-xs text-gray-900 print:shadow-none print:border-none print:p-6 print:min-h-screen page-break-after-always">
      <DocumentHeader schoolInfo={schoolInfo} />

      <div className="mt-6 flex justify-between items-start font-sans text-xs">
        <div>
          <table>
            <tbody>
              <tr>
                <td className="w-20 font-semibold py-0.5">Nomor</td>
                <td className="px-2 py-0.5">:</td>
                <td className="font-semibold py-0.5">042.1/088/SMP.QA/VI/2026</td>
              </tr>
              <tr>
                <td className="font-semibold py-0.5">Sifat</td>
                <td className="px-2 py-0.5">:</td>
                <td className="py-0.5">Biasa / Penting</td>
              </tr>
              <tr>
                <td className="font-semibold py-0.5">Lampiran</td>
                <td className="px-2 py-0.5">:</td>
                <td className="py-0.5">1 (Satu) Berkas Lengkap</td>
              </tr>
              <tr>
                <td className="font-semibold py-0.5">Hal</td>
                <td className="px-2 py-0.5">:</td>
                <td className="font-bold py-0.5">
                  Laporan Pertanggungjawaban (LPJ) Dana BOSP Reguler Tahap 1 Tahun 2026
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-right">
          <p>Kec. {schoolInfo.district}, 30 Juni 2026</p>
          <p className="mt-4 font-bold">Yth. Tim Manajemen BOSP</p>
          <p>Dinas Pendidikan dan Kebudayaan</p>
          <p>Kabupaten Pringsewu</p>
          <p className="italic">di – Tempat</p>
        </div>
      </div>

      <div className="mt-8 space-y-4 text-justify text-sm print:text-xs leading-relaxed">
        <p>Dengan hormat,</p>
        <p className="indent-8">
          Bersama ini kami sampaikan Laporan Pertanggungjawaban (LPJ) Penggunaan Dana Bantuan Operasional Satuan Pendidikan (BOSP) Reguler Tahap 1 Tahun Anggaran {schoolInfo.year} pada {schoolInfo.name} NPSN {schoolInfo.npsn}, dengan rincian penerimaan dan penggunaan sebagai berikut:
        </p>

        <div className="bg-gray-50 border border-gray-300 p-4 rounded-lg font-sans my-4 space-y-1">
          <div className="flex justify-between font-medium">
            <span>1. Penerimaan Dana BOSP Reguler Tahap 1 (21 Jan 2026)</span>
            <span>: Rp 80.850.000</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>2. Realisasi Penggunaan s.d. 30 Juni 2026</span>
            <span>: Rp 51.886.000</span>
          </div>
          <div className="flex justify-between font-bold border-t border-gray-400 pt-1 text-emerald-900">
            <span>3. Sisa Kas Tunai per 30 Juni 2026</span>
            <span>: Rp 28.964.000</span>
          </div>
        </div>

        <p className="indent-8">
          Laporan ini disusun berdasarkan Bukti Kas Umum (BKU), Bukti Pembantu Bank, Bukti Pembantu Pajak, Register Penutupan Kas, serta kwitansi/bukti transaksi sah sesuai dengan peraturan perundang-undangan yang berlaku (Permendikdasmen No. 8 Tahun 2026).
        </p>

        <p className="indent-8">
          Demikian laporan pertanggungjawaban ini kami buat untuk dipergunakan sebagaimana mestinya. Atas perhatian dan bimbingan Bapa/Ibu Tim Manajemen BOSP Kabupaten Pringsewu, kami ucapkan terima kasih.
        </p>
      </div>

      <div className="mt-12">
        <DocumentSignature schoolInfo={schoolInfo} dateStr="30 Juni 2026" showCommittee={false} />
      </div>
    </div>
  );
};
