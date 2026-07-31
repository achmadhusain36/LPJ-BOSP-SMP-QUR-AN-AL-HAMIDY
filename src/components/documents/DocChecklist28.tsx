import React from "react";
import { SchoolInfo, ChecklistItem } from "../../types/lpj";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentSignature } from "./DocumentSignature";

interface DocChecklist28Props {
  schoolInfo: SchoolInfo;
  checklistItems: ChecklistItem[];
}

export const DocChecklist28: React.FC<DocChecklist28Props> = ({
  schoolInfo,
  checklistItems,
}) => {
  const adaCount = checklistItems.filter((i) => i.status === "ADA").length;
  const tidakCount = checklistItems.filter((i) => i.status === "TIDAK").length;

  // Group items by category
  const groups = [
    "A. Dokumen Administrasi Keuangan",
    "B. Dokumen Bukti Belanja & Perpajakan",
    "C. Dokumen Pendukung & Pelaporan",
  ] as const;

  return (
    <div className="bg-white p-6 shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0 text-gray-900 text-xs leading-relaxed font-sans max-w-5xl mx-auto">
      <DocumentHeader
        schoolInfo={schoolInfo}
        docTitle="CHECKLIST INSTRUMEN KELENGKAPAN LPJ BOSP"
        docSubtitle={`INSTRUMEN PEMERIKSAAN DOKUMEN TAHAP 1 TAHUN ${schoolInfo.year}`}
        docCode="FORM CHECKLIST 28"
      />

      <div className="mb-4 flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-300 text-xs print:bg-transparent print:border-gray-800">
        <div>
          <span className="font-bold">Sekolah:</span> {schoolInfo.name} ({schoolInfo.npsn}) | <span className="font-bold">Kecamatan:</span> {schoolInfo.district}
        </div>
        <div className="flex gap-4 font-bold text-xs">
          <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded print:border print:border-gray-800">ADA: {adaCount} Berkas</span>
          <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded print:border print:border-gray-800">TIDAK: {tidakCount} Berkas</span>
        </div>
      </div>

      <div className="space-y-4">
        {groups.map((groupName) => {
          const items = checklistItems.filter((i) => i.group === groupName);
          return (
            <div key={groupName} className="border border-gray-800">
              <div className="bg-emerald-900 text-white font-bold px-3 py-1.5 uppercase text-[11px] print:bg-gray-300 print:text-black">
                {groupName}
              </div>
              <table className="w-full border-collapse text-[10px] print:text-[9px]">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-800 text-center font-bold print:bg-gray-200">
                    <th className="px-2 py-1 border-r border-gray-800 w-10">No</th>
                    <th className="px-2 py-1 border-r border-gray-800 text-left">Nama Berkas / Dokumen Kelengkapan LPJ</th>
                    <th className="px-2 py-1 border-r border-gray-800 w-16">Status</th>
                    <th className="px-2 py-1 text-left">Keterangan / Catatan Kelengkapan & Rekomendasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {items.map((item) => (
                    <tr key={item.id} className={item.status === "ADA" ? "bg-white" : "bg-amber-50/50 print:bg-white"}>
                      <td className="px-2 py-1.5 text-center font-mono font-bold border-r border-gray-800">
                        {item.code}
                      </td>
                      <td className="px-2 py-1.5 font-medium border-r border-gray-800">
                        <span className="font-semibold">{item.title}</span>
                        <span className="block text-[9px] text-gray-500 italic">{item.description}</span>
                      </td>
                      <td className="px-2 py-1.5 text-center border-r border-gray-800 font-bold">
                        {item.status === "ADA" ? (
                          <span className="text-emerald-800 font-extrabold print:text-black">[ ✓ ] ADA</span>
                        ) : (
                          <span className="text-amber-800 font-extrabold print:text-black">[ X ] TIDAK</span>
                        )}
                      </td>
                      <td className="px-2 py-1.5 text-gray-800 text-[9.5px]">
                        {item.recommendation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded text-[11px] print:bg-transparent print:border-gray-800">
        <p className="font-bold text-amber-900 print:text-black mb-1">Catatan Tim Verifikasi LPJ BOSP Kabupaten Pringsewu:</p>
        <p> Dokumen berstatus <strong>ADA ({adaCount} berkas)</strong> telah berhasil digenerate dan diverifikasi secara otomatis oleh sistem.</p>
        <p> Dokumen berstatus <strong>TIDAK ({tidakCount} berkas)</strong> merupakan dokumen pendukung fisik (seperti foto pengerjaan sumur bor, foto barang, SK mengajar, & SPT e-Filing) yang wajib dilengkapi cetakan fisiknya sebelum penyerahan akhir ke Dinas Pendidikan.</p>
      </div>

      <DocumentSignature schoolInfo={schoolInfo} dateStr="30 Juni 2026" />
    </div>
  );
};
