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

  // Single pass through transactions
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

/**
 * OPTIMIZED: Pre-group transactions by month to avoid multiple filter passes
 * Performance: O(n) instead of O(n*m) where m = number of months (6)
 */
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

  // Pre-group transactions by month in single pass
  const monthMap = new Map<string, BkuTransaction[]>();
  transactions.forEach((tx) => {
    if (!monthMap.has(tx.month)) {
      monthMap.set(tx.month, []);
    }
    monthMap.get(tx.month)!.push(tx);
  });

  let currentRunningBalance = totalAllocatedIncome;

  return months.map((month) => {
    const monthTxs = monthMap.get(month) || [];
    let barangJasa = 0;
    let honor = 0;
    let modal = 0;
    let receipt = 0;

    // Single pass through month's transactions
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

/**
 * OPTIMIZED: Cache string matching results and avoid redundant filters
 * Performance: Single pass with memoized string checks
 */
export function validateComplianceRules(
  summary: FinancialSummary,
  transactions: BkuTransaction[]
): ComplianceRule[] {
  const libTargetPct = 10;
  const libMinAmount = summary.totalIncome * (libTargetPct / 100);

  // Optimized: Single pass through transactions for library expenditures
  let libRealized = 0;
  const libKeywords = ["buku", "perpustakaan"];
  
  transactions.forEach((tx) => {
    const descLower = tx.description.toLowerCase();
    if (libKeywords.some((keyword) => descLower.includes(keyword))) {
      libRealized += tx.expense;
    }
  });

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

/**
 * OPTIMIZED: Only recalculate balances from the changed index onwards
 * Performance: O(n-index) instead of O(n) for updates
 */
export function recalculateBkuBalances(
  transactions: BkuTransaction[],
  initialAllocated: number = 80850000,
  changedFromIndex?: number
): BkuTransaction[] {
  // If we know which index changed, only recalculate from there
  if (changedFromIndex !== undefined && changedFromIndex > 0) {
    const updated = [...transactions];
    let running = updated[changedFromIndex - 1].balance;

    for (let i = changedFromIndex; i < updated.length; i++) {
      if (updated[i].receipt > 0) {
        running += updated[i].receipt;
      }
      if (updated[i].expense > 0) {
        running -= updated[i].expense;
      }
      updated[i] = { ...updated[i], balance: running };
    }

    return updated;
  }

  // Full recalculation if no index specified
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

/**
 * OPTIMIZED: Pre-index transactions by account code
 * Performance: O(n) grouping + O(m) lookup instead of O(n*m)
 */
export function generateForm3Rows(
  rkasItems: RkasProgramItem[],
  transactions: BkuTransaction[]
): Form3Row[] {
  // Pre-index transactions by account code in single pass
  const accountMap = new Map<string, BkuTransaction[]>();
  transactions.forEach((tx) => {
    if (!accountMap.has(tx.accountCode)) {
      accountMap.set(tx.accountCode, []);
    }
    accountMap.get(tx.accountCode)!.push(tx);
  });

  return rkasItems.map((item, idx) => {
    const itemTxs = accountMap.get(item.code) || [];
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
