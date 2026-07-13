import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import { jsPDF } from "jspdf";
import { useLocation, useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const rawFiles = location.state?.rawFiles || []; 
  const fileName = location.state?.fileName || "DocNexus_Converted.pdf";
  const toolType = location.state?.toolType || 'image-to-pdf';
  const pdfSettings = location.state?.pdfSettings;
  const jpgSettings = location.state?.jpgSettings;
  const fileExtension = fileName.split('.').pop() || 'pdf';

  // State to manage loading during PDF generation
  const [isDownloading, setIsDownloading] = useState(false);

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    const mb = kb / 1024;
    return mb >= 1 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(2)} KB`;
  };

  const totalFileSize = rawFiles.reduce((total, file) => total + file.size, 0);

  // ROUTE GUARD: Redirect back if no data/state is found
  useEffect(() => {
    if (!location.state || rawFiles.length === 0) {
      navigate(`/${toolType}`, { replace: true }); 
    }
  }, [location.state, rawFiles, toolType, navigate]);

  const handleDownload = async () => {
    if (!rawFiles || rawFiles.length === 0) {
      alert("No source file data available. Please upload files again.");
      return;
    }

    setIsDownloading(true); // Start loading

    try {
      if (toolType === 'pdf-to-jpg') {
        const sourceFile = rawFiles[0];
        const data = new Uint8Array(await sourceFile.arrayBuffer());
        const pdfDocument = await pdfjsLib.getDocument({ data }).promise;
        const pageNumbers = jpgSettings?.pages?.length
          ? jpgSettings.pages
          : Array.from({ length: pdfDocument.numPages }, (_, index) => index + 1);
        const outputFormat = jpgSettings?.format === 'png' ? 'png' : 'jpeg';
        const mimeType = outputFormat === 'png' ? 'image/png' : 'image/jpeg';
        const outputQuality = (jpgSettings?.quality || 90) / 100;
        const baseName = sourceFile.name.replace(/\.pdf$/i, '') || 'page';
        const filesToDownload = [];

        for (let index = 0; index < pageNumbers.length; index += 1) {
          const pageNumber = pageNumbers[index];
          const page = await pdfDocument.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport }).promise;

          const imageBlob = await new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error(`Failed to render page ${pageNumber}`));
              }
            }, mimeType, outputQuality);
          });

          filesToDownload.push({
            name: `${baseName}_${pageNumber}.${outputFormat}`,
            blob: imageBlob,
          });
        }

        if (filesToDownload.length === 1) {
          saveAs(filesToDownload[0].blob, filesToDownload[0].name);
          return;
        }

        // Load JSZip dynamically to avoid Vite static import resolution issues in dev
        const JSZipModule = await import('jszip');
        const JSZip = JSZipModule.default || JSZipModule;
        const zip = new JSZip();
        filesToDownload.forEach(({ name, blob }) => {
          zip.file(name, blob);
        });

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, `${baseName}.zip`);
        return;
      }

      let pageSizeSetting = 'a4';
      if (typeof pdfSettings?.pageSize === 'string') {
        pageSizeSetting = pdfSettings.pageSize.toLowerCase();
      }

      const isOriginalSize = pageSizeSetting === "original";
      let pdf = null;

      for (let i = 0; i < rawFiles.length; i++) {
        const file = rawFiles[i];

        // 1. Convert File to base64 DataURL
        const imgDataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(file);
        });

        // 2. Get original image dimensions
        const img = await new Promise((resolve, reject) => {
          const tempImg = new Image();
          tempImg.onload = () => resolve(tempImg);
          tempImg.onerror = (e) => reject(e);
          tempImg.src = imgDataUrl;
        });

        const imgWidth = img.width;
        const imgHeight = img.height;

        if (imgWidth <= 0 || imgHeight <= 0) {
          throw new Error(`Invalid image size: ${imgWidth} x ${imgHeight}`);
        }

        const imgRatio = imgWidth / imgHeight;
        const currentImgOrientation = imgWidth > imgHeight ? "l" : "p";

        // 3. Dynamic Page Handling (Fixes mixed landscape/portrait bug)
        if (i === 0) {
          if (isOriginalSize) {
            pdf = new jsPDF({
              orientation: currentImgOrientation,
              unit: "px",
              format: [imgWidth, imgHeight]
            });
          
          } else {
            pdf = new jsPDF({
              orientation: pdfSettings?.orientation === "landscape" ? "l" : "p",
              unit: "mm",
              format: pageSizeSetting
            });
          }
        } else {
          // For subsequent pages (i > 0)
          if (isOriginalSize) {
            // FIX: Add page to existing PDF object without re-instantiating it
            pdf.addPage([imgWidth, imgHeight], currentImgOrientation);
          } else {
            const standardOrientation = pdfSettings?.orientation === "landscape" ? "l" : "p";
            pdf.addPage(pageSizeSetting, standardOrientation);
          }
        }

        // 4. Re-encode images so the selected output quality is applied consistently.
        // PNG/WebP are also converted to JPEG here because their source encoders ignore JPEG quality values.
        const compressionPresets = {
          low: { jpegQuality: 0.58, maxLongEdge: 1200 },
          medium: { jpegQuality: 0.72, maxLongEdge: 1600 },
          high: { jpegQuality: 0.82, maxLongEdge: 2200 },
        };
        const compressionPreset = compressionPresets[pdfSettings?.imageQuality?.toLowerCase()] ?? compressionPresets.high;
        const scale = Math.min(1, compressionPreset.maxLongEdge / Math.max(imgWidth, imgHeight));
        const outputWidth = Math.max(1, Math.round(imgWidth * scale));
        const outputHeight = Math.max(1, Math.round(imgHeight * scale));
        const imageCanvas = document.createElement('canvas');
        imageCanvas.width = outputWidth;
        imageCanvas.height = outputHeight;
        const imageContext = imageCanvas.getContext('2d');
        imageContext.imageSmoothingEnabled = true;
        imageContext.imageSmoothingQuality = 'high';
        imageContext.fillStyle = '#FFFFFF';
        imageContext.fillRect(0, 0, outputWidth, outputHeight);
        imageContext.drawImage(img, 0, 0, outputWidth, outputHeight);
        const pdfImageData = imageCanvas.toDataURL('image/jpeg', compressionPreset.jpegQuality);

        // 5. Margins Setup
        let margin = 0;

        const pageWidth = pdf.internal.pageSize.getWidth();

        if (pdfSettings?.margins === "normal") {
          margin = pageWidth * 0.05;   // 5%
        } else if (pdfSettings?.margins === "small") {
          margin = pageWidth * 0.025;  // 2.5%
        } else {
          margin = 0;
        }

        const imageType = "JPEG";

        // ===== ORIGINAL SIZE MODE =====
        if (isOriginalSize) {
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const marginRatio = pdfSettings?.margins === "normal" ? 0.05 : pdfSettings?.margins === "small" ? 0.025 : 0;
          const marginX = pageWidth * marginRatio;
          const marginY = pageHeight * marginRatio;

          pdf.addImage(
            pdfImageData,
            imageType,
            marginX,
            marginY,
            pageWidth - (marginX * 2),
            pageHeight - (marginY * 2)
          );
          continue;
        }

        // ===== STANDARD SIZE MODE (A4, etc.) =====
        const currentPageWidth = pdf.internal.pageSize.getWidth() || 210;
        const currentPageHeight = pdf.internal.pageSize.getHeight() || 297;

        const availableWidth = currentPageWidth - margin * 2;
        const availableHeight = currentPageHeight - margin * 2;

        let finalWidth;
        let finalHeight;

        if (pdfSettings?.imageFit?.toLowerCase() === "fill page") {
          finalWidth = availableWidth;
          finalHeight = availableHeight;
        } else {
          if (availableWidth <= 0 || availableHeight <= 0) {
            throw new Error(`Invalid page size: ${availableWidth} x ${availableHeight}`);
          }
          const pageRatio = availableWidth / availableHeight;

          if (imgRatio > pageRatio) {
            finalWidth = availableWidth;
            finalHeight = availableWidth / imgRatio;
          } else {
            finalHeight = availableHeight;
            finalWidth = availableHeight * imgRatio;
          }
        }

        const xOffset = margin + (availableWidth - finalWidth) / 2;
        const yOffset = margin + (availableHeight - finalHeight) / 2;
        
        if (!isFinite(finalWidth) || !isFinite(finalHeight) || !isFinite(xOffset) || !isFinite(yOffset)) {
          throw new Error("Invalid coordinates calculated for PDF generation.");
        }

        pdf.addImage(pdfImageData, imageType, xOffset, yOffset, finalWidth, finalHeight);
      }

      // Save PDF
      pdf.save(fileName);
    } catch (error) {
      console.error(error);
      alert(error.message || "An error occurred while generating the PDF.");
    } finally {
      setIsDownloading(false); // Stop loading
    }
  };

  const getBadgeStyles = (ext) => {
    const e = ext.toLowerCase();
    if (e === 'pdf') return 'bg-red-50 text-red-600 border-red-100';
    if (e === 'xlsx' || e === 'xls') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (e === 'pptx' || e === 'ppt') return 'bg-orange-50 text-orange-600 border-orange-100';
    if (e === 'jpg' || e === 'jpeg' || e === 'png') return 'bg-purple-50 text-purple-600 border-purple-100';
    return 'bg-blue-50 text-blue-600 border-blue-100';
  };

  if (!location.state || rawFiles.length === 0) return null;

  return (
    <div className="w-full min-h-[85vh] bg-[#fafbfe] pt-4 pb-12 px-4 sm:px-6 flex items-center justify-center select-none">
      <div className="max-w-5xl w-full bg-white rounded-lg border border-slate-400 flex flex-col items-center py-12 px-6 sm:px-12 relative overflow-hidden shadow-sm">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center relative mb-6 border border-emerald-100 shadow-sm">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Title */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Successfully Converted!</h2>
          <p className="text-slate-400 font-medium text-sm sm:text-base">Your file has been converted and is ready to download.</p>
        </div>

        {/* File Info Box */}
        <div className="w-full max-w-3xl bg-white border border-slate-400 rounded-lg p-4 sm:p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.005)] px-6 mb-8">
          <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
            <div className={`p-2.5 border rounded-lg flex-shrink-0 font-bold text-xs sm:text-sm uppercase tracking-wider ${getBadgeStyles(fileExtension)}`}>
              {fileExtension === 'docx' ? 'W' : fileExtension === 'xlsx' ? 'X' : fileExtension}
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <p className="text-sm sm:text-base font-bold text-slate-700 truncate">{fileName}</p>
              <span className="bg-emerald-50 text-emerald-600 font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-sm border border-emerald-200 flex-shrink-0">
                Completed
              </span>
            </div>
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-700 flex-shrink-0">{formatFileSize(totalFileSize)}</span>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-8">
          <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className={`flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-bold text-sm sm:text-base rounded-lg shadow-lg shadow-indigo-600/15 hover:opacity-95 transition-all cursor-pointer ${isDownloading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {toolType === 'pdf-to-jpg' && (jpgSettings?.pages?.length || 0) > 1
                  ? 'Download ZIP'
                  : toolType === 'pdf-to-jpg'
                    ? 'Download Image'
                    : 'Download PDF'}
              </>
            )}
          </button>

          <button 
            onClick={() => navigate(`/${toolType}`)} 
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 py-4 bg-white border border-slate-300 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 font-bold text-sm sm:text-base rounded-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M21 3v5h-5" />
            </svg>
            Convert Again
          </button>

          <button 
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 py-4 bg-white border border-slate-300 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 font-bold text-sm sm:text-base rounded-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.632-2.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 6.316l-4.632-2.316m0 0a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            Share
          </button>
        </div>

      </div>
    </div>
  );
};

export default Result;
