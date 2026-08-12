import React, { useState, useCallback } from "react";
import { SchoolInfo, FinancialSummary, ComplianceRule } from "../types/lpj";
import { Sparkles, Bot, Send, FileText, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";

interface AiAssistantProps {
  schoolInfo: SchoolInfo;
  financialSummary: FinancialSummary;
  complianceRules: ComplianceRule[];
}

// OPTIMIZED: Limit chat history to prevent memory bloat
const MAX_CHAT_MESSAGES = 50;

export const AiAssistant: React.FC<AiAssistantProps> = ({
  schoolInfo,
  financialSummary,
  complianceRules,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"narrative" | "audit" | "chat">("narrative");

  // Narrative State
  const [narrativeResult, setNarrativeResult] = useState<string | null>(null);
  const [isGeneratingNarrative, setIsGeneratingNarrative] = useState(false);

  // Audit State
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [isGeneratingAudit, setIsGeneratingAudit] = useState(false);

  // Chatbot State - OPTIMIZED: Initialize with max history limit
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: `Assalamu'alaikum wr. wb. Saya Asisten AI LPJ BOSP untuk SMP Quran Al-Hamidy. Ada yang bisa saya bantu terkait aturan Permendikdasmen No. 8/2026, pajak, atau penyusunan dokumen LPJ Tahap 1?`,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Handle Generate Narrative
  const handleGenerateNarrative = useCallback(async () => {
    setIsGeneratingNarrative(true);
    try {
      const res = await fetch("/api/gemini/generate-narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolInfo, financialSummary }),
      });
      const data = await res.json();
      setNarrativeResult(data.narrative);
    } catch (error) {
      setNarrativeResult("Gagal menghasilkan narasi LPJ via AI.");
    } finally {
      setIsGeneratingNarrative(false);
    }
  }, [schoolInfo, financialSummary]);

  // Handle Generate Audit
  const handleGenerateAudit = useCallback(async () => {
    setIsGeneratingAudit(true);
    try {
      const res = await fetch("/api/gemini/analyze-lpj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolInfo, financialSummary, rules: complianceRules }),
      });
      const data = await res.json();
      setAuditResult(data.analysis);
    } catch (error) {
      setAuditResult("Gagal menghasilkan analisis audit via AI.");
    } finally {
      setIsGeneratingAudit(false);
    }
  }, [schoolInfo, financialSummary, complianceRules]);

  // Handle Send Chat - OPTIMIZED: Limit message history
  const handleSendChat = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!chatInput.trim() || isSendingChat) return;

      const userMsg = chatInput.trim();
      
      // Add user message and limit history
      setMessages((prev) => {
        const updated = [...prev, { sender: "user", text: userMsg }];
        // Keep only the most recent MAX_CHAT_MESSAGES
        return updated.slice(-MAX_CHAT_MESSAGES);
      });
      
      setChatInput("");
      setIsSendingChat(true);

      try {
        const res = await fetch("/api/gemini/chat-assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMsg,
            context: { schoolInfo, financialSummary },
          }),
        });
        const data = await res.json();
        
        // Add AI response and limit history
        setMessages((prev) => {
          const updated = [...prev, { sender: "ai", text: data.reply }];
          return updated.slice(-MAX_CHAT_MESSAGES);
        });
      } catch (error) {
        setMessages((prev) => {
          const updated = [
            ...prev,
            { sender: "ai", text: "Maaf, terjadi kesalahan koneksi AI server." },
          ];
          return updated.slice(-MAX_CHAT_MESSAGES);
        });
      } finally {
        setIsSendingChat(false);
      }
    },
    [chatInput, isSendingChat, schoolInfo, financialSummary]
  );

  return (
    <div className="space-y-6">
      {/* Sub Tabs Selector */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSubTab("narrative")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeSubTab === "narrative"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Narator Kata Pengantar LPJ</span>
        </button>

        <button
          onClick={() => setActiveSubTab("audit")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeSubTab === "audit"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>AI Audit & Catatan Inspektorat</span>
        </button>

        <button
          onClick={() => setActiveSubTab("chat")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeSubTab === "chat"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Bot className="w-4 h-4 text-blue-400" />
          <span>Tanya Jawab Juknis BOSP</span>
        </button>
      </div>

      {/* Sub Tab 1: Narrative Generator */}
      {activeSubTab === "narrative" && (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>Pembuat Narasi & Kata Pengantar LPJ BOSP</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hasilkan dokumen pembuka dan pertanggungjawaban kualitatif untuk melengkapi laporan fisik.
              </p>
            </div>

            <button
              onClick={handleGenerateNarrative}
              disabled={isGeneratingNarrative}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-2 shadow-xs transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{isGeneratingNarrative ? "Menulis Narasi..." : "Hasilkan Narasi LPJ"}</span>
            </button>
          </div>

          {narrativeResult ? (
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line shadow-inner max-h-[500px] overflow-y-auto">
              {narrativeResult}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Klik tombol <strong>"Hasilkan Narasi LPJ"</strong> di atas untuk membuat kata pengantar resmi dan ringkasan eksekutif realisasi BOSP Tahap 1.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Sub Tab 2: AI Audit */}
      {activeSubTab === "audit" && (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>Audit & Rekomendasi Pemeriksaan LPJ</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                AI memeriksa kesesuaian nominal BKU, Form 3, dan rasio belanja Permendikdasmen No. 8/2026.
              </p>
            </div>

            <button
              onClick={handleGenerateAudit}
              disabled={isGeneratingAudit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-2 shadow-xs transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{isGeneratingAudit ? "Memeriksa Berkas..." : "Audit via AI Gemini"}</span>
            </button>
          </div>

          {auditResult ? (
            <div className="bg-slate-900 text-slate-100 p-5 rounded-lg border border-slate-800 text-xs leading-relaxed whitespace-pre-line font-mono shadow-inner max-h-[500px] overflow-y-auto">
              {auditResult}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 space-y-3">
              <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Klik tombol <strong>"Audit via AI Gemini"</strong> untuk menjalankan simulasi pemeriksaan kelayakan LPJ oleh Inspektorat.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Sub Tab 3: Interactive Chatbot */}
      {activeSubTab === "chat" && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden flex flex-col h-[550px]">
          <div className="bg-slate-900 text-white p-4 flex items-center gap-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Asisten Konsultasi LPJ BOSP & ARKAS</h3>
              <p className="text-[11px] text-slate-400">
                Tanyakan seputar Juknis BOSP, aturan e-purchasing SIPLah, atau perpustakaan.
              </p>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-3.5 leading-relaxed shadow-2xs ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white font-medium"
                      : "bg-white border border-slate-100 text-slate-800"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            {isSendingChat && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-xl p-3 text-xs text-slate-500 italic flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span>AI Gemini sedang merumuskan jawaban...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ketik pertanyaan seputar BOSP, misal: 'Apakah honor GTT wajib bayar PPh 21?'"
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 outline-hidden"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isSendingChat}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Kirim</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
