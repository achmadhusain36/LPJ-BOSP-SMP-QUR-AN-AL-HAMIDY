import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { MonthlySummary, FinancialSummary } from "../types/lpj";
import { formatRupiah } from "../utils/lpjCalculations";
import { TrendingUp, BarChart2, PieChart as PieIcon, Info } from "lucide-react";

interface SpendingTrendChartProps {
  financialSummary: FinancialSummary;
  monthlySummaries: MonthlySummary[];
}

export const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({
  financialSummary,
  monthlySummaries,
}) => {
  const [chartType, setChartType] = useState<"composed" | "category_pie">("composed");

  // Prepare data with cumulative total and allocation target
  let runningCumulative = 0;
  const chartData = monthlySummaries.map((m) => {
    runningCumulative += m.totalExpenditure;
    return {
      month: m.month,
      barangJasa: m.barangJasa,
      honor: m.honor,
      modal: m.modal,
      totalExpenditure: m.totalExpenditure,
      cumulativeExpenditure: runningCumulative,
      totalAllocation: financialSummary.totalIncome,
      remainingBudget: Math.max(financialSummary.totalIncome - runningCumulative, 0),
    };
  });

  const totalAllocation = financialSummary.totalIncome;
  const totalExpenditure = financialSummary.totalExpenditure;
  const remainingBudget = financialSummary.cashBalance; // or totalAllocation - totalExpenditure

  // Find peak spending month
  const peakMonthObj = [...monthlySummaries].sort(
    (a, b) => b.totalExpenditure - a.totalExpenditure
  )[0];

  const averageMonthlyExpenditure =
    monthlySummaries.length > 0
      ? totalExpenditure / monthlySummaries.length
      : 0;

  // Category Pie Data
  const categoryData = [
    {
      name: "Barang & Jasa",
      value: financialSummary.categoryExpenditure.barangJasa,
      color: "#475569", // slate-600
    },
    {
      name: "Honorarium PTK",
      value: financialSummary.categoryExpenditure.honor,
      color: "#f59e0b", // amber-500
    },
    {
      name: "Belanja Modal Aset",
      value: financialSummary.categoryExpenditure.modal,
      color: "#2563eb", // blue-600
    },
  ];

  // Y-Axis tick formatter (e.g., Rp 20Jt)
  const formatShortRupiah = (val: number) => {
    if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(1)}M`;
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(0)}Jt`;
    if (val >= 1000) return `Rp ${(val / 1000).toFixed(0)}Rb`;
    return `Rp ${val}`;
  };

  // Custom Tooltip for Composed Chart
  const CustomComposedTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-lg shadow-xl text-xs space-y-2 border border-slate-700 min-w-[240px]">
          <div className="flex justify-between items-center border-b border-slate-700 pb-1.5 font-bold">
            <span className="text-blue-400">Bulan {label} 2026</span>
            <span className="text-slate-400 text-[10px]">
              Total: {formatRupiah(data.totalExpenditure)}
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                Barang &amp; Jasa
              </span>
              <span className="font-mono font-medium">{formatRupiah(data.barangJasa)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Honor PTK
              </span>
              <span className="font-mono font-medium">{formatRupiah(data.honor)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Belanja Modal
              </span>
              <span className="font-mono font-medium">{formatRupiah(data.modal)}</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-2 space-y-1 text-[11px]">
            <div className="flex justify-between items-center font-semibold text-emerald-400">
              <span>Kumulatif Realisasi:</span>
              <span className="font-mono">{formatRupiah(data.cumulativeExpenditure)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Alokasi BOSP Tahap 1:</span>
              <span className="font-mono">{formatRupiah(totalAllocation)}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-amber-300 pt-0.5">
              <span>Sisa Pagu BOSP:</span>
              <span className="font-mono">{formatRupiah(data.remainingBudget)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = ((item.value / (totalExpenditure || 1)) * 100).toFixed(1);
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded shadow-lg text-xs font-sans border border-slate-700">
          <p className="font-bold text-slate-200">{item.name}</p>
          <p className="font-mono text-emerald-400 font-semibold">{formatRupiah(item.value)} ({pct}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 md:p-6 shadow-xs space-y-5">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Grafik Tren Pengeluaran vs Alokasi Pagu BOSP
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Visualisasi tren pengeluaran bulanan, kumulatif belanja, dan perbandingan dengan Total Alokasi BOSP Tahap 1 ({formatRupiah(totalAllocation)})
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setChartType("composed")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              chartType === "composed"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Tren Bulanan &amp; Kumulatif</span>
          </button>
          <button
            onClick={() => setChartType("category_pie")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              chartType === "category_pie"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Proporsi Kategori</span>
          </button>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="w-full h-[320px] md:h-[350px]">
        {chartType === "composed" ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatShortRupiah}
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
                domain={[0, Math.ceil((totalAllocation * 1.05) / 10000000) * 10000000]}
              />
              <Tooltip content={<CustomComposedTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
                formatter={(value) => {
                  if (value === "barangJasa") return "Barang & Jasa";
                  if (value === "honor") return "Honor PTK";
                  if (value === "modal") return "Belanja Modal";
                  if (value === "cumulativeExpenditure") return "Kumulatif Realisasi";
                  return value;
                }}
              />

              {/* Reference Line for Total Allocation */}
              <ReferenceLine
                y={totalAllocation}
                stroke="#dc2626"
                strokeDasharray="6 4"
                strokeWidth={1.5}
                label={{
                  value: `Total Pagu BOSP: ${formatRupiah(totalAllocation)}`,
                  position: "insideTopLeft",
                  fill: "#dc2626",
                  fontSize: 10,
                  fontWeight: "bold",
                }}
              />

              {/* Stacked Bars for Category Spending */}
              <Bar dataKey="barangJasa" stackId="spending" fill="#64748b" radius={[0, 0, 0, 0]} barSize={32} />
              <Bar dataKey="honor" stackId="spending" fill="#f59e0b" radius={[0, 0, 0, 0]} barSize={32} />
              <Bar dataKey="modal" stackId="spending" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={32} />

              {/* Line for Cumulative Expenditure */}
              <Line
                type="monotone"
                dataKey="cumulativeExpenditure"
                stroke="#059669"
                strokeWidth={3}
                dot={{ r: 5, fill: "#059669", stroke: "#ffffff", strokeWidth: 2 }}
                activeDot={{ r: 7 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="w-full md:w-1/2 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full md:w-1/2 space-y-3 px-4">
              <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider">
                Distribusi Komposisi Belanja BOSP
              </h4>
              <p className="text-[11px] text-slate-500">
                Total Realisasi: <strong className="text-slate-900 font-mono">{formatRupiah(totalExpenditure)}</strong> ({financialSummary.realizationPercentage.toFixed(1)}% dari Pagu)
              </p>

              <div className="space-y-2 pt-2">
                {categoryData.map((cat) => {
                  const pct = (
                    (cat.value / (totalExpenditure || 1)) *
                    100
                  ).toFixed(1);
                  return (
                    <div
                      key={cat.name}
                      className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        ></span>
                        <span className="font-semibold text-slate-800">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-900 block">
                          {formatRupiah(cat.value)}
                        </span>
                        <span className="text-[10px] text-slate-500">{pct}% dari realisasi</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Stat Badges Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
            Avg
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Rata-Rata Belanja / Bln</p>
            <p className="font-mono font-bold text-slate-900 text-sm">
              {formatRupiah(averageMonthlyExpenditure)}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
            Peak
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Puncak Pengeluaran</p>
            <p className="font-mono font-bold text-slate-900 text-sm">
              {peakMonthObj?.month}: {formatRupiah(peakMonthObj?.totalExpenditure || 0)}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
            Sisa
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Sisa Pagu BOSP Tahap 1</p>
            <p className="font-mono font-bold text-amber-800 text-sm">
              {formatRupiah(remainingBudget)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
