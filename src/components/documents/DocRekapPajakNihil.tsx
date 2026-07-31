import React from "react";
import { SchoolInfo } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";

interface DocRekapPajakNihilProps {
  schoolInfo: SchoolInfo;
}

export const DocRekapPajakNihil: React.FC<DocRekapPajakNihilProps> = ({ schoolInfo }) => {
  return (
    <div className="bg-white p-6 shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0 text-gray-900 text-xs leading-relaxed font-sans max-w-5xl mx-auto">
      <DocumentHeader
        schoolInfo={schoolInfo}
        docTitle="SURAT PERNYATAAN / REKAPITULASI NIHIL PERPAJAKAN"
        docSubtitle={`PERIODE LPJ: JANUARI S.D. JUNI 2026 (TAHAP 1 TAHUN ${schoolInfo.year})`}
        docCode="REKAP PAJAK BOSP"
      />

      <div className="my-6 space-y-4 text-justify px-2">
        <p>Yang bertanda tangan di bawah ini:</p>

        <div className="pl-6 space-y-1">
          <p><span className="w-36 inline-block font-semibold">Nama Bendahara</span>: {schoolInfo.treasurer}</p>
          <p><span className="w-36 inline-block font-semibold">NIP / NIK</span>: {schoolInfo.treasurerNip || "-"}</p>
          <p><span className="w-36 inline-block font-semibold">Jabatan</span>: Bendahara BOSP {schoolInfo.name}</p>
          <p><span className="w-36 inline-block font-semibold">Nama Sekolah</span>: {schoolInfo.name}</p>
          <p><span className="w-36 inline-block font-semibold">NPSN</span>: {schoolInfo.npsn}</p>
          <p><span className="w-36 inline-block font-semibold">Alamat Sekolah</span>: {schoolInfo.address}, {schoolInfo.district}, {schoolInfo.regency}</p>
        </div>

        <p>
          Dengan ini menyatakan dengan sebenarnya bahwa dalam pelaksanaan realisasi Anggaran Dana Bantuan Operasional Satuan Pendidikan (BOSP) Reguler Tahap 1 Tahun Anggaran 2026 sebesar <strong>Rp 51.886.000,- (Lima Puluh Satu Juta Delapan Ratus Delapan Puluh Enam Ribu Rupiah)</strong>, seluruh kewajiban pemotongan dan penyetoran pajak bendahara berstatus <strong>NIHIL (Rp 0)</strong>.
        </p>

        <div className="bg-gray-50 p-4 border border-gray-300 rounded print:bg-transparent print:border-gray-800">
          <p className="font-bold mb-2 uppercase text-center border-b border-gray-400 pb-1">
            RINCIAN REKAPITULASI PERPAJAKAN JANUARI - JUNI 2026
          </p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-400 text-left font-bold">
                <th className="py-1">Jenis Pajak</th>
                <th className="py-1 text-center">Dasar Pengenaan Pajak (DPP)</th>
                <th className="py-1 text-right">Potongan (Rp)</th>
                <th className="py-1 text-right">Setoran (Rp)</th>
                <th className="py-1 text-center">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-1.5 font-semibold">PPN (Pajak Pertambahan Nilai)</td>
                <td className="py-1.5 text-center font-mono">Rp 7.716.000</td>
                <td className="py-1.5 text-right font-mono">0</td>
                <td className="py-1.5 text-right font-mono">0</td>
                <td className="py-1.5 text-center text-[10px]">Nilai transaksi di bawah batas PPN/e-Pur</td>
              </tr>
              <tr>
                <td className="py-1.5 font-semibold">PPh Pasal 21 (Honorarium PTK)</td>
                <td className="py-1.5 text-center font-mono">Rp 29.170.000</td>
                <td className="py-1.5 text-right font-mono">0</td>
                <td className="py-1.5 text-right font-mono">0</td>
                <td className="py-1.5 text-center text-[10px]">Penerima Non-ASN di bawah PTKP</td>
              </tr>
              <tr>
                <td className="py-1.5 font-semibold">PPh Pasal 22 (Pengadaan Barang)</td>
                <td className="py-1.5 text-center font-mono">Rp 7.716.000</td>
                <td className="py-1.5 text-right font-mono">0</td>
                <td className="py-1.5 text-right font-mono">0</td>
                <td className="py-1.5 text-center text-[10px]">Pembelian barang &lt; Rp 2.000.000</td>
              </tr>
              <tr>
                <td className="py-1.5 font-semibold">PPh Pasal 23 (Jasa Sumur Bor)</td>
                <td className="py-1.5 text-center font-mono">Rp 15.000.000</td>
                <td className="py-1.5 text-right font-mono">0</td>
                <td className="py-1.5 text-right font-mono">0</td>
                <td className="py-1.5 text-center text-[10px]">Penyedia UMKM Bebas Pajak / Modal KIB B</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-800 font-bold">
                <td className="py-2" colSpan={2}>JUMLAH TOTAL PAJAK:</td>
                <td className="py-2 text-right font-mono text-emerald-900">0</td>
                <td className="py-2 text-right font-mono text-emerald-900">0</td>
                <td className="py-2 text-center uppercase font-mono text-emerald-900">NIHIL</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p>
          Demikian Surat Pernyataan ini kami buat dengan sebenarnya dan penuh rasa tanggung jawab. Apabila dikemudian hari berdasarkan pemeriksaan Tim Audit/Inspektorat ditemukan kekeliruan, kami bersedia bertanggung jawab sesuai dengan peraturan perundang-undangan yang berlaku.
        </p>
      </div>

      <DocumentSignature schoolInfo={schoolInfo} dateStr="30 Juni 2026" />
    </div>
  );
};
