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

  const hasImage = Boolean(schoolInfo.letterheadImage && !imageError);
  const shouldShowImage =
    hasImage && (!isLandscape || schoolInfo.showLetterheadOnLandscape);

  // 2. HALAMAN LANDSCAPE (HORIZONTAL): KOSONGKAN BAGIAN HEADER SEPENUHNYA
  if (isLandscape && !shouldShowImage) {
    return null;
  }

  const settings = schoolInfo.letterheadSettings || {
    heightMm: 40,
    scalePercent: 100,
    marginTopMm: 10,
    marginBottomMm: 8,
    horizontalMarginMm: 0,
    align: "center",
    borderStyle: "double",
  };

  const heightMm = settings.heightMm ?? 40;
  const scalePercent = settings.scalePercent ?? 100;
  const marginTopMm = settings.marginTopMm ?? 10;
  const marginBottomMm = settings.marginBottomMm ?? 8;
  const horizontalMarginMm = settings.horizontalMarginMm ?? 0;
  const align = settings.align ?? "center";
  const borderStyle = settings.borderStyle ?? "double";

  const getBorderCss = (bStyle: string) => {
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

  const getAlignCss = (aStyle: string) => {
    switch (aStyle) {
      case "left":
        return "justify-start";
      case "right":
        return "justify-end";
      case "full":
        return "justify-center w-full";
      case "center":
      default:
        return "justify-center";
    }
  };

  return (
    <div className="w-full relative print:mb-2 text-slate-900">
      {/* 1. PORTRAIT WITH IMAGE */}
      {shouldShowImage ? (
        <div
          className={`w-full relative ${getBorderCss(borderStyle)}`}
          style={{
            marginTop: `${marginTopMm}mm`,
            marginBottom: `${marginBottomMm}mm`,
            paddingLeft: `${horizontalMarginMm}mm`,
            paddingRight: `${horizontalMarginMm}mm`,
            paddingBottom: "2mm",
          }}
        >
          <div className={`flex items-center relative w-full ${getAlignCss(align)}`}>
            <img
              src={schoolInfo.letterheadImage}
              alt="Kop Surat Sekolah"
              onError={() => setImageError(true)}
              style={{
                height: `${Math.min(heightMm, 45)}mm`,
                maxHeight: "45mm",
                width: align === "full" ? "100%" : "170mm",
                maxWidth: "100%",
                transform: `scale(${scalePercent / 100})`,
                transformOrigin:
                  align === "left"
                    ? "left center"
                    : align === "right"
                    ? "right center"
                    : "center center",
                objectFit: "contain",
              }}
              className="transition-all duration-200 mx-auto"
            />
            {docCode && (
              <div className="absolute top-0 right-0 hidden sm:block print:block">
                <div className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-700 rounded text-[9px] font-bold print:border-gray-800 print:bg-white print:text-black">
                  {docCode}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 1. PORTRAIT WITHOUT IMAGE: DEFAULT TEXT HEADER */
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

