import React, { useState } from "react";
import { SchoolInfo } from "../../types/lpj";

interface DocumentHeaderProps {
  schoolInfo: SchoolInfo;
  docTitle?: string;
  docSubtitle?: string;
  docCode?: string;
  isLandscape?: boolean;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  schoolInfo,
  docTitle,
  docSubtitle,
  docCode,
  isLandscape = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // 2. HALAMAN LANDSCAPE (HORIZONTAL): KOSONGKAN BAGIAN HEADER SEPENUHNYA
  if (isLandscape) {
    return null;
  }

  const hasImage = Boolean(schoolInfo.letterheadImage && !imageError);

  const settings = schoolInfo.letterheadSettings || {
    heightMm: 40,
    scalePercent: 100,
    marginTopMm: 0,
    marginBottomMm: 8,
    borderStyle: "double",
  };

  const heightMm = settings.heightMm ?? 40;
  const isHighImage = heightMm > 45;

  const getBorderCss = (bStyle?: string) => {
    switch (bStyle) {
      case "solid":
        return "border-b-2 border-slate-900";
      case "emerald":
        return "border-b-4 border-emerald-700";
      case "none":
        return "border-b-0";
      case "double":
      default:
        return "border-b-4 border-double border-slate-900";
    }
  };

  return (
    <div className="w-full relative print:mb-2 text-slate-900">
      {/* 1. HALAMAN PORTRAIT (VERTIKAL) */}
      {hasImage ? (
        /* A1. GAMBAR KOP PNG */
        <div
          className={`w-full relative pb-2 mb-3 ${getBorderCss(settings.borderStyle)}`}
        >
          <div className="relative w-full flex items-center justify-between">
            {isHighImage ? (
              /* Jika tinggi > 45 mm: skala ulang tinggi=45 mm, letakkan rata tengah secara horizontal */
              <img
                src={schoolInfo.letterheadImage}
                alt="Kop Surat Sekolah"
                onError={() => setImageError(true)}
                style={{
                  height: "45mm",
                  maxHeight: "45mm",
                  width: "auto",
                }}
                className="mx-auto block object-contain"
              />
            ) : (
              /* Jika tinggi <= 45 mm: gambar full width (lebar 170 mm) dan rata kiri (menempel penuh kiri-kanan) */
              <img
                src={schoolInfo.letterheadImage}
                alt="Kop Surat Sekolah"
                onError={() => setImageError(true)}
                style={{
                  width: "100%",
                  height: `${heightMm}mm`,
                  maxHeight: "45mm",
                }}
                className="w-full block object-fill sm:object-contain"
              />
            )}

            {docCode && (
              <div className="absolute top-0 right-0 hidden sm:block print:block">
                <div className="px-2 py-0.5 bg-slate-100 text-slate-900 border border-slate-700 rounded text-[9px] font-bold print:border-gray-800 print:bg-white">
                  {docCode}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* A2. TEKS HEADER DEFAULT (JIKA TIDAK ADA GAMBAR) */
        <div className="w-full mb-3 border-b-4 border-double border-slate-900 pb-2 relative flex justify-between items-start">
          <div className="text-left space-y-0.5">
            {/* Nama Sekolah (font 14, bold, rata kiri) */}
            <h2 className="text-[14pt] font-extrabold uppercase tracking-wide text-slate-900 leading-tight">
              {schoolInfo.name}
            </h2>
            {/* Alamat (font 10, rata kiri) */}
            <p className="text-[10pt] font-normal text-slate-800 leading-tight">
              {schoolInfo.address}, {schoolInfo.district}, {schoolInfo.regency}, {schoolInfo.province}
            </p>
            {/* NPSN dan Tahun Anggaran (font 9, rata kiri) */}
            <p className="text-[9pt] font-semibold text-slate-700 leading-tight">
              NPSN: {schoolInfo.npsn} | Tahun Anggaran {schoolInfo.year} ({schoolInfo.stage})
            </p>
          </div>

          {docCode && (
            <div className="text-right shrink-0 ml-4">
              <div className="inline-block px-2 py-0.5 bg-slate-100 text-slate-900 border border-slate-700 rounded text-[9px] font-bold print:border-gray-800 print:bg-white">
                {docCode}
              </div>
            </div>
          )}
        </div>
      )}

      {/* DOCUMENT TITLE & SUBTITLE */}
      {(docTitle || docSubtitle) && (
        <div className="mt-1 pb-2 text-center">
          {docTitle && (
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-900 print:text-sm">
              {docTitle}
            </h3>
          )}
          {docSubtitle && (
            <p className="text-xs text-slate-700 font-medium print:text-[10px]">
              {docSubtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

