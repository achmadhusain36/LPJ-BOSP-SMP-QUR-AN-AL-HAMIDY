import React from "react";
import { SchoolInfo, FinancialSummary } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";
import { formatRupiah } from "../../utils/lpjCalculations";

interface DocNarasiLpjProps {
  schoolInfo: SchoolInfo;
  financialSummary: FinancialSummary;
}

export const DocNarasiLpj: React.FC<DocNarasiLpjProps> = ({ schoolInfo, financialSummary }) => {
  return (
    <div className="bg-white p-8 sm:p-10 shadow-sm border border-gray-200 min-h-[950px] font-serif text-xs text-gray-900 print:shadow-none print:border-none print:p-6 print:min-h-screen page-break-after-always">
      <DocumentHeader schoolInfo={schoolInfo} />

      <h2 className="text-center text-sm sm:text-base font-bold uppercase tracking-wider mb-6 border-b-2 border-gray-900 pb-1">
        RINGKASAN EKSEKUTIF & LAPORAN NARASI BOSP TAHAP 1 TAHUN {schoolInfo.year}
      </h2>

      {/* ITEM 3: PENDAHULUAN */}
      <section className="mb-6 space-y-2">
        <h3 className="font-bold text-sm uppercase text-emerald-950 border-l-4 border-emerald-800 pl-2">
          BAB I: PENDAHULUAN
        </h3>
        <p className="text-justify leading-relaxed indent-6">
          Laporan Pertanggungjawaban (LPJ) Dana Bantuan Operasional Satuan Pendidikan (BOSP) Reguler Tahap 1 Tahun Anggaran {schoolInfo.year} ini disusun oleh {schoolInfo.name} (NPSN {schoolInfo.npsn}) sebagai wujud transparansi, akuntabilitas, dan kepatuhan administratif dalam pengelolaan keuangan sekolah sesuai Permendikdasmen Nomor 8 Tahun 2026.
        </p>
        <p className="text-justify leading-relaxed indent-6">
          Maksud dan tujuan dari laporan ini adalah untuk memberikan gambaran secara menyeluruh mengenai penerimaan, alokasi, penggunaan, serta sisa kas dana BOSP Reguler selama periode Januari sampai dengan Juni {schoolInfo.year}. Ruang lingkup LPJ mencakup seluruh bukti transaksi kas umum, operasional pembelajaran, honorarium guru/tendik, serta belanja modal operasional.
        </p>
      </section>

      {/* ITEM 4: PELAKSANAAN */}
      <section className="mb-6 space-y-2">
        <h3 className="font-bold text-sm uppercase text-emerald-950 border-l-4 border-emerald-800 pl-2">
          BAB II: PELAKSANAAN DAN REALISASI BELANJA
        </h3>
        <p className="text-justify leading-relaxed indent-6">
          Pencairan dana BOSP Reguler Tahap 1 sebesar <strong>{formatRupiah(financialSummary.totalIncome || 80850000)}</strong> diterima melalui rekening bank pada tanggal 21 Januari 2026. Pelaksanaan kegiatan sekolah berpedoman pada RKAS Triwulan I dan Triwulan II yang telah disetujui.
        </p>

        <div className="my-3 font-sans">
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-[11px]">
                <th className="border border-gray-300 p-1.5 font-bold">Kategori Belanja</th>
                <th className="border border-gray-300 p-1.5 font-bold text-right">Realisasi (Rp)</th>
                <th className="border border-gray-300 p-1.5 font-bold text-right">Persentase (%)</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              <tr>
                <td className="border border-gray-300 p-1.5">Honorarium Guru &amp; Tendik</td>
                <td className="border border-gray-300 p-1.5 text-right font-mono">{formatRupiah(financialSummary.categoryExpenditure.honor)}</td>
                <td className="border border-gray-300 p-1.5 text-right font-mono">
                  {((financialSummary.categoryExpenditure.honor / financialSummary.totalIncome) * 100).toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-1.5">Belanja Barang &amp; Jasa (ATK, Listrik, Operasional)</td>
                <td className="border border-gray-300 p-1.5 text-right font-mono">{formatRupiah(financialSummary.categoryExpenditure.barangJasa)}</td>
                <td className="border border-gray-300 p-1.5 text-right font-mono">
                  {((financialSummary.categoryExpenditure.barangJasa / financialSummary.totalIncome) * 100).toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-1.5">Belanja Modal (Sumur Bor / Peralatan)</td>
                <td className="border border-gray-300 p-1.5 text-right font-mono">{formatRupiah(financialSummary.categoryExpenditure.modal)}</td>
                <td className="border border-gray-300 p-1.5 text-right font-mono">
                  {((financialSummary.categoryExpenditure.modal / financialSummary.totalIncome) * 100).toFixed(1)}%
                </td>
              </tr>
              <tr className="bg-gray-100 font-bold">
                <td className="border border-gray-300 p-1.5">Total Realisasi Belanja Tahap 1</td>
                <td className="border border-gray-300 p-1.5 text-right font-mono">{formatRupiah(financialSummary.totalExpenditure)}</td>
                <td className="border border-gray-300 p-1.5 text-right font-mono">
                  {((financialSummary.totalExpenditure / financialSummary.totalIncome) * 100).toFixed(1)}%
                </td>
              </tr>
              <tr className="bg-emerald-50 text-emerald-950 font-bold">
                <td className="border border-gray-300 p-1.5">Sisa Kas Tunai Per 30 Juni 2026</td>
                <td className="border border-gray-300 p-1.5 text-right font-mono" colSpan={2}>{formatRupiah(financialSummary.cashBalance)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ITEM 5: PERMASALAHAN DAN PENANGANAN */}
      <section className="mb-6 space-y-2">
        <h3 className="font-bold text-sm uppercase text-emerald-950 border-l-4 border-emerald-800 pl-2">
          BAB III: PERMASALAHAN DAN PENANGANAN
        </h3>
        <p className="text-justify leading-relaxed indent-6">
          1. <strong>Realisasi Pengadaan Buku Teks utama</strong>: Pada Tahap 1, alokasi belanja buku belum terserap karena menunggu revisi daftar katalog buku Kurikulum Merdeka dari Kemendikbudristek. Penanganannya adalah berkomitmen penuh merealisasikan minimal 10% alokasi dana buku pada pencairan Tahap 2.
        </p>
        <p className="text-justify leading-relaxed indent-6">
          2. <strong>Kebutuhan Infrastruktur Air Bersih</strong>: Adanya kebutuhan mendesak sarana air bersih diatasi dengan penyelesaian pekerjaan fisik sumur bor (Rp 15.000.000) yang telah masuk inventaris Aset KIB B sekolah.
        </p>
      </section>

      <div className="mt-8">
        <DocumentSignature schoolInfo={schoolInfo} dateStr="30 Juni 2026" showCommittee={true} />
      </div>
    </div>
  );
};
