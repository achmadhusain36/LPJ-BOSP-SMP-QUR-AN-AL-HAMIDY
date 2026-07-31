export type RoleOption = "bku_default" | "rkas_default" | "custom";

export interface LetterheadSettings {
  heightMm?: number; // e.g. 40
  scalePercent?: number; // e.g. 100
  marginTopMm?: number; // e.g. 10
  marginBottomMm?: number; // e.g. 10
  horizontalMarginMm?: number; // e.g. 0 to 40 mm
  align?: "center" | "left" | "right" | "full";
  borderStyle?: "double" | "solid" | "emerald" | "none";
}

export interface SchoolInfo {
  npsn: string;
  name: string;
  address: string;
  district: string;
  regency: string;
  province: string;
  fundSource: string;
  period: string;
  stage: string;
  year: number;
  roleConfig: RoleOption;
  headmaster: string;
  headmasterNip?: string;
  treasurer: string;
  treasurerNip?: string;
  committeeName?: string;
  letterheadImage?: string; // Base64 PNG data URL or SVG path
  showLetterheadOnLandscape?: boolean; // Default false
  letterheadSettings?: LetterheadSettings;
}

export type SpendingCategory = "barang_jasa" | "honor" | "modal" | "transfer";

export interface BkuTransaction {
  id: string;
  date: string;
  month: "Januari" | "Februari" | "Maret" | "April" | "Mei" | "Juni";
  proofNo: string;
  activityCode: string;
  accountCode: string;
  description: string;
  receipt: number;
  expense: number;
  balance: number;
  cashType: "bank" | "tunai";
  category: SpendingCategory;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenditure: number;
  cashBalance: number;
  cashTunai: number;
  saldoBank: number;
  categoryExpenditure: {
    barangJasa: number;
    honor: number;
    modal: number;
  };
  realizationPercentage: number;
}

export interface MonthlySummary {
  month: "Januari" | "Februari" | "Maret" | "April" | "Mei" | "Juni";
  barangJasa: number;
  honor: number;
  modal: number;
  totalExpenditure: number;
  receipt: number;
  cashBalance: number;
}

export interface RkasProgramItem {
  id: string;
  code: string;
  programName: string;
  budgetTahap1: number;
  realizedTahap1: number;
  budgetYear?: number;
  category: SpendingCategory;
  isMandatoryLibrary?: boolean;
}

export interface Form3Row {
  no: number;
  kodeRekening: string;
  namaRekening: string;
  rkasPaguTahap1: number;
  realisasiBarangJasa: number;
  realisasiModalKibB: number;
  realisasiModalKibE: number;
  totalRealisasi: number;
  pajakDipotong: number;
  pajakDisetor: number;
  sisaPajak: number;
}

export interface AssetRow {
  id: string;
  code: string;
  name: string;
  merkType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  purchaseDate: string;
  location: string;
  condition: "Baik" | "Kurang Baik" | "Rusak Berat";
  kibCategory: "KIB B (Peralatan & Mesin)" | "KIB E (Aset Tetap Lainnya)";
}

export interface ChecklistItem {
  id: string;
  code: string; // e.g. "A.1"
  group: "A. Dokumen Administrasi Keuangan" | "B. Dokumen Bukti Belanja & Perpajakan" | "C. Dokumen Pendukung & Pelaporan";
  title: string;
  description: string;
  status: "ADA" | "TIDAK";
  recommendation: string;
  isGenerated: boolean;
}

export interface ComplianceRule {
  id: string;
  ruleName: string;
  ruleCategory: string;
  thresholdType: "MIN" | "MAX";
  thresholdPercentage: number;
  thresholdDescription: string;
  maxAllowedAmount: number;
  actualAmount: number;
  actualPercentage: number;
  status: "OK" | "WARNING" | "VIOLATION";
  notes: string;
}

export interface CashDenomination {
  value: number;
  count: number;
  total: number;
}
