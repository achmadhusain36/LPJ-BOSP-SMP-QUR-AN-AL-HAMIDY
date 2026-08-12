import React, { useState } from "react";
import { SchoolInfo } from "../../types/lpj";

interface DocumentHeaderProps {
  schoolInfo: SchoolInfo;
  docTitle?: string;
  docSubtitle?: string;
  docCode?: string;
  isLandscape?: boolean;
  hideHeader?: boolean;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  schoolInfo,
  docTitle,
  docSubtitle,
  docCode,
  isLandscape = false,
  hideHeader = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imgDimensions, setImgDimensions] = useState<{
    naturalWidth: number;
    naturalHeight: number;
  } | null>(null);

  // Jika opsi Tanpa Kop Surat / Header aktif atau halaman Landscape
  if (hideHeader || schoolInfo.hideHeader || isLandscape) {
    return null;
  }

  const hasImage = Boolean(schoolInfo.letterheadImage && !imageError);

  const settings = schoolInfo.letterheadSettings || {
    marginTopMm: 0,
    marginBottomMm: 8,
    borderStyle: "double",
  };

  const marginTopMm = settings.marginTopMm ?? 0;
  const marginBottomMm = settings.marginBottomMm ?? 8;

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    if (target.naturalWidth && target.naturalHeight) {
      setImgDimensions({
        naturalWidth: target.naturalWidth,
        naturalHeight: target.naturalHeight,
      });
    }
  };

  // LOGIKA PENENTUAN PRESISI RATIO ASPEK KOP PORTRAIT
  // Lebar efektif A4 = 210mm - 20mm (kiri) - 20mm (kanan) = 170mm
  let isTallImage = false;
  if (imgDimensions && imgDimensions.naturalWidth > 0) {
    const aspect = imgDimensions.naturalHeight / imgDimensions.naturalWidth;
    const calculatedHeight = 170 * aspect; // dalam mm
    if (calculatedHeight > 45) {
      isTallImage = true;
    }
  }

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
    <div
      className="w-full relative print:mb-2 text-slate-900"
      style={{
        marginTop: `${marginTopMm}mm`,
      }}
    >
      {/* HALAMAN PORTRAIT (VERTIKAL) */}
      {hasImage ? (
        /* GAMBAR KOP PNG / SVG */
        <div
          className={`w-full relative pb-2 ${getBorderCss(settings.borderStyle)}`}
          style={{
            marginBottom: `${marginBottomMm}mm`,
          }}
        >
          <div className="relative w-full flex items-center justify-between">
            {isTallImage ? (
              /* Jika tinggi dihitung > 45 mm: tinggi = 45 mm, lebar = 45 mm / aspect, posisi RATA TENGAH (simetris) */
              <img
                src={schoolInfo.letterheadImage}
                alt="Kop Surat Sekolah"
                onLoad={handleImageLoad}
                onError={() => setImageError(true)}
                style={{
                  height: "45mm",
                  maxHeight: "45mm",
                  width: "auto",
                }}
                className="mx-auto block object-contain"
              />
            ) : (
              /* Jika tinggi dihitung <= 45 mm: lebar = 170 mm (full width menempel margin kiri-kanan) & rata kiri */
              <img
                src={schoolInfo.letterheadImage}
                alt="Kop Surat Sekolah"
                onLoad={handleImageLoad}
                onError={() => setImageError(true)}
                style={{
                  width: "100%",
                  maxHeight: "45mm",
                  objectFit: "fill",
                }}
                className="w-full block"
              />
            )}

            {docCode && (
              <div className="absolute top-0 right-0 hidden sm:block print:block">
                <div className="px-2 py-0.5 bg-slate-100 text-slate-900 border border-slate-700 rounded text-[9px] font-bold print:border-slate-400 print:bg-white">
                  {docCode}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TEKS HEADER DEFAULT (JIKA TIDAK ADA GAMBAR) */
        <div
          className="w-full border-b-4 border-double border-slate-900 pb-2 relative flex justify-between items-start"
          style={{
            marginBottom: `${marginBottomMm}mm`,
          }}
        >
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
              <div className="inline-block px-2 py-0.5 bg-slate-100 text-slate-900 border border-slate-700 rounded text-[9px] font-bold print:border-slate-400 print:bg-white">
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


