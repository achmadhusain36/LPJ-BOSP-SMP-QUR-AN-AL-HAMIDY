import React from "react";
import { SchoolInfo } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";

interface DocSkTimProps {
  schoolInfo: SchoolInfo;
}

export const DocSkTim: React.FC<DocSkTimProps> = ({ schoolInfo }) => {
  return (
    <div className="bg-white p-8 sm:p-10 shadow-sm border border-gray-200 min-h-[950px] font-serif text-xs text-gray-900 print:shadow-none print:border-none print:p-6 print:min-h-screen page-break-after-always">
      <DocumentHeader schoolInfo={schoolInfo} />

      <div className="text-center my-4 space-y-1">
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
          SURAT KEPUTUSAN KEPALA {schoolInfo.name.toUpperCase()}
        </h2>
        <p className="font-semibold text-xs">NOMOR: 800/012/SMP.QA/SK/2026</p>
        <p className="font-bold uppercase text-xs pt-1">
          TENTANG TIM MANAJEMEN BOSP, TIM PENGADAAN BARANG/JASA, DAN TIM PANITIA PENERIMA HASIL PEKERJAAN (PPHP) TAHUN ANGGARAN {schoolInfo.year}
        </p>
      </div>

      <div className="space-y-3 text-justify leading-relaxed mt-4">
        <div>
          <strong className="block font-bold">MENIMBANG:</strong>
          <p className="indent-6">
            a. Bahwa untuk kelancaran pengelolaan dan pertanggungjawaban Dana Bantuan Operasional Satuan Pendidikan (BOSP) Reguler Tahun Anggaran {schoolInfo.year}, dipandang perlu membentuk Tim Manajemen BOSP, Tim Pengadaan, dan Panitia Penerima Hasil Pekerjaan (PPHP).
          </p>
          <p className="indent-6">
            b. Bahwa nama-nama yang tercantum dalam lampiran keputusan ini dianggap mampu dan memenuhi syarat untuk melaksanakan tugas dimaksud.
          </p>
        </div>

        <div>
          <strong className="block font-bold">MEMUTUSKAN / MEMETAPKAN:</strong>
          <p className="indent-6">
            <strong>PERTAMA:</strong> Membentuk Tim Manajemen BOSP, Pengadaan Barang/Jasa, dan PPHP {schoolInfo.name} Tahun Anggaran {schoolInfo.year}.
          </p>
        </div>

        {/* Tabel Susunan Tim */}
        <div className="my-4 font-sans">
          <table className="w-full text-left border-collapse border border-gray-400 text-[11px]">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border border-gray-400 p-1.5 w-8">No</th>
                <th className="border border-gray-400 p-1.5">Nama / NIP</th>
                <th className="border border-gray-400 p-1.5">Jabatan Pokok</th>
                <th className="border border-gray-400 p-1.5">Jabatan dalam Tim BOSP</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-1.5 text-center">1</td>
                <td className="border border-gray-300 p-1.5 font-bold">{schoolInfo.headmaster}</td>
                <td className="border border-gray-300 p-1.5">Kepala Sekolah</td>
                <td className="border border-gray-300 p-1.5 font-semibold text-emerald-900">Penanggung Jawab Tim BOSP</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-1.5 text-center">2</td>
                <td className="border border-gray-300 p-1.5 font-bold">{schoolInfo.treasurer}</td>
                <td className="border border-gray-300 p-1.5">Bendahara Sekolah</td>
                <td className="border border-gray-300 p-1.5 font-semibold text-emerald-900">Bendahara &amp; Pelaksana Pengadaan</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-1.5 text-center">3</td>
                <td className="border border-gray-300 p-1.5 font-bold">{schoolInfo.committeeName || "SYEKH AL-NGARIFIN, M.PD."}</td>
                <td className="border border-gray-300 p-1.5">Ketua Komite Sekolah</td>
                <td className="border border-gray-300 p-1.5 font-semibold text-emerald-900">Unsur Pengawas / Unsur Komite</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-1.5 text-center">4</td>
                <td className="border border-gray-300 p-1.5 font-bold">Ahmad Fauzi, S.Pd.</td>
                <td className="border border-gray-300 p-1.5">Guru / Tendik</td>
                <td className="border border-gray-300 p-1.5 font-semibold text-emerald-900">Ketua Tim PPHP (Penerima Hasil Barang)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="indent-6">
          <strong>KEDUA:</strong> Segala biaya yang timbul akibat diterbitkannya Keputusan ini dibebankan pada Dana BOSP Reguler {schoolInfo.name} Tahun Anggaran {schoolInfo.year}.
        </p>
      </div>

      <div className="mt-8">
        <DocumentSignature schoolInfo={schoolInfo} dateStr="02 Januari 2026" showCommittee={true} />
      </div>
    </div>
  );
};
