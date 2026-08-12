import React from "react";
import { SchoolInfo, BkuTransaction } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";

interface DocDokumentasiFotoProps {
  schoolInfo: SchoolInfo;
  transactions: BkuTransaction[];
}

export const DocDokumentasiFoto: React.FC<DocDokumentasiFotoProps> = ({
  schoolInfo,
  transactions,
}) => {
  // Select items with non-honor spending (capital / goods)
  const items = transactions.filter((tx) => tx.expense > 0 && tx.category !== "honor").slice(0, 6);

  return (
    <div className="bg-white p-8 sm:p-10 shadow-sm border border-gray-200 min-h-[950px] font-sans text-xs text-gray-900 print:shadow-none print:border-none print:p-6 print:min-h-screen page-break-after-always">
      <DocumentHeader schoolInfo={schoolInfo} />

      <div className="text-center my-4">
        <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-gray-900">
          DOKUMENTASI PEMBELANJAAN DAN FISIK KEGIATAN BOSP
        </h2>
        <p className="text-xs font-semibold text-emerald-800 uppercase">
          URUT SESUAI BUKU KAS UMUM (BKU) TAHAP 1 TAHUN ANGGARAN {schoolInfo.year}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 my-6">
        {items.map((item, idx) => (
          <div key={item.id || idx} className="border border-gray-300 rounded-lg p-3 bg-gray-50 flex flex-col justify-between">
            <div>
              <div className="aspect-video bg-gray-200 border border-dashed border-gray-400 rounded flex flex-col items-center justify-center text-center p-2 text-gray-500">
                <span className="text-xl">📷</span>
                <span className="font-bold text-[10px] uppercase text-gray-700 mt-1">
                  [ Foto Fisik / Barang Terlampir ]
                </span>
                <span className="text-[9px] text-gray-400">Bukti BPU: {item.proofNo}</span>
              </div>
              <div className="mt-2 text-[10.5px]">
                <p className="font-bold text-gray-900 line-clamp-2">{item.description}</p>
                <p className="text-gray-500 text-[10px]">Tgl: {item.date} | Kode: {item.activityCode}</p>
              </div>
            </div>
            <div className="mt-2 pt-1 border-t border-gray-200 flex justify-between items-center text-[10px]">
              <span className="font-semibold text-emerald-800 font-mono">{item.proofNo}</span>
              <span className="font-bold text-gray-700">Keterangan: Diterima Baik</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center italic text-gray-500 text-[11px]">
        * Catatan: Seluruh dokumentasi fisik barang/jasa dan berita acara serah terima (BAST) telah diperiksa oleh Tim PPHP {schoolInfo.name}.
      </p>

      <div className="mt-8">
        <DocumentSignature schoolInfo={schoolInfo} dateStr="30 Juni 2026" showCommittee={true} />
      </div>
    </div>
  );
};
