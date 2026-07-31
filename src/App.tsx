import React, { useState, useMemo } from "react";
import {
  SchoolInfo,
  BkuTransaction,
  RkasProgramItem,
  AssetRow,
  CashDenomination,
  ChecklistItem,
} from "./types/lpj";
import {
  initialSchoolInfo,
  initialBkuTransactions,
  initialRkasItems,
  initialAssets,
  initialCashDenominations,
  initialChecklistItems,
} from "./data/defaultLpjData";
import {
  calculateFinancialSummary,
  calculateMonthlySummaries,
  validateComplianceRules,
  recalculateBkuBalances,
  generateForm3Rows,
} from "./utils/lpjCalculations";

import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { BkuManager } from "./components/BkuManager";
import { ComplianceChecker } from "./components/ComplianceChecker";
import { AiAssistant } from "./components/AiAssistant";
import { DocumentViewer } from "./components/DocumentViewer";
import { SchoolProfileModal } from "./components/SchoolProfileModal";

export const App: React.FC = () => {
  // Application State
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "bku" | "documents" | "compliance" | "ai_assistant"
  >("dashboard");

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(initialSchoolInfo);
  const [transactions, setTransactions] = useState<BkuTransaction[]>(initialBkuTransactions);
  const [rkasItems, setRkasItems] = useState<RkasProgramItem[]>(initialRkasItems);
  const [assets, setAssets] = useState<AssetRow[]>(initialAssets);
  const [denominations, setDenominations] = useState<CashDenomination[]>(initialCashDenominations);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(initialChecklistItems);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Recalculated Financial Summary
  const financialSummary = useMemo(
    () => calculateFinancialSummary(transactions),
    [transactions]
  );

  // Monthly Summary
  const monthlySummaries = useMemo(
    () => calculateMonthlySummaries(transactions),
    [transactions]
  );

  // Compliance Validation Rules
  const complianceRules = useMemo(
    () => validateComplianceRules(financialSummary, transactions),
    [financialSummary, transactions]
  );

  // Form 3 Reconciliation Rows
  const form3Rows = useMemo(
    () => generateForm3Rows(rkasItems, transactions),
    [rkasItems, transactions]
  );

  // BKU Transaction Handlers
  const handleAddTransaction = (newTx: Omit<BkuTransaction, "id">) => {
    const txWithId: BkuTransaction = {
      ...newTx,
      id: `tx-${Date.now()}`,
    };
    const updatedRaw = [...transactions, txWithId];
    const recalculated = recalculateBkuBalances(updatedRaw);
    setTransactions(recalculated);
  };

  const handleUpdateTransaction = (id: string, updated: Partial<BkuTransaction>) => {
    const updatedRaw = transactions.map((t) => (t.id === id ? { ...t, ...updated } : t));
    const recalculated = recalculateBkuBalances(updatedRaw);
    setTransactions(recalculated);
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedRaw = transactions.filter((t) => t.id !== id);
    const recalculated = recalculateBkuBalances(updatedRaw);
    setTransactions(recalculated);
  };

  const handleResetBku = () => {
    setTransactions(initialBkuTransactions);
  };

  const handlePrintAll = () => {
    setActiveTab("documents");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col font-sans selection:bg-amber-300 selection:text-emerald-950">
      {/* Navigation Header */}
      <Header
        schoolInfo={schoolInfo}
        financialSummary={financialSummary}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onPrintAll={handlePrintAll}
      />

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === "dashboard" && (
          <Dashboard
            schoolInfo={schoolInfo}
            financialSummary={financialSummary}
            monthlySummaries={monthlySummaries}
            complianceRules={complianceRules}
            checklistItems={checklistItems}
            setActiveTab={setActiveTab}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}

        {activeTab === "bku" && (
          <BkuManager
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onUpdateTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onResetBku={handleResetBku}
          />
        )}

        {activeTab === "compliance" && (
          <ComplianceChecker
            rules={complianceRules}
            schoolInfo={schoolInfo}
            financialSummary={financialSummary}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "ai_assistant" && (
          <AiAssistant
            schoolInfo={schoolInfo}
            financialSummary={financialSummary}
            complianceRules={complianceRules}
          />
        )}

        {activeTab === "documents" && (
          <DocumentViewer
            schoolInfo={schoolInfo}
            transactions={transactions}
            rkasItems={rkasItems}
            financialSummary={financialSummary}
            form3Rows={form3Rows}
            assets={assets}
            denominations={denominations}
            checklistItems={checklistItems}
            onSaveSchoolInfo={(updated) => setSchoolInfo(updated)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-300/80 border-t border-emerald-900 py-4 px-6 text-center text-xs print:hidden">
        <p className="font-medium">
          Aplikasi Generator LPJ BOSP Reguler Tahap 1 Tahun 2026 — <strong>SMP Quran Al-Hamidy Pringsewu</strong>
        </p>
        <p className="text-[10px] text-emerald-400/60 mt-1">
          Terdokumentasi & Terintegrasi dengan Gemini API untuk Analisis & Rekonsiliasi Otomatis
        </p>
      </footer>

      {/* School Profile Modal */}
      <SchoolProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        schoolInfo={schoolInfo}
        onSaveSchoolInfo={(updated) => setSchoolInfo(updated)}
      />
    </div>
  );
};

export default App;
