import React from "react";
import { SchoolInfo, FinancialSummary } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";
import { formatRupiah } from "../../utils/lpjCalculations";

interface DocSptjmProps {
  schoolInfo: SchoolInfo;
  financialSummary: FinancialSummary;
}

export const DocSptjm: React.FC<DocSptjmProps> = ({ schoolInfo, financialSummary }) => {
  return (
    <div className="bg-white p-8 sm:p-10 shadow-sm border border-gray-200 min-h-[950px] font-serif text-xs text-gray-900 print:shadow-none print:border-none print:p-6 print:min-h-screen page-break-after-always">
      <DocumentHeader schoolInfo={schoolInfo} />

      <div className="text-center my-6">
        <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider underline">
          SURAT PERNYATAAN TANGGUNG JAWAB MUTLAK (SPTJM)
        </h2>
        <p className="text-xs font-semibold text-gray-700 mt-1">
          DANA BOSP REGULER TAHAP 1 TAHUN ANGGARAN {schoolInfo.year}
        </p>
      </div>

      <div className="space-y-4 text-justify leading-relaxed">
        <p>Yang bertanda tangan di bawah ini:</p>

        <div className="ml-6 space-y-1 font-sans text-xs">
          <div className="flex">
            <span className="w-36 font-semibold">Nama Kepala Sekolah</span>
            <span>: {schoolInfo.headmaster}</span>
          </div>
          <div className="flex">
            <span className="w-36 font-semibold">NIP</span>
            <span>: {schoolInfo.headmasterNip || "-"}</span>
          </div>
          <div className="flex">
            <span className="w-36 font-semibold">Jabatan</span>
            <span>: Kepala {schoolInfo.name}</span>
          </div>
          <div className="flex">
            <span className="w-36 font-semibold">Nama Satuan Pendidikan</span>
            <span>: {schoolInfo.name} (NPSN: {schoolInfo.npsn})</span>
          </div>
          <div className="flex">
            <span className="w-36 font-semibold">Alamat Sekolah</span>
            <span>: {schoolInfo.address}, Kec. {schoolInfo.district}, Kab. {schoolInfo.regency}</span>
          </div>
        </div>

        <p>Dengan ini menyatakan dengan sesungguhnya bahwa:</p>

        <ol className="list-decimal ml-8 space-y-2 text-justify">
          <li>
            Bertanggung jawab penuh atas kebenaran, keabsahan, dan penggunaan Dana Bantuan Operasional Satuan Pendidikan (BOSP) Reguler Tahap 1 Tahun Anggaran {schoolInfo.year} sebesar <strong>{formatRupiah(financialSummary.totalIncome || 80850000)}</strong>.
          </li>
          <li>
            Penggunaan Dana BOSP Reguler Tahap 1 sebesar <strong>{formatRupiah(financialSummary.totalExpenditure)}</strong> telah dilaksanakan sesuai dengan RKAS serta ketentuan Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi / Permendikdasmen Nomor 8 Tahun 2026.
          </li>
          <li>
            Sisa kas dana BOSP Tahap 1 per 30 Juni 2026 adalah sebesar <strong>{formatRupiah(financialSummary.cashBalance)}</strong> (tersimpan 100% pada Kas Tunai Sekolah).
          </li>
          <li>
            Bukti-bukti pengeluaran/transaksi disimpan di Satuan Pendidikan sebagai bahan pemeriksaan dan audit oleh lembaga/instansi pengawas yang berwenang.
          </li>
          <li>
            Apabila di kemudian hari terdapat kekeliruan, penyimpangan, atau tuntutan ganti rugi atas penggunaan dana tersebut, kami bersedia bertanggung jawab secara hukum dan mengembalikan kerugian negara ke kas daerah/negara.
          </li>
        </ol>

        <p className="pt-2">
          Demikian Surat Pernyataan Tanggung Jawab Mutlak (SPTJM) ini dibuat dengan kesadaran penuh dan tanpa ada paksaan dari pihak manapun.
        </p>
      </div>

      {/* Area Materai & Tanda Tangan */}
      <div className="mt-8 pt-4">
        <div className="flex justify-between items-start text-center">
          <div className="w-5/12">
            <p className="mb-1 text-gray-600 font-sans text-[11px]">Mengetahui,</p>
            <p className="font-bold uppercase">Bendahara BOSP Sekolah</p>
            <div className="h-20 flex items-center justify-center my-1">
              <span className="text-[10px] text-gray-400 italic print:hidden">[Tanda Tangan]</span>
            </div>
            <p className="font-bold underline uppercase text-xs">
              {schoolInfo.treasurer}
            </p>
            <p className="text-gray-700 font-sans text-[10px]">
              NIP. {schoolInfo.treasurerNip || "..........................."}
            </p>
          </div>

          <div className="w-5/12">
            <p className="mb-1 text-gray-600 font-sans text-[11px]">
              Kec. {schoolInfo.district}, 30 Juni 2026
            </p>
            <p className="font-bold uppercase">Kepala Sekolah</p>
            <div className="h-20 border border-dashed border-gray-400 my-1 flex items-center justify-center rounded text-[10px] text-gray-400 italic mx-auto w-32">
              [ Materai 10.000 &amp; Stempel ]
            </div>
            <p className="font-bold underline uppercase text-xs">
              {schoolInfo.headmaster}
            </p>
            <p className="text-gray-700 font-sans text-[10px]">
              NIP. {schoolInfo.headmasterNip || "..........................."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
