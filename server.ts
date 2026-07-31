import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialization for Gemini AI client
function getGeminiAi() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Route: AI LPJ Audit & Compliance Analysis
app.post("/api/gemini/analyze-lpj", async (req, res) => {
  try {
    const ai = getGeminiAi();
    const { schoolInfo, financialSummary, monthlyBreakdown, complianceRules, bkuSample } = req.body;

    const prompt = `
Anda adalah seorang Auditor Keuangan Pendidikan dan Ahli Pengelolaan Dana BOSP Kemenag/Kemendikbudristek RI.
Analisis data LPJ BOSP Reguler Tahap 1 Tahun 2026 berikut untuk ${schoolInfo?.name || "SMP Quran Al-Hamidy"}:

[DATA IDENTITAS]
Sekolah: ${schoolInfo?.name} (NPSN: ${schoolInfo?.npsn})
Alamat: ${schoolInfo?.address}
Periode: ${schoolInfo?.period}
Kepala Sekolah: ${schoolInfo?.headmaster}
Bendahara: ${schoolInfo?.treasurer}

[RINGKASAN KEUANGAN]
Penerimaan Tahap 1: Rp ${financialSummary?.totalIncome?.toLocaleString("id-ID")}
Total Realisasi: Rp ${financialSummary?.totalExpenditure?.toLocaleString("id-ID")} (${financialSummary?.realizationPercentage?.toFixed(1)}%)
Saldo Kas: Rp ${financialSummary?.cashBalance?.toLocaleString("id-ID")} (Tunai: Rp ${financialSummary?.cashBalance?.toLocaleString("id-ID")}, Bank: Rp 0)

[RINCIAN KATEGORI BELANJA]
- Belanja Barang/Jasa: Rp ${financialSummary?.categoryExpenditure?.barangJasa?.toLocaleString("id-ID")}
- Belanja Honor: Rp ${financialSummary?.categoryExpenditure?.honor?.toLocaleString("id-ID")}
- Belanja Modal (Aset): Rp ${financialSummary?.categoryExpenditure?.modal?.toLocaleString("id-ID")} (Pendalaman Sumur Bor)

[BATASAN ATURAN PERMENDIKDASMEN NO. 8 TAHUN 2026]
1. Pengadaan Buku/Perpustakaan (Min 10% = Rp 8.085.000): Realisasi Rp 0 -> STATUS: PERINGATAN
2. Honorarium Non-ASN Swasta (Max 40% = Rp 32.340.000): Realisasi Rp 29.170.000 (36.08%) -> STATUS: TERPENUHI (OK)
3. Pemeliharaan Sarpras (Max 20% = Rp 16.170.000): Realisasi Rp 1.250.000 (1.55%) -> STATUS: TERPENUHI (OK)

Berikan analisis komprehensif, temuan pemeriksaan, risiko audit yang mungkin muncul saat diverifikasi Dinas/Inspektorat, serta saran langkah perbaikan yang harus dilakukan sekolah sebelum menyerahkan LPJ ini.
Jawab dengan bahasa Indonesia profesional, terstruktur, ramah, dan solutif.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("Error in /api/gemini/analyze-lpj:", error);
    res.status(500).json({ error: error.message || "Gagal melakukan analisis AI" });
  }
});

// API Route: AI Narrative & Backstory Generator for LPJ Report
app.post("/api/gemini/generate-narrative", async (req, res) => {
  try {
    const ai = getGeminiAi();
    const { schoolInfo, financialSummary } = req.body;

    const prompt = `
Susun narasi resmi "Laporan Keterangan Realisasi dan Evaluasi Penggunaan Dana BOSP Reguler Tahap 1 Tahun 2026" untuk ${schoolInfo?.name || "SMP Quran Al-Hamidy"}.

Data:
- NPSN: ${schoolInfo?.npsn}
- Kabupaten: Pringsewu, Lampung
- Total Penerimaan BOSP Tahap 1: Rp ${financialSummary?.totalIncome?.toLocaleString("id-ID")}
- Realisasi Belanja: Rp ${financialSummary?.totalExpenditure?.toLocaleString("id-ID")}
- Sisa Saldo Kas Tunai: Rp ${financialSummary?.cashBalance?.toLocaleString("id-ID")}
- Kepala Sekolah: ${schoolInfo?.headmaster}
- Bendahara: ${schoolInfo?.treasurer}

Tolong hasilkan dalam format Markdown yang rapi dengan struktur:
1. PENDAHULUAN (Latar Belakang & Dasar Hukum Permendikdasmen No. 8 Tahun 2026)
2. REALISASI KEGIATAN & PENGGUNAAN DANA (Ringkasan penggunaan honor, barang jasa, dan perbaikan/sumur bor)
3. EVALUASI DAN SISA SALDO KAS (Alasan sisa kas Rp 28.964.000 untuk kesiapan Tahap 2 & rencana pembelian buku di Tahap 2)
4. PENUTUP & LEMBAR PENGESAHAN KATA PENGANTAR.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ narrative: response.text });
  } catch (error: any) {
    console.error("Error in /api/gemini/generate-narrative:", error);
    res.status(500).json({ error: error.message || "Gagal membuat narasi LPJ" });
  }
});

// API Route: AI Chat Consultation for BOSP Regulations & BKU Help
app.post("/api/gemini/chat-assistant", async (req, res) => {
  try {
    const ai = getGeminiAi();
    const { message, context } = req.body;

    const systemInstruction = `
Anda adalah Asisten Virtual Ahli Keuangan BOSP (Bantuan Operasional Satuan Pendidikan) Kemenag/Kemendikbudristek untuk SMP Quran Al-Hamidy Pringsewu.
Anda menguasai:
- Permendikdasmen No. 8 Tahun 2026 (Juknis BOSP).
- Tata cara pengisian BKU (K3), Buku Bantu Bank (K5), Buku Bantu Pajak (K6), K7a, K7b, K7c, dan Form 3 Rekon BOSP.
- Aturan Pajak Bendahara (PPN, PPh 21, PPh 22, PPh 23) & ambang batas kewajiban pajak.
- Solusi untuk temuan audit (misal: belum belanja buku 10%, dualitas nama Kepala Sekolah/Bendahara di RKAS vs BKU).

Bantu pengguna menyelesaikan pertanyaan keuangan BOSP dengan jelas, ringkas, akurat, dan ramah.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: message,
      config: {
        systemInstruction,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error in /api/gemini/chat-assistant:", error);
    res.status(500).json({ error: error.message || "Gagal merespons percakapan AI" });
  }
});

// API Route: AI Raw Text/File Data Parser
app.post("/api/gemini/parse-file", async (req, res) => {
  try {
    const ai = getGeminiAi();
    const { rawText } = req.body;

    const prompt = `
Ekstrak teks berikut menjadi array transaksi BKU yang valid dalam format JSON:
[
  {
    "date": "DD-MM-YYYY",
    "proofNo": "string",
    "activityCode": "string",
    "accountCode": "string",
    "description": "string",
    "receipt": number,
    "expense": number,
    "category": "barang_jasa" | "honor" | "modal" | "transfer"
  }
]

Teks input:
${rawText}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    res.json({ data: JSON.parse(response.text) });
  } catch (error: any) {
    console.error("Error in /api/gemini/parse-file:", error);
    res.status(500).json({ error: error.message || "Gagal mengekstrak data" });
  }
});

// Start Server with Vite Middleware in Dev
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
