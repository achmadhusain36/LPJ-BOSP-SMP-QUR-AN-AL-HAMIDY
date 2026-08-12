import React from "react";
import {
  SchoolInfo,
  BkuTransaction,
  RkasProgramItem,
  FinancialSummary,
  Form3Row,
  AssetRow,
  CashDenomination,
  ChecklistItem,
} from "../../types/lpj";
import { DocCover } from "./DocCover";
import { DocSuratPengantar } from "./DocSuratPengantar";
import { DocNarasiLpj } from "./DocNarasiLpj";
import { DocSptjm } from "./DocSptjm";
import { DocRkasTriwulan } from "./DocRkasTriwulan";
import { DocBkuK3 } from "./DocBkuK3";
import { DocBankK5 } from "./DocBankK5";
import { DocPajakK6 } from "./DocPajakK6";
import { DocRealisasiK7a } from "./DocRealisasiK7a";
import { DocRekeningKoran } from "./DocRekeningKoran";
import { DocPenutupanKasK7b } from "./DocPenutupanKasK7b";
import { DocBAPemeriksaanKasK7c } from "./DocBAPemeriksaanKasK7c";
import { DocSkTim } from "./DocSkTim";
import { DocBuktiKasPengeluaran } from "./DocBuktiKasPengeluaran";
import { DocDaftarHonor } from "./DocDaftarHonor";
import { DocDokumentasiFoto } from "./DocDokumentasiFoto";
import { DocAsetForm09 } from "./DocAsetForm09";
import { DocForm3Rekon } from "./DocForm3Rekon";
import { DocChecklist28 } from "./DocChecklist28";
import { DocRekapPajakNihil } from "./DocRekapPajakNihil";

interface DocFullBundleProps {
  schoolInfo: SchoolInfo;
  transactions: BkuTransaction[];
  rkasItems: RkasProgramItem[];
  financialSummary: FinancialSummary;
  form3Rows: Form3Row[];
  assets: AssetRow[];
  denominations: CashDenomination[];
  checklistItems: ChecklistItem[];
}

export const DocFullBundle: React.FC<DocFullBundleProps> = (props) => {
  const { schoolInfo, transactions, rkasItems, financialSummary, form3Rows, assets, denominations, checklistItems } = props;

  return (
    <div className="space-y-12 print:space-y-0">
      {/* 1. COVER / SAMPUL LPJ */}
      <div className="page-break-after-always">
        <DocCover schoolInfo={schoolInfo} />
      </div>

      {/* 2. SURAT PENGANTAR (TIM BOSP PRINGSEWU) */}
      <div className="page-break-after-always">
        <DocSuratPengantar schoolInfo={schoolInfo} />
      </div>

      {/* 3, 4, 5. PENDAHULUAN, PELAKSANAAN, PERMASALAHAN DAN PENANGANAN */}
      <div className="page-break-after-always">
        <DocNarasiLpj schoolInfo={schoolInfo} financialSummary={financialSummary} />
      </div>

      {/* 6. SURAT PERNYATAAN TANGGUNG JAWAB MUTLAK (SPTJM) */}
      <div className="page-break-after-always">
        <DocSptjm schoolInfo={schoolInfo} financialSummary={financialSummary} />
      </div>

      {/* 7. RKAS PER TRIWULAN (TRIWULAN I & II ACUAN TAHAP 1) */}
      <div className="page-break-after-always">
        <DocRkasTriwulan schoolInfo={schoolInfo} rkasItems={rkasItems} />
      </div>

      {/* 8. BKU PER BULAN (FORM K3) */}
      <div className="page-break-after-always">
        <DocBkuK3 schoolInfo={schoolInfo} transactions={transactions} />
      </div>

      {/* 9. BUKU PEMBANTU BANK PER BULAN (FORM K5) */}
      <div className="page-break-after-always">
        <DocBankK5 schoolInfo={schoolInfo} />
      </div>

      {/* 10. BUKU BANTU PAJAK PER BULAN (FORM K6) */}
      <div className="page-break-after-always">
        <DocPajakK6 schoolInfo={schoolInfo} />
      </div>

      {/* 11. REKAP REALISASI 1 TAHAP (FORM K7a) */}
      <div className="page-break-after-always">
        <DocRealisasiK7a schoolInfo={schoolInfo} rkasItems={rkasItems} financialSummary={financialSummary} />
      </div>

      {/* 12. REKENING KORAN / PERNYATAAN */}
      <div className="page-break-after-always">
        <DocRekeningKoran schoolInfo={schoolInfo} />
      </div>

      {/* 13. REGISTER PENUTUPAN KAS (FORM K7b) */}
      <div className="page-break-after-always">
        <DocPenutupanKasK7b schoolInfo={schoolInfo} denominations={denominations} />
      </div>

      {/* 14. BERITA ACARA PENUTUPAN KAS (FORM K7c) */}
      <div className="page-break-after-always">
        <DocBAPemeriksaanKasK7c schoolInfo={schoolInfo} />
      </div>

      {/* 15. SK SELURUH YANG BERSANGKUTAN SESUAI BKU */}
      <div className="page-break-after-always">
        <DocSkTim schoolInfo={schoolInfo} />
      </div>

      {/* 16. BUKTI KAS PENGELUARAN PER KEGIATAN/PEMBAYARAN (BPU FORMAT C5) */}
      <div className="page-break-after-always">
        <DocBuktiKasPengeluaran schoolInfo={schoolInfo} transactions={transactions} />
      </div>

      {/* 17. DAFTAR HONORARIUM SELURUH YANG BERSANGKUTAN SESUAI BKU */}
      <div className="page-break-after-always">
        <DocDaftarHonor schoolInfo={schoolInfo} transactions={transactions} />
      </div>

      {/* 18. DOKUMENTASI PEMBELANJAAN URUT SESUAI BKU */}
      <div className="page-break-after-always">
        <DocDokumentasiFoto schoolInfo={schoolInfo} transactions={transactions} />
      </div>

      {/* 19. REKAP PEMBELIAN BARANG ASET PER BULAN (FORM 09 BMD) */}
      <div className="page-break-after-always">
        <DocAsetForm09 schoolInfo={schoolInfo} assets={assets} />
      </div>

      {/* SUPPORTING DOCS: FORM 3 REKON, CHECKLIST INSTRUMEN & PAJAK NIHIL */}
      <div className="page-break-after-always">
        <DocForm3Rekon schoolInfo={schoolInfo} form3Rows={form3Rows} financialSummary={financialSummary} />
      </div>
      <div className="page-break-after-always">
        <DocChecklist28 schoolInfo={schoolInfo} checklistItems={checklistItems} />
      </div>
      <div className="page-break-after-always">
        <DocRekapPajakNihil schoolInfo={schoolInfo} />
      </div>
    </div>
  );
};
