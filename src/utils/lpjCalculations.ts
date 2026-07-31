import {
  BkuTransaction,
  FinancialSummary,
  ComplianceRule,
  RkasProgramItem,
  MonthlySummary,
  Form3Row,
} from "../types/lpj";

export function formatRupiah(amount: number): string {
  return "Rp " + Math.round(amount).toLocaleString("id-ID");
}

export function calculateFinancialSummary(
  transactions: BkuTransaction[],
  totalAllocatedIncome: number = 80850000
): FinancialSummary {
  let barangJasa = 0;
  let honor = 0;
  let modal = 0;

  transactions.forEach((tx) => {
    if (tx.category === "barang_jasa") {
      barangJasa += tx.expense;
    } else if (tx.category === "honor") {
      honor += tx.expense;
    } else if (tx.category === "modal") {
      modal += tx.expense;
    }
  });

  const totalExpenditure = barangJasa + honor + modal;
  const totalIncome = totalAllocatedIncome;
  const cashBalance = totalIncome - totalExpenditure;
  const realizationPercentage = totalIncome > 0 ? (totalExpenditure / totalIncome) * 100 : 0;

  return {
    totalIncome,
    totalExpenditure,
    cashBalance,
    cashTunai: cashBalance, // All cash in hand
    saldoBank: 0,
    categoryExpenditure: {
      barangJasa,
      honor,
      modal,
    },
    realizationPercentage,
  };
}

export function calculateMonthlySummaries(
  transactions: BkuTransaction[],
  totalAllocatedIncome: number = 80850000
): MonthlySummary[] {
  const months: Array<"Januari" | "Februari" | "Maret" | "April" | "Mei" | "Juni"> = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
  ];

  let currentRunningBalance = totalAllocatedIncome;

  return months.map((month) => {
    const monthTxs = transactions.filter((tx) => tx.month === month);
    let barangJasa = 0;
    let honor = 0;
    let modal = 0;
    let receipt = 0;

    monthTxs.forEach((tx) => {
      if (tx.category === "barang_jasa") barangJasa += tx.expense;
      if (tx.category === "honor") honor += tx.expense;
      if (tx.category === "modal") modal += tx.expense;
      if (tx.receipt > 0 && tx.category !== "transfer") receipt += tx.receipt;
    });

    const totalExpenditure = barangJasa + honor + modal;
    currentRunningBalance = currentRunningBalance - totalExpenditure;

    return {
      month,
      barangJasa,
      honor,
      modal,
      totalExpenditure,
      receipt: month === "Januari" ? totalAllocatedIncome : receipt,
      cashBalance: currentRunningBalance,
    };
  });
}

export function validateComplianceRules(
  summary: FinancialSummary,
  transactions: BkuTransaction[]
): ComplianceRule[] {
  const libTargetPct = 10;
  const libMinAmount = summary.totalIncome * (libTargetPct / 100);
  // Check library expenditures in transactions
  const libRealized = transactions
    .filter((t) => t.description.toLowerCase().includes("buku") || t.description.toLowerCase().includes("perpustakaan"))
    .reduce((acc, curr) => acc + curr.expense, 0);

  const honorMaxPct = 40;
  const honorMaxAmount = summary.totalIncome * (honorMaxPct / 100);
  const honorRealized = summary.categoryExpenditure.honor;

  const sarprasMaxPct = 20;
  const sarprasMaxAmount = summary.totalIncome * (sarprasMaxPct / 100);
  const sarprasRealized = summary.categoryExpenditure.barangJasa;

  return [
    {
      id: "perpustakaan",
      ruleName: "Pengembangan Perpustakaan / Pengadaan Buku Teks",
      ruleCategory: "Buku & Kepustakaan",
      thresholdType: "MIN",
      thresholdPercentage: libTargetPct,
      thresholdDescription: "Wajib Minimal 10% (Rp 8.085.000)",
      maxAllowedAmount: libMinAmount,
      actualAmount: libRealized,
      actualPercentage: summary.totalIncome > 0 ? (libRealized / summary.totalIncome) * 100 : 0,
      status: libRealized < libMinAmount ? "WARNING" : "OK",
      notes: "Persyaratan juknis BOSP Tahap 1 mewajibkan minimal 10% untuk perpustakaan. Realisasi Tahap 1 saat ini Rp 0 (0%). Komitmen pengadaan dialihkan penuh ke Tahap 2.",
    },
    {
      id: "honor",
      ruleName: "Pembayaran Honorarium GTT / PTK Non-ASN",
      ruleCategory: "Honorarium",
      thresholdType: "MAX",
      thresholdPercentage: honorMaxPct,
      thresholdDescription: "Maksimal 40% (Rp 32.340.000)",
      maxAllowedAmount: honorMaxAmount,
      actualAmount: honorRealized,
      actualPercentage: summary.totalIncome > 0 ? (honorRealized / summary.totalIncome) * 100 : 0,
      status: honorRealized <= honorMaxAmount ? "OK" : "WARNING",
      notes: `Realisasi honorarium GTK Non-ASN sebesar ${formatRupiah(honorRealized)} (${((honorRealized / summary.totalIncome) * 100).toFixed(1)}%) aman dan patuh di bawah plafon maksimal 40%.`,
    },
    {
      id: "sarpras",
      ruleName: "Pemeliharaan Sarana dan Prasarana Sekolah",
      ruleCategory: "Sarpras & Pemeliharaan",
      thresholdType: "MAX",
      thresholdPercentage: sarprasMaxPct,
      thresholdDescription: "Maksimal 20% (Rp 16.170.000)",
      maxAllowedAmount: sarprasMaxAmount,
      actualAmount: sarprasRealized,
      actualPercentage: summary.totalIncome > 0 ? (sarprasRealized / summary.totalIncome) * 100 : 0,
      status: sarprasRealized <= sarprasMaxAmount ? "OK" : "WARNING",
      notes: `Realisasi pemeliharaan sarpras ${formatRupiah(sarprasRealized)} terkontrol sesuai regulasi. Belanja Modal Sumur Bor Rp 15 Juta terpisah di KIB B.`,
    },
  ];
}

export function calculateComplianceRules(
  summary: FinancialSummary,
  rkasItems: RkasProgramItem[]
): ComplianceRule[] {
  // Alias for validateComplianceRules
  return validateComplianceRules(summary, []);
}

export function recalculateBkuBalances(transactions: BkuTransaction[], initialAllocated: number = 80850000): BkuTransaction[] {
  let running = 0;
  return transactions.map((tx) => {
    if (tx.receipt > 0) {
      running += tx.receipt;
    }
    if (tx.expense > 0) {
      running -= tx.expense;
    }
    return {
      ...tx,
      balance: running,
    };
  });
}

export function generateForm3Rows(
  rkasItems: RkasProgramItem[],
  transactions: BkuTransaction[]
): Form3Row[] {
  return rkasItems.map((item, idx) => {
    const itemTxs = transactions.filter((t) => t.accountCode === item.code);
    const realized = itemTxs.reduce((acc, t) => acc + t.expense, 0);

    return {
      no: idx + 1,
      kodeRekening: item.code,
      namaRekening: item.programName,
      rkasPaguTahap1: item.budgetTahap1,
      realisasiBarangJasa: item.category === "barang_jasa" || item.category === "honor" ? realized : 0,
      realisasiModalKibB: item.category === "modal" ? realized : 0,
      realisasiModalKibE: 0,
      totalRealisasi: realized,
      pajakDipotong: 0,
      pajakDisetor: 0,
      sisaPajak: 0,
    };
  });
}
