export interface HonorRecipient {
  no: number;
  name: string;
  role: "Guru" | "Tenaga Kependidikan";
  monthlyAmount: number;
}

export const FIXED_HONOR_RECIPIENTS: HonorRecipient[] = [
  { no: 1, name: "Fatimatus Sya'adah", role: "Guru", monthlyAmount: 960000 },
  { no: 2, name: "Nikmaturohmah", role: "Guru", monthlyAmount: 360000 },
  { no: 3, name: "Septa Meliyani", role: "Guru", monthlyAmount: 450000 },
  { no: 4, name: "Yuqwiyatun Navis", role: "Guru", monthlyAmount: 375000 },
  { no: 5, name: "Diana Ariyanti", role: "Guru", monthlyAmount: 300000 },
  { no: 6, name: "Dewi Anilailatul Fadhilah", role: "Guru", monthlyAmount: 375000 },
  { no: 7, name: "Asriah", role: "Guru", monthlyAmount: 300000 },
  { no: 8, name: "M. Mahrus Alwi", role: "Guru", monthlyAmount: 375000 },
  { no: 9, name: "Fatimatus Sya'adah, M.Pd.", role: "Tenaga Kependidikan", monthlyAmount: 500000 },
  { no: 10, name: "M. Solihin", role: "Tenaga Kependidikan", monthlyAmount: 400000 },
];

export const MONTHLY_HONOR_STANDARD = FIXED_HONOR_RECIPIENTS.reduce(
  (sum, r) => sum + r.monthlyAmount,
  0
); // 4.695.000

export interface MonthlyHonorDetail {
  monthName: string;
  periodLabel: string;
  multiplier: number; // 2 for Jan-Feb in Feb, 1 for Mar, Apr, May, Jun
  proofNo: string;
  date: string;
  recipients: Array<{
    no: number;
    name: string;
    role: string;
    grossAmount: number;
    taxAmount: number;
    netAmount: number;
  }>;
  totalGross: number;
  totalTax: number;
  totalNet: number;
}

export function getMonthlyHonorDetail(month: string, proofNo: string, date: string): MonthlyHonorDetail {
  const isFeb = month === "Februari";
  const multiplier = isFeb ? 2 : 1;
  const periodLabel = isFeb
    ? "Bulan Januari & Februari 2026"
    : `Bulan ${month} 2026`;

  const recipients = FIXED_HONOR_RECIPIENTS.map((r) => {
    const grossAmount = r.monthlyAmount * multiplier;
    const taxAmount = 0; // NIHIL for routine Non-ASN honor below PTKP
    const netAmount = grossAmount - taxAmount;
    return {
      no: r.no,
      name: r.name,
      role: r.role,
      grossAmount,
      taxAmount,
      netAmount,
    };
  });

  const totalGross = recipients.reduce((sum, r) => sum + r.grossAmount, 0);
  const totalTax = recipients.reduce((sum, r) => sum + r.taxAmount, 0);
  const totalNet = totalGross - totalTax;

  return {
    monthName: month,
    periodLabel,
    multiplier,
    proofNo,
    date,
    recipients,
    totalGross,
    totalTax,
    totalNet,
  };
}

export interface IncidentalHonorDetail {
  proofNo: string;
  date: string;
  description: string;
  recipientName: string;
  role: string;
  grossAmount: number;
  taxRatePct: number;
  taxAmount: number;
  netAmount: number;
}

export const APRIL_INCIDENTAL_HONOR: IncidentalHonorDetail = {
  proofNo: "KW-01.B/APR/2026",
  date: "06-04-2026",
  description: "Honorarium Narasumber & Moderator Kegiatan Pesantren Kilat Ramadhan 1447 H / 2026 M",
  recipientName: "Syekh Al-Ngarifin, M.Pd.",
  role: "Narasumber / Penceramah Pesantren Kilat Ramadhan",
  grossAmount: 1000000,
  taxRatePct: 5,
  taxAmount: 50000,
  netAmount: 950000,
};
