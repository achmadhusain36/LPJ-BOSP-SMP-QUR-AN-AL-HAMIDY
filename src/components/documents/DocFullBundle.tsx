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
import { DocBkuK3 } from "./DocBkuK3";
import { DocBankK5 } from "./DocBankK5";
import { DocPajakK6 } from "./DocPajakK6";
import { DocRekapPajakNihil } from "./DocRekapPajakNihil";
import { DocRealisasiK7a } from "./DocRealisasiK7a";
import { DocPenutupanKasK7b } from "./DocPenutupanKasK7b";
import { DocBAPemeriksaanKasK7c } from "./DocBAPemeriksaanKasK7c";
import { DocAsetForm09 } from "./DocAsetForm09";
import { DocRekeningKoran } from "./DocRekeningKoran";
import { DocForm3Rekon } from "./DocForm3Rekon";
import { DocChecklist28 } from "./DocChecklist28";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";

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
  const { schoolInfo } = props;

  return (
    <div className="space-y-12 print:space-y-0">
      {/* Cover Page */}
      <div className="bg-white p-10 shadow-sm border border-gray-200 min-h-[900px] flex flex-col justify-between text-center print:shadow-none print:border-none print:p-6 print:min-h-screen page-break-after-always">
        <div>
          <div className="w-24 h-24 mx-auto mb-6 bg-emerald-900 text-amber-400 font-bold text-3xl flex items-center justify-center rounded-full border-4 border-amber-400 shadow-md">
            QA
          </div>
          <h1 className="text-2xl font-black tracking-wider uppercase text-emerald-950 mb-2">
            LAPORAN PERTANGGUNGJAWABAN (LPJ)
          </h1>
          <h2 className="text-xl font-bold uppercase text-gray-800 mb-2">
            DANA BANTUAN OPERASIONAL SATUAN PENDIDIKAN (BOSP) REGULER
          </h2>
          <div className="inline-block px-6 py-2 bg-amber-100 text-amber-900 border-2 border-amber-500 rounded-full font-extrabold text-sm uppercase tracking-wide my-3">
            TAHAP 1 (JANUARI – JUNI) TAHUN ANGGARAN 2026
          </div>
        </div>

        <div className="my-8 py-6 border-y-2 border-emerald-900 bg-emerald-50/50 rounded print:bg-transparent">
          <p className="text-xs uppercase font-bold text-gray-500 tracking-widest mb-1">SATUAN PENDIDIKAN:</p>
          <h3 className="text-2xl font-black text-emerald-900 uppercase tracking-wide mb-1">
            {schoolInfo.name}
          </h3>
          <p className="text-sm font-bold text-gray-800">NPSN: {schoolInfo.npsn}</p>
          <p className="text-xs text-gray-700 mt-2">
            {schoolInfo.address}, {schoolInfo.district}, {schoolInfo.regency}, {schoolInfo.province}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-gray-600 mb-4">
            DISAMPAIKAN KEPADA YTH: <br />
            KEPALA DINAS PENDIDIKAN DAN KEBUDAYAAN KABUPATEN PRINGSEWU <br />
            PROVINSI LAMPUNG
          </p>
          <DocumentSignature schoolInfo={schoolInfo} dateStr="30 Juni 2026" showCommittee={true} />
        </div>
      </div>

      {/* 1. Checklist 28 */}
      <div className="page-break-after-always">
        <DocChecklist28 schoolInfo={schoolInfo} checklistItems={props.checklistItems} />
      </div>

      {/* 2. BKU K3 */}
      <div className="page-break-after-always">
        <DocBkuK3 schoolInfo={schoolInfo} transactions={props.transactions} />
      </div>

      {/* 3. Form 3 Rekon */}
      <div className="page-break-after-always">
        <DocForm3Rekon schoolInfo={schoolInfo} form3Rows={props.form3Rows} financialSummary={props.financialSummary} />
      </div>

      {/* 4. Rekap Realisasi K7a */}
      <div className="page-break-after-always">
        <DocRealisasiK7a schoolInfo={schoolInfo} rkasItems={props.rkasItems} financialSummary={props.financialSummary} />
      </div>

      {/* 5. Register Penutupan Kas K7b */}
      <div className="page-break-after-always">
        <DocPenutupanKasK7b schoolInfo={schoolInfo} denominations={props.denominations} />
      </div>

      {/* 6. BA Pemeriksaan Kas K7c */}
      <div className="page-break-after-always">
        <DocBAPemeriksaanKasK7c schoolInfo={schoolInfo} />
      </div>

      {/* 7. Buku Bantu Bank K5 */}
      <div className="page-break-after-always">
        <DocBankK5 schoolInfo={schoolInfo} />
      </div>

      {/* 8. Buku Bantu Pajak K6 */}
      <div className="page-break-after-always">
        <DocPajakK6 schoolInfo={schoolInfo} />
      </div>

      {/* 9. Surat Rekap Pajak Nihil */}
      <div className="page-break-after-always">
        <DocRekapPajakNihil schoolInfo={schoolInfo} />
      </div>

      {/* 10. Form 09 Aset BMD */}
      <div className="page-break-after-always">
        <DocAsetForm09 schoolInfo={schoolInfo} assets={props.assets} />
      </div>

      {/* 11. Rekening Koran */}
      <div className="page-break-after-always">
        <DocRekeningKoran schoolInfo={schoolInfo} />
      </div>
    </div>
  );
};
