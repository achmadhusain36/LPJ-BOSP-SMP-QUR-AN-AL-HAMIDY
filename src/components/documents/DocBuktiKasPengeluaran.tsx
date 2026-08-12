import React from "react";
import { SchoolInfo, BkuTransaction } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";
import { formatRupiah } from "../../utils/lpjCalculations";
import {
  getMonthlyHonorDetail,
  APRIL_INCIDENTAL_HONOR,
} from "../../data/honorData";

interface DocBuktiKasPengeluaranProps {
  schoolInfo: SchoolInfo;
  transactions: BkuTransaction[];
}

export const DocBuktiKasPengeluaran: React.FC<DocBuktiKasPengeluaranProps> = ({
  schoolInfo,
  transactions,
}) => {
  // Filter only expenditure transactions (expense > 0)
  const expenseTransactions = transactions.filter((tx) => tx.expense > 0);

  return (
    <div className="space-y-10 font-sans text-xs text-gray-900">
      {expenseTransactions.map((tx, idx) => {
        const isHonorTx =
          tx.category === "honor" ||
          tx.accountCode.startsWith("5.1.02.02") ||
          tx.description.toLowerCase().includes("honor");

        if (!isHonorTx) {
          // Standard Non-Honor SBP (BPU C5)
          return (
            <div
              key={tx.id || idx}
              className="bg-white p-6 sm:p-8 border border-gray-300 rounded-lg shadow-xs print:border-gray-800 print:shadow-none page-break-after-always"
            >
              <DocumentHeader schoolInfo={schoolInfo} />

              <div className="border-b-2 border-gray-800 pb-2 mb-4 flex justify-between items-center mt-2">
                <div>
                  <h2 className="font-bold text-sm uppercase tracking-wide text-gray-900">
                    SURAT BUKTI PENGELUARAN KAS (BPU)
                  </h2>
                  <p className="text-[10px] text-gray-500">
                    Format C5 - Pertanggungjawaban Belanja BOSP
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-900 font-mono font-bold text-xs border border-gray-400 rounded">
                    No Bukti: {tx.proofNo}
                  </span>
                </div>
              </div>

              <table className="w-full text-left border-collapse border border-gray-300 text-[11px] mb-4">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2 font-semibold w-40 bg-gray-50">
                      Sudah Diterima Dari
                    </td>
                    <td className="border border-gray-300 p-2">
                      Bendahara BOSP {schoolInfo.name}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-semibold bg-gray-50">
                      Jumlah Uang (Rp)
                    </td>
                    <td className="border border-gray-300 p-2 font-mono font-bold text-sm text-emerald-900">
                      {formatRupiah(tx.expense)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-semibold bg-gray-50">
                      Untuk Pembayaran / Uraian
                    </td>
                    <td className="border border-gray-300 p-2 font-medium">
                      {tx.description}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-semibold bg-gray-50">
                      Kode Program / Rekening
                    </td>
                    <td className="border border-gray-300 p-2 font-mono">
                      {tx.activityCode} / {tx.accountCode}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-semibold bg-gray-50">
                      Tanggal Transaksi
                    </td>
                    <td className="border border-gray-300 p-2">{tx.date}</td>
                  </tr>
                </tbody>
              </table>

              {/* Area Tanda Tangan Kwitansi */}
              <div className="grid grid-cols-3 gap-4 text-center mt-6 pt-2 font-serif text-[11px]">
                <div>
                  <p className="font-bold uppercase text-[10px]">Setuju Dibayar:</p>
                  <p className="font-bold uppercase text-[10.5px]">Kepala Sekolah</p>
                  <div className="h-16 flex items-end justify-center">
                    <span className="text-[9px] text-gray-400 italic print:hidden">
                      [ TTD ]
                    </span>
                  </div>
                  <p className="font-bold underline text-[11px]">
                    {schoolInfo.headmaster}
                  </p>
                  <p className="text-[9px] text-gray-500 font-sans">
                    NIP. {schoolInfo.headmasterNip || "-"}
                  </p>
                </div>

                <div>
                  <p className="font-bold uppercase text-[10px]">Lunas Dibayar:</p>
                  <p className="font-bold uppercase text-[10.5px]">Bendahara BOSP</p>
                  <div className="h-16 flex items-end justify-center">
                    <span className="text-[9px] text-gray-400 italic print:hidden">
                      [ TTD ]
                    </span>
                  </div>
                  <p className="font-bold underline text-[11px]">
                    {schoolInfo.treasurer}
                  </p>
                  <p className="text-[9px] text-gray-500 font-sans">
                    NIP. {schoolInfo.treasurerNip || "-"}
                  </p>
                </div>

                <div>
                  <p className="font-bold uppercase text-[10px]">
                    Penerima Uang / Penyedia:
                  </p>
                  <p className="font-bold uppercase text-[10.5px]">
                    Penerima / Rekanan
                  </p>
                  <div className="h-16 flex items-end justify-center">
                    <span className="text-[9px] text-gray-400 italic print:hidden">
                      [ TTD &amp; Stempel Toko ]
                    </span>
                  </div>
                  <p className="font-bold underline text-[11px]">
                    (.........................................)
                  </p>
                </div>
              </div>
            </div>
          );
        }

        // HONOR TRANSACTIONS (Feb, Mar, Apr, Mei, Jun)
        const isApril = tx.month === "April";
        const monthlyHonor = getMonthlyHonorDetail(tx.month, tx.proofNo, tx.date);

        return (
          <React.Fragment key={tx.id || idx}>
            {/* 1. SBP INDUK HONOR BULANAN */}
            <div className="bg-white p-6 sm:p-8 border border-gray-300 rounded-lg shadow-xs print:border-gray-800 print:shadow-none page-break-after-always">
              <DocumentHeader schoolInfo={schoolInfo} />

              <div className="border-b-2 border-gray-800 pb-2 mb-4 flex justify-between items-center mt-2">
                <div>
                  <h2 className="font-bold text-sm uppercase tracking-wide text-gray-900">
                    SURAT BUKTI PENGELUARAN (SBP) – INDUK HONORARIUM
                  </h2>
                  <p className="text-[10px] text-gray-500">
                    Kategori: Belanja Jasa (Kode Rekening 5.1.02.02) – Honorarium Non-ASN
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-950 font-mono font-bold text-xs border border-emerald-300 rounded">
                    No SBP: {tx.proofNo}
                  </span>
                </div>
              </div>

              <table className="w-full text-left border-collapse border border-gray-300 text-[11px] mb-4">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2 font-semibold w-44 bg-gray-50">
                      Sudah Diterima Dari
                    </td>
                    <td className="border border-gray-300 p-2 font-medium">
                      Bendahara BOSP {schoolInfo.name}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-semibold bg-gray-50">
                      Uraian Pembayaran
                    </td>
                    <td className="border border-gray-300 p-2 font-semibold text-gray-900">
                      Pembayaran Honorarium Guru &amp; Tenaga Kependidikan Non-ASN {monthlyHonor.periodLabel}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-semibold bg-gray-50">
                      Kode Program / Rekening
                    </td>
                    <td className="border border-gray-300 p-2 font-mono">
                      {tx.activityCode} / 5.1.02.02.01 (Belanja Jasa Honorarium Non-ASN)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-semibold bg-gray-50">
                      Jumlah Kotor (Gross)
                    </td>
                    <td className="border border-gray-300 p-2 font-mono font-bold text-sm text-emerald-900">
                      {formatRupiah(monthlyHonor.totalGross)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-semibold bg-gray-50">
                      Potongan Pajak (PPh 21)
                    </td>
                    <td className="border border-gray-300 p-2 font-mono font-bold text-gray-700">
                      NIHIL (Rp 0)
                      <span className="text-[10px] font-sans font-normal text-gray-500 ml-2">
                        *(Honor rutin bulanan Non-ASN di bawah PTKP / Sesuai Juknis BOSP)
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-semibold bg-emerald-50">
                      Jumlah Dibayar (Netto)
                    </td>
                    <td className="border border-gray-300 p-2 font-mono font-bold text-base text-emerald-950 bg-emerald-50">
                      {formatRupiah(monthlyHonor.totalNet)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-semibold bg-gray-50">
                      Bukti Pendukung
                    </td>
                    <td className="border border-gray-300 p-2 italic text-gray-700">
                      Terlampir: Daftar Penerimaan Honorarium Per Individu ({monthlyHonor.recipients.length} Orang Penerima Sah)
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="grid grid-cols-2 gap-4 text-center mt-8 pt-2 font-serif text-[11px]">
                <div>
                  <p className="font-bold uppercase text-[10px]">Setuju Dibayar:</p>
                  <p className="font-bold uppercase text-[10.5px]">Kepala Sekolah</p>
                  <div className="h-16 flex items-end justify-center">
                    <span className="text-[9px] text-gray-400 italic print:hidden">
                      [ TTD &amp; Stempel ]
                    </span>
                  </div>
                  <p className="font-bold underline text-[11px]">
                    {schoolInfo.headmaster}
                  </p>
                  <p className="text-[9px] text-gray-500 font-sans">
                    NIP. {schoolInfo.headmasterNip || "-"}
                  </p>
                </div>

                <div>
                  <p className="font-bold uppercase text-[10px]">
                    Lunas Dibayar Tgl: {tx.date}
                  </p>
                  <p className="font-bold uppercase text-[10.5px]">Bendahara BOSP</p>
                  <div className="h-16 flex items-end justify-center">
                    <span className="text-[9px] text-gray-400 italic print:hidden">
                      [ TTD ]
                    </span>
                  </div>
                  <p className="font-bold underline text-[11px]">
                    {schoolInfo.treasurer}
                  </p>
                  <p className="text-[9px] text-gray-500 font-sans">
                    NIP. {schoolInfo.treasurerNip || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. LAMPIRAN WAJIB: DAFTAR PENERIMAAN HONOR PER INDIVIDU (BULANAN) */}
            <div className="bg-white p-6 sm:p-8 border border-gray-300 rounded-lg shadow-xs print:border-gray-800 print:shadow-none page-break-after-always">
              <DocumentHeader schoolInfo={schoolInfo} />

              <div className="text-center my-3">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  LAMPIRAN SBP NO: {tx.proofNo}
                </p>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-900">
                  DAFTAR PENERIMAAN HONORARIUM GURU &amp; TENAGA KEPENDIDIKAN (NON-ASN)
                </h3>
                <p className="text-xs font-semibold text-emerald-800 uppercase">
                  {monthlyHonor.periodLabel.toUpperCase()} – {schoolInfo.name}
                </p>
              </div>

              <div className="overflow-x-auto my-3">
                <table className="w-full text-left border-collapse border border-gray-400 text-[10.5px]">
                  <thead>
                    <tr className="bg-gray-100 text-center font-bold">
                      <th className="border border-gray-400 p-1.5 w-8">No</th>
                      <th className="border border-gray-400 p-1.5">Nama Penerima</th>
                      <th className="border border-gray-400 p-1.5 w-32">Peran / Jabatan</th>
                      <th className="border border-gray-400 p-1.5 w-24">Jumlah Kotor (Rp)</th>
                      <th className="border border-gray-400 p-1.5 w-20">Pot. Pajak</th>
                      <th className="border border-gray-400 p-1.5 w-24">Jumlah Bersih (Rp)</th>
                      <th className="border border-gray-400 p-1.5 w-28">Tanda Tangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyHonor.recipients.map((r) => (
                      <tr key={r.no} className={r.no % 2 === 0 ? "bg-white" : "bg-gray-50/70"}>
                        <td className="border border-gray-300 p-1.5 text-center font-semibold">
                          {r.no}
                        </td>
                        <td className="border border-gray-300 p-1.5 font-bold">
                          {r.name}
                        </td>
                        <td className="border border-gray-300 p-1.5 text-gray-700">
                          {r.role}
                        </td>
                        <td className="border border-gray-300 p-1.5 text-right font-mono">
                          {formatRupiah(r.grossAmount)}
                        </td>
                        <td className="border border-gray-300 p-1.5 text-center font-mono text-gray-400">
                          -
                        </td>
                        <td className="border border-gray-300 p-1.5 text-right font-mono font-bold text-emerald-900">
                          {formatRupiah(r.netAmount)}
                        </td>
                        <td className="border border-gray-300 p-1.5 text-left font-serif text-[9px] text-gray-400">
                          {r.no}. ....................
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-emerald-100 font-bold text-emerald-950">
                      <td className="border border-gray-400 p-2 text-center" colSpan={3}>
                        TOTAL PENERIMAAN HONOR {monthlyHonor.periodLabel.toUpperCase()}
                      </td>
                      <td className="border border-gray-400 p-2 text-right font-mono">
                        {formatRupiah(monthlyHonor.totalGross)}
                      </td>
                      <td className="border border-gray-400 p-2 text-center font-mono">
                        Rp 0
                      </td>
                      <td className="border border-gray-400 p-2 text-right font-mono">
                        {formatRupiah(monthlyHonor.totalNet)}
                      </td>
                      <td className="border border-gray-400 p-2 text-center">
                        SAH
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <DocumentSignature
                  schoolInfo={schoolInfo}
                  dateStr={tx.date}
                  showCommittee={true}
                />
              </div>
            </div>

            {/* 3. KHUSUS APRIL: SBP & LAMPIRAN HONOR INSIDENTIL (NARASUMBER / MODERATOR) */}
            {isApril && (
              <React.Fragment>
                {/* SBP INDUK HONOR INSIDENTIL */}
                <div className="bg-white p-6 sm:p-8 border border-gray-300 rounded-lg shadow-xs print:border-gray-800 print:shadow-none page-break-after-always">
                  <DocumentHeader schoolInfo={schoolInfo} />

                  <div className="border-b-2 border-gray-800 pb-2 mb-4 flex justify-between items-center mt-2">
                    <div>
                      <h2 className="font-bold text-sm uppercase tracking-wide text-gray-900">
                        SURAT BUKTI PENGELUARAN (SBP) – HONORARIUM INSIDENTIL
                      </h2>
                      <p className="text-[10px] text-gray-500">
                        Honorarium Narasumber / Moderator / Penceramah Kegiatan Khusus
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-amber-50 text-amber-950 font-mono font-bold text-xs border border-amber-300 rounded">
                        No SBP: {APRIL_INCIDENTAL_HONOR.proofNo}
                      </span>
                    </div>
                  </div>

                  <table className="w-full text-left border-collapse border border-gray-300 text-[11px] mb-4">
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2 font-semibold w-44 bg-gray-50">
                          Sudah Diterima Dari
                        </td>
                        <td className="border border-gray-300 p-2 font-medium">
                          Bendahara BOSP {schoolInfo.name}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2 font-semibold bg-gray-50">
                          Uraian Pembayaran
                        </td>
                        <td className="border border-gray-300 p-2 font-semibold text-gray-900">
                          {APRIL_INCIDENTAL_HONOR.description}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2 font-semibold bg-gray-50">
                          Nama Penerima
                        </td>
                        <td className="border border-gray-300 p-2 font-bold text-gray-900">
                          {APRIL_INCIDENTAL_HONOR.recipientName} ({APRIL_INCIDENTAL_HONOR.role})
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2 font-semibold bg-gray-50">
                          Jumlah Kotor (Gross)
                        </td>
                        <td className="border border-gray-300 p-2 font-mono font-bold text-sm text-gray-900">
                          {formatRupiah(APRIL_INCIDENTAL_HONOR.grossAmount)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2 font-semibold bg-amber-50">
                          Potongan PPh Pasal 21 ({APRIL_INCIDENTAL_HONOR.taxRatePct}%)
                        </td>
                        <td className="border border-gray-300 p-2 font-mono font-bold text-amber-900 bg-amber-50">
                          {formatRupiah(APRIL_INCIDENTAL_HONOR.taxAmount)}
                          <span className="text-[10px] font-sans font-normal text-gray-600 ml-2">
                            *(Dikenakan PPh 21 karena kegiatan insidentil ≥ Rp 1.000.000)
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2 font-semibold bg-emerald-50">
                          Jumlah Dibayar (Netto)
                        </td>
                        <td className="border border-gray-300 p-2 font-mono font-bold text-base text-emerald-950 bg-emerald-50">
                          {formatRupiah(APRIL_INCIDENTAL_HONOR.netAmount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="grid grid-cols-3 gap-4 text-center mt-8 pt-2 font-serif text-[11px]">
                    <div>
                      <p className="font-bold uppercase text-[10px]">Setuju Dibayar:</p>
                      <p className="font-bold uppercase text-[10.5px]">Kepala Sekolah</p>
                      <div className="h-16 flex items-end justify-center">
                        <span className="text-[9px] text-gray-400 italic print:hidden">
                          [ TTD &amp; Stempel ]
                        </span>
                      </div>
                      <p className="font-bold underline text-[11px]">
                        {schoolInfo.headmaster}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold uppercase text-[10px]">Lunas Dibayar:</p>
                      <p className="font-bold uppercase text-[10.5px]">Bendahara BOSP</p>
                      <div className="h-16 flex items-end justify-center">
                        <span className="text-[9px] text-gray-400 italic print:hidden">
                          [ TTD ]
                        </span>
                      </div>
                      <p className="font-bold underline text-[11px]">
                        {schoolInfo.treasurer}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold uppercase text-[10px]">Penerima Honor:</p>
                      <p className="font-bold uppercase text-[10.5px]">Narasumber</p>
                      <div className="h-16 flex items-end justify-center">
                        <span className="text-[9px] text-gray-400 italic print:hidden">
                          [ TTD ]
                        </span>
                      </div>
                      <p className="font-bold underline text-[11px]">
                        {APRIL_INCIDENTAL_HONOR.recipientName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* LAMPIRAN BUKTI SETOR PAJAK (SSP) PPH 21 INSIDENTIL */}
                <div className="bg-white p-6 sm:p-8 border border-gray-300 rounded-lg shadow-xs print:border-gray-800 print:shadow-none page-break-after-always">
                  <DocumentHeader schoolInfo={schoolInfo} />

                  <div className="text-center my-3">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      LAMPIRAN SBP NO: {APRIL_INCIDENTAL_HONOR.proofNo}
                    </p>
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-900">
                      SURAT SETORAN PAJAK (SSP) &amp; BUKTI TANDA TERIMA PPH PASAL 21
                    </h3>
                    <p className="text-xs font-semibold text-emerald-800 uppercase">
                      PEMOTONGAN PAJAK PAJAK ATAS HONORARIUM NARASUMBER APRILL 2026
                    </p>
                  </div>

                  <div className="border border-gray-300 rounded p-4 my-4 space-y-3 text-[11px]">
                    <div className="grid grid-cols-2 gap-2 border-b border-gray-200 pb-2 font-mono">
                      <div>
                        <span className="text-gray-500 block text-[10px]">NPWP Pemotong / Sekolah:</span>
                        <span className="font-bold text-gray-900">00.321.456.7-321.000</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">Nama Wajib Pajak:</span>
                        <span className="font-bold text-gray-900">{schoolInfo.name}</span>
                      </div>
                    </div>

                    <table className="w-full text-left border-collapse border border-gray-300 text-[11px]">
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-2 font-semibold bg-gray-50 w-44">
                            Kode Akun Pajak (KAP)
                          </td>
                          <td className="border border-gray-300 p-2 font-mono font-bold">
                            411121 (PPh Pasal 21)
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-2 font-semibold bg-gray-50">
                            Kode Jenis Setoran (KJS)
                          </td>
                          <td className="border border-gray-300 p-2 font-mono">
                            100 (Masa PPh Pasal 21)
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-2 font-semibold bg-gray-50">
                            Uraian Pajak
                          </td>
                          <td className="border border-gray-300 p-2 font-medium">
                            Setoran PPh Pasal 21 atas Honorarium Narasumber Kegiatan Pesantren Kilat Ramadhan
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-2 font-semibold bg-gray-50">
                            Dasar Pengenaan Pajak (DPP)
                          </td>
                          <td className="border border-gray-300 p-2 font-mono">
                            {formatRupiah(APRIL_INCIDENTAL_HONOR.grossAmount)}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-2 font-semibold bg-amber-50">
                            Jumlah Pajak Disetor (5%)
                          </td>
                          <td className="border border-gray-300 p-2 font-mono font-bold text-amber-900 bg-amber-50">
                            {formatRupiah(APRIL_INCIDENTAL_HONOR.taxAmount)}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-2 font-semibold bg-gray-50">
                            Nomor Transaksi Penerimaan Negara (NTPN)
                          </td>
                          <td className="border border-gray-300 p-2 font-mono font-bold text-emerald-800">
                            8192019281203912 (TERSETOR KAS NEGARA VIA BANK LAMPUNG)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8">
                    <DocumentSignature
                      schoolInfo={schoolInfo}
                      dateStr="06 April 2026"
                      showCommittee={false}
                    />
                  </div>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
