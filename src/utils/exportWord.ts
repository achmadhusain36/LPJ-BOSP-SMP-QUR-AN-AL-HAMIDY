import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  PageBreak,
} from "docx";
import { saveAs } from "file-saver";
import {
  SchoolInfo,
  BkuTransaction,
  FinancialSummary,
  Form3Row,
} from "../types/lpj";
import { formatRupiah } from "./lpjCalculations";

// Helper for border styles
const cellBorderNone = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

const cellBorderThin = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
};

export async function generateLpjWordDocument({
  schoolInfo,
  transactions,
  financialSummary,
  form3Rows,
  docType = "ALL",
  hideHeader = false,
}: {
  schoolInfo: SchoolInfo;
  transactions: BkuTransaction[];
  financialSummary: FinancialSummary;
  form3Rows: Form3Row[];
  docType?: string;
  hideHeader?: boolean;
}) {
  const children: any[] = [];

  const stageText = schoolInfo.stage || "Tahap 1";
  const yearText = schoolInfo.year || 2026;
  const shouldHideHeader = hideHeader || Boolean(schoolInfo.hideHeader);

  // Helper for Kop Surat
  const createKopSurat = () => {
    if (shouldHideHeader) {
      return [];
    }
    return [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `PEMERINTAH KABUPATEN ${schoolInfo.regency ? schoolInfo.regency.toUpperCase() : "PRINGSEWU"}`,
            bold: true,
            size: 20,
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "DINAS PENDIDIKAN DAN KEBUDAYAAN",
            bold: true,
            size: 22,
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: schoolInfo.name.toUpperCase(),
            bold: true,
            size: 24,
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `${schoolInfo.address} | NPSN: ${schoolInfo.npsn}`,
            size: 18,
            italics: true,
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
            bold: true,
            size: 20,
          }),
        ],
      }),
      new Paragraph({ text: "", spacing: { after: 200 } }),
    ];
  };

  // Helper for Signatures Table
  const createSignatureTable = (dateStr = "30 Juni 2026") => {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: cellBorderNone,
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: "Mengetahui,\n", font: "Times New Roman" }),
                    new TextRun({
                      text: "Kepala Sekolah\n\n\n\n",
                      bold: true,
                      font: "Times New Roman",
                    }),
                    new TextRun({
                      text: `${schoolInfo.headmaster}\n`,
                      bold: true,
                      font: "Times New Roman",
                    }),
                    new TextRun({
                      text: `NIP. ${schoolInfo.headmasterNip || "-"}`,
                      font: "Times New Roman",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: cellBorderNone,
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: `Pringsewu, ${dateStr}\n`, font: "Times New Roman" }),
                    new TextRun({
                      text: "Bendahara BOSP\n\n\n\n",
                      bold: true,
                      font: "Times New Roman",
                    }),
                    new TextRun({
                      text: `${schoolInfo.treasurer}\n`,
                      bold: true,
                      font: "Times New Roman",
                    }),
                    new TextRun({
                      text: `NIP. ${schoolInfo.treasurerNip || "-"}`,
                      font: "Times New Roman",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };

  // 1. COVER / SAMPUL
  if (docType === "ALL" || docType === "DOC_1_COVER") {
    children.push(
      new Paragraph({ text: "", spacing: { after: 400 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "LAPORAN PERTANGGUNGJAWABAN (LPJ)",
            bold: true,
            size: 32,
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "DANA BANTUAN OPERASIONAL SATUAN PENDIDIKAN (BOSP) REGULER",
            bold: true,
            size: 26,
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `${stageText.toUpperCase()} TAHUN ANGGARAN ${yearText}`,
            bold: true,
            size: 24,
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({ text: "", spacing: { after: 600 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "DISUSUN OLEH:",
            bold: true,
            size: 22,
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: schoolInfo.name.toUpperCase(),
            bold: true,
            size: 28,
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `NPSN: ${schoolInfo.npsn}`,
            size: 22,
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: schoolInfo.address,
            size: 20,
            italics: true,
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({ text: "", spacing: { after: 800 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "DINAS PENDIDIKAN DAN KEBUDAYAAN",
            bold: true,
            size: 24,
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `KABUPATEN PRINGSEWU - TAHUN ${yearText}`,
            bold: true,
            size: 22,
            font: "Times New Roman",
          }),
        ],
      })
    );

    if (docType === "ALL") children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // 2. SURAT PENGANTAR & NARASI
  if (docType === "ALL" || docType === "DOC_2_PENGANTAR" || docType === "DOC_3_4_5_NARASI") {
    children.push(...createKopSurat());
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "SURAT PENGANTAR LPJ BOSP",
            bold: true,
            size: 24,
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `Nomor: 421.2/${schoolInfo.npsn}/BOSP/${yearText}`,
            size: 20,
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({ text: "", spacing: { after: 200 } }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Kepada Yth,\nKepala Dinas Pendidikan dan Kebudayaan Kabupaten Pringsewu\nc.q. Tim Manajemen BOSP Reguler\ndi Tempat\n\n",
            font: "Times New Roman",
            size: 22,
          }),
          new TextRun({
            text: `Dengan hormat,\nBersama ini kami sampaikan Laporan Pertanggungjawaban (LPJ) Penggunaan Dana BOSP Reguler ${stageText} Tahun Anggaran ${yearText} pada ${schoolInfo.name} dengan rincian sebagai berikut:\n\n`,
            font: "Times New Roman",
            size: 22,
          }),
          new TextRun({
            text: `1. Total Penerimaan BOSP            : ${formatRupiah(financialSummary.totalIncome)}\n`,
            font: "Times New Roman",
            size: 22,
          }),
          new TextRun({
            text: `2. Total Realisasi Pengeluaran    : ${formatRupiah(financialSummary.totalExpenditure)}\n`,
            font: "Times New Roman",
            size: 22,
          }),
          new TextRun({
            text: `3. Sisa Kas Bank & Tunai          : ${formatRupiah(financialSummary.cashBalance)}\n\n`,
            font: "Times New Roman",
            size: 22,
          }),
          new TextRun({
            text: "Demikian surat pengantar ini kami sampaikan untuk dipergunakan sebagaimana mestinya.\n\n",
            font: "Times New Roman",
            size: 22,
          }),
        ],
      }),
      createSignatureTable()
    );

    if (docType === "ALL") children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // 3. SPTJM
  if (docType === "ALL" || docType === "DOC_6_SPTJM") {
    children.push(...createKopSurat());
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "SURAT PERNYATAAN TANGGUNG JAWAB MUTLAK (SPTJM)",
            bold: true,
            size: 24,
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({ text: "", spacing: { after: 200 } }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Yang bertanda tangan di bawah ini:\n",
            font: "Times New Roman",
            size: 22,
          }),
          new TextRun({
            text: `Nama                   : ${schoolInfo.headmaster}\nNIP                    : ${schoolInfo.headmasterNip || "-"}\nJabatan                : Kepala Sekolah ${schoolInfo.name}\nAlamat Sekolah         : ${schoolInfo.address}\n\n`,
            font: "Times New Roman",
            size: 22,
          }),
          new TextRun({
            text: `Menyatakan dengan sesungguhnya bahwa pertanggungjawaban atas penggunaan dana BOSP Reguler ${stageText} sebesar ${formatRupiah(financialSummary.totalExpenditure)} telah sesuai dengan ketentuan Juknis BOSP yang berlaku dan dapat dipertanggungjawabkan secara hukum.\n\n`,
            font: "Times New Roman",
            size: 22,
          }),
        ],
      }),
      createSignatureTable()
    );

    if (docType === "ALL") children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // 4. BUKU KAS UMUM (BKU)
  if (docType === "ALL" || docType === "DOC_8_BKU") {
    children.push(...createKopSurat());
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "BUKU KAS UMUM (BKU)",
            bold: true,
            size: 24,
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `PERIODE: ${stageText.toUpperCase()} TAHUN ${yearText}`,
            bold: true,
            size: 20,
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({ text: "", spacing: { after: 200 } })
    );

    // BKU Table Header
    const bkuTableRows: TableRow[] = [
      new TableRow({
        children: [
          new TableCell({
            borders: cellBorderThin,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "No", bold: true })],
              }),
            ],
            width: { size: 5, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            borders: cellBorderThin,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Tanggal", bold: true })],
              }),
            ],
            width: { size: 12, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            borders: cellBorderThin,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "No Bukti", bold: true })],
              }),
            ],
            width: { size: 15, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            borders: cellBorderThin,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Uraian Transaksi", bold: true })],
              }),
            ],
            width: { size: 38, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            borders: cellBorderThin,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Penerimaan (Rp)", bold: true })],
              }),
            ],
            width: { size: 15, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            borders: cellBorderThin,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Pengeluaran (Rp)", bold: true })],
              }),
            ],
            width: { size: 15, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
    ];

    // BKU Rows
    transactions.forEach((tx, idx) => {
      bkuTableRows.push(
        new TableRow({
          children: [
            new TableCell({
              borders: cellBorderThin,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: String(idx + 1) })],
                }),
              ],
            }),
            new TableCell({
              borders: cellBorderThin,
              children: [new Paragraph({ children: [new TextRun({ text: tx.date })] })],
            }),
            new TableCell({
              borders: cellBorderThin,
              children: [new Paragraph({ children: [new TextRun({ text: tx.proofNo })] })],
            }),
            new TableCell({
              borders: cellBorderThin,
              children: [new Paragraph({ children: [new TextRun({ text: tx.description })] })],
            }),
            new TableCell({
              borders: cellBorderThin,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: tx.receipt > 0 ? formatRupiah(tx.receipt) : "-" }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: cellBorderThin,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: tx.expense > 0 ? formatRupiah(tx.expense) : "-" }),
                  ],
                }),
              ],
            }),
          ],
        })
      );
    });

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: bkuTableRows,
      }),
      new Paragraph({ text: "", spacing: { after: 200 } }),
      createSignatureTable()
    );

    if (docType === "ALL") children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // 5. FORM 3 REKONSILIASI
  if (docType === "ALL" || docType === "FORM3_REKON") {
    children.push(...createKopSurat());
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "FORM 3 - REKONSILIASI BELANJA BOSP",
            bold: true,
            size: 24,
            font: "Times New Roman",
          }),
        ],
      }),
      new Paragraph({ text: "", spacing: { after: 200 } })
    );

    const form3TableRows: TableRow[] = [
      new TableRow({
        children: [
          new TableCell({
            borders: cellBorderThin,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "No", bold: true })],
              }),
            ],
            width: { size: 5, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            borders: cellBorderThin,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Kode Rekening", bold: true })],
              }),
            ],
            width: { size: 20, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            borders: cellBorderThin,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Nama Rekening Belanja", bold: true })],
              }),
            ],
            width: { size: 45, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            borders: cellBorderThin,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Total Realisasi (Rp)", bold: true })],
              }),
            ],
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
    ];

    form3Rows.forEach((r, idx) => {
      form3TableRows.push(
        new TableRow({
          children: [
            new TableCell({
              borders: cellBorderThin,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: String(r.no || idx + 1) })],
                }),
              ],
            }),
            new TableCell({
              borders: cellBorderThin,
              children: [new Paragraph({ children: [new TextRun({ text: r.kodeRekening })] })],
            }),
            new TableCell({
              borders: cellBorderThin,
              children: [new Paragraph({ children: [new TextRun({ text: r.namaRekening })] })],
            }),
            new TableCell({
              borders: cellBorderThin,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: formatRupiah(r.totalRealisasi) })],
                }),
              ],
            }),
          ],
        })
      );
    });

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: form3TableRows,
      }),
      new Paragraph({ text: "", spacing: { after: 200 } }),
      createSignatureTable()
    );
  }

  // Create Document instance
  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  // Export to Blob and download
  const blob = await Packer.toBlob(doc);
  const cleanSchoolName = schoolInfo.name.replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = `LPJ_BOSP_${cleanSchoolName}_${yearText}_Word.docx`;
  saveAs(blob, fileName);
}
