import React from "react";
import { SchoolInfo } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";
import { formatRupiah } from "../../utils/lpjCalculations";

interface DocBAPemeriksaanKasK7cProps {
  schoolInfo: SchoolInfo;
  totalCashBalance?: number;
}

export const DocBAPemeriksaanKasK7c: React.FC<DocBAPemeriksaanKasK7cProps> = ({
  schoolInfo,
  totalCashBalance = 28964000,
}) => {
  return (
    <div className="bg-white p-6 shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0 text-gray-900 text-xs leading-relaxed font-sans max-w-5xl mx-auto">
      <DocumentHeader
        schoolInfo={schoolInfo}
        docTitle="BERITA ACARA PEMERIKSAAN KAS (K7c)"
        docSubtitle={`PERIODE: SEMESTER I (TAHAP 1) TAHUN ANGGARAN ${schoolInfo.year}`}
        docCode="FORM K7c BOSP"
      />

      <div className="my-4 space-y-3 text-justify px-2 leading-relaxed">
        <p>
          Pada hari ini <strong>Selasa</strong> tanggal <strong>Tiga Puluh bulan Juni tahun Dua Ribu Dua Puluh Enam (30-06-2026)</strong>, kami yang bertanda tangan di bawah ini:
        </p>

        <div className="pl-6 space-y-1">
          <p><span className="w-32 inline-block font-semibold">1. Nama</span>: {schoolInfo.headmaster}</p>
          <p><span className="w-32 inline-block">   NIP / NIK</span>: {schoolInfo.headmasterNip || "-"}</p>
          <p><span className="w-32 inline-block">   Jabatan</span>: Kepala SMP Quran Al-Hamidy Pringsewu</p>
        </div>

        <p>Dengan disaksikan oleh Bendahara BOSP Sekolah:</p>

        <div className="pl-6 space-y-1">
          <p><span className="w-32 inline-block font-semibold">2. Nama</span>: {schoolInfo.treasurer}</p>
          <p><span className="w-32 inline-block">   NIP / NIK</span>: {schoolInfo.treasurerNip || "-"}</p>
          <p><span className="w-32 inline-block">   Jabatan</span>: Bendahara BOSP {schoolInfo.name}</p>
        </div>

        <p>
          Telah melakukan pemeriksaan fisik kas tempat penyimpanan uang BOSP (Brankas Sekolah) dan pencatatan BKU per tanggal 30 Juni 2026. Berdasarkan pemeriksaan tersebut, diperoleh hasil sebagai berikut:
        </p>

        <div className="bg-gray-50 border border-gray-400 p-4 rounded space-y-2 font-mono text-[11px] print:bg-transparent print:border-gray-800">
          <div className="flex justify-between border-b border-gray-300 pb-1">
            <span>A. Saldo Kas Menurut Buku Kas Umum (BKU)</span>
            <span className="font-bold">{formatRupiah(totalCashBalance)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-1">
            <span>B. Saldo Kas Nyata Hasil Opname Fisik Brankas</span>
            <span className="font-bold">{formatRupiah(totalCashBalance)}</span>
          </div>
          <div className="flex justify-between pl-4 text-gray-700">
            <span>- Kas Tunai Uang Kertas & Logam</span>
            <span>{formatRupiah(totalCashBalance)}</span>
          </div>
          <div className="flex justify-between pl-4 text-gray-700">
            <span>- Rekening Bank BOSP (Giro)</span>
            <span>Rp 0</span>
          </div>
          <div className="flex justify-between border-t-2 border-gray-800 pt-1 font-bold text-emerald-900 text-xs">
            <span>C. SELISIH KAS (A - B)</span>
            <span>Rp 0 (NIHIL / TEPAT)</span>
          </div>
        </div>

        <p>
          Penjelasan atas selisih kas: <strong>Tidak terdapat selisih kas (Saldo BKU sama persis dengan fisik uang nyata di brankas)</strong>. Uang tunai sebesar {formatRupiah(totalCashBalance)} tersimpan dengan aman di brankas kunci kombinasi sekolah.
        </p>

        <p>
          Demikian Berita Acara Pemeriksaan Kas ini dibuat untuk dipergunakan sebagaimana mestinya.
        </p>
      </div>

      <DocumentSignature schoolInfo={schoolInfo} dateStr="30 Juni 2026" showCommittee={true} />
    </div>
  );
};
