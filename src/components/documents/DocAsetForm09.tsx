import React from "react";
import { SchoolInfo, AssetRow } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";
import { formatRupiah } from "../../utils/lpjCalculations";

interface DocAsetForm09Props {
  schoolInfo: SchoolInfo;
  assets: AssetRow[];
}

export const DocAsetForm09: React.FC<DocAsetForm09Props> = ({ schoolInfo, assets }) => {
  const totalAssetValue = assets.reduce((sum, ast) => sum + ast.totalPrice, 0);

  return (
    <div className="bg-white p-6 shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0 text-gray-900 text-xs leading-relaxed font-sans max-w-5xl mx-auto">
      <DocumentHeader
        schoolInfo={schoolInfo}
        docTitle="REKAPITULASI PEMBELIAN BARANG MILIK DAERAH (FORM 09 BMD)"
        docSubtitle={`LAPORAN PENGADAAN BARANG ASET BOSP TAHAP 1 TAHUN ${schoolInfo.year}`}
        docCode="FORM 09 BMD"
        isLandscape={true}
      />

      <div className="mb-3 text-[11px] bg-emerald-50/50 p-2.5 rounded border border-emerald-100 print:bg-transparent print:border-none">
        <p><span className="font-bold text-gray-800">Unit Kerja / Sekolah:</span> {schoolInfo.name} (NPSN: {schoolInfo.npsn})</p>
        <p><span className="font-bold text-gray-800">Kabupaten/Kota:</span> {schoolInfo.regency}, {schoolInfo.province}</p>
        <p><span className="font-bold text-gray-800">Periode LPJ BOSP:</span> {schoolInfo.period}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-800 text-[10px] print:text-[9px]">
          <thead>
            <tr className="bg-emerald-900 text-white font-bold text-center print:bg-gray-200 print:text-black">
              <th className="border border-gray-800 px-2 py-1.5 w-8">No</th>
              <th className="border border-gray-800 px-2 py-1.5 w-24">Kode Barang</th>
              <th className="border border-gray-800 px-2 py-1.5">Nama Barang Aset / Spesifikasi</th>
              <th className="border border-gray-800 px-2 py-1.5 w-24">Merk / Tipe / Ukuran</th>
              <th className="border border-gray-800 px-2 py-1.5 w-12">Vol</th>
              <th className="border border-gray-800 px-2 py-1.5 w-24">Harga Satuan (Rp)</th>
              <th className="border border-gray-800 px-2 py-1.5 w-28">Total Harga (Rp)</th>
              <th className="border border-gray-800 px-2 py-1.5 w-20">Tgl Beli</th>
              <th className="border border-gray-800 px-2 py-1.5 w-16">Kondisi</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((ast, idx) => (
              <tr key={ast.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 print:bg-white"}>
                <td className="border border-gray-800 px-2 py-1 text-center font-mono">{idx + 1}</td>
                <td className="border border-gray-800 px-2 py-1 text-center font-mono font-semibold">{ast.code}</td>
                <td className="border border-gray-800 px-2 py-1 text-left font-medium">{ast.name}</td>
                <td className="border border-gray-800 px-2 py-1 text-left text-[9px]">{ast.merkType}</td>
                <td className="border border-gray-800 px-2 py-1 text-center font-mono font-bold">{ast.quantity}</td>
                <td className="border border-gray-800 px-2 py-1 text-right font-mono">
                  {ast.unitPrice.toLocaleString("id-ID")}
                </td>
                <td className="border border-gray-800 px-2 py-1 text-right font-mono font-bold">
                  {ast.totalPrice.toLocaleString("id-ID")}
                </td>
                <td className="border border-gray-800 px-2 py-1 text-center font-mono text-[9px]">{ast.purchaseDate}</td>
                <td className="border border-gray-800 px-2 py-1 text-center font-bold text-emerald-900">{ast.condition}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-emerald-100 font-bold text-gray-900 print:bg-gray-200">
              <td colSpan={6} className="border border-gray-800 px-3 py-2 text-right uppercase">
                JUMLAH TOTAL PEROLEHAN ASET TAHAP 1 2026:
              </td>
              <td className="border border-gray-800 px-2 py-2 text-right font-mono text-sm text-emerald-900 print:text-black">
                {totalAssetValue.toLocaleString("id-ID")}
              </td>
              <td colSpan={2} className="border border-gray-800 px-2 py-2 text-center text-[9px]">
                {assets.length} Item Aset Terdaftar
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-[11px] print:bg-transparent print:border-none print:p-0">
        <p className="font-bold text-emerald-900 mb-1">Catatan Inventarisasi Barang Milik Daerah (BMD):</p>
        <p>1. Barang aset hasil belanja modal/pengadaan BOSP BERSATU telah dicatat dalam Buku Inventaris Barang Sekolah KIB B (Peralatan & Mesin).</p>
        <p>2. Aset fisik berupa <strong>Pendalaman Sumur Bor Sekolah ({formatRupiah(15000000)})</strong> sudah berfungsi 100% melayani kebutuhan sanitasi air bersih seluruh siswa dan dewan guru.</p>
      </div>

      <DocumentSignature schoolInfo={schoolInfo} dateStr="30 Juni 2026" />
    </div>
  );
};
