import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import { useLocation, useNavigate } from 'react-router-dom';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Processing page se dynamic state extract karein
  const rawFiles = location.state?.rawFiles || location.state?.files || []; 
  const fileName = location.state?.fileName || "DocNexus_Converted.pdf";
  const toolType = location.state?.toolType || 'image-to-pdf';
  const pdfUrl = location.state?.pdfUrl || null; // Backend link string mapping
  const fileExtension = fileName.split('.').pop() || 'pdf';

  const [isDownloading, setIsDownloading] = useState(false);
  const [outputSizeBytes, setOutputSizeBytes] = useState(0);

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    const mb = kb / 1024;
    return mb >= 1 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(2)} KB`;
  };

  // Safe string parsing for size data formats
  const totalFileSize = rawFiles.reduce((total, file) => {
    if (file.size && typeof file.size === 'string' && file.size.includes('MB')) {
      return total + parseFloat(file.size) * 1024 * 1024;
    }
    const sizeVal = file.size || file.rawFile?.size || 0;
    return total + (typeof sizeVal === 'string' ? parseFloat(sizeVal) : sizeVal);
  }, 0);
  
  const displayedFileSize = outputSizeBytes || totalFileSize;

  // ⚡ ROUTE GUARD: Redirect if bypass occurs
  useEffect(() => {
    if (!location.state) {
      navigate('/', { replace: true }); 
    }
  }, [location.state, navigate]);

  // Construct absolute dynamic downloadable endpoint target link safely
  const getFullDownloadUrl = () => {
    if (!pdfUrl) return null;
    if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
      return pdfUrl;
    }
    const backendBaseUrl = "http://localhost:5000";
    // Checks if path needs folder mappings prefixes correctly
    return pdfUrl.startsWith('converted/') ? `${backendBaseUrl}/${pdfUrl}` : `${backendBaseUrl}/converted/${pdfUrl}`;
  };

  const finalDownloadUrl = getFullDownloadUrl();

  // Fetch true compiled file size from backend endpoint
  useEffect(() => {
    if (finalDownloadUrl) {
      fetch(finalDownloadUrl, { method: 'HEAD' })
        .then(res => {
          const size = res.headers.get('content-length');
          if (size) setOutputSizeBytes(parseInt(size, 10));
        })
        .catch(err => console.error("Error fetching output asset metadata size parameters:", err));
    }
  }, [finalDownloadUrl]);

  // Server download handler pipeline using file-saver stream loops
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (finalDownloadUrl) {
        saveAs(finalDownloadUrl, fileName);
      } else {
        alert("Server download link missing. Redirecting to workspace.");
        navigate('/');
      }
    } catch (error) {
      console.error("Download pipeline collapsed error logging:", error);
      alert("Failed to secure download link stream. Please retry again.");
    } finally {
      setIsDownloading(false);
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

  if (!location.state) return null;

  return (
    <div className="w-full min-h-[85vh] bg-[#fafbfe] pt-4 pb-12 px-4 sm:px-6 flex items-center justify-center select-none text-slate-700">
      <div className="max-w-5xl w-full bg-white rounded-lg border border-slate-300 flex flex-col items-center py-12 px-6 sm:px-12 relative overflow-hidden shadow-sm">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-lg border border-emerald-100 flex items-center justify-center relative mb-6 shadow-sm">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Title Group */}
        <div className="text-center space-y-1.5 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Successfully Converted!</h2>
          <p className="text-slate-400 font-medium text-xs sm:text-sm">Your file has been processed and is ready for download.</p>
        </div>

        {/* File Info Component (Strictly rounded-lg borders) */}
        <div className="w-full max-w-3xl bg-slate-50/50 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between px-6 mb-8 gap-3 sm:gap-2">
          <div className="flex items-center gap-4 min-w-0 flex-1 w-full sm:w-auto">
            <div className={`p-2 border rounded-lg flex-shrink-0 font-bold text-xs sm:text-sm uppercase tracking-wider ${getBadgeStyles(fileExtension)}`}>
              {fileExtension === 'docx' ? 'W' : fileExtension === 'xlsx' ? 'X' : fileExtension}
            </div>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">{fileName}</p>
              <span className="bg-emerald-50 text-emerald-600 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-200 flex-shrink-0">
                Completed
              </span>
            </div>
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-500 flex-shrink-0 w-full sm:w-auto text-left sm:text-right">
            {formatFileSize(displayedFileSize)}
          </span>
        </div>

        {/* Action Controls Array Frame (Unified rounded-lg grids) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-4">
          <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className={`flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold text-xs sm:text-sm rounded-lg shadow-md hover:opacity-95 transition-all cursor-pointer ${isDownloading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {fileExtension === 'zip' ? 'Download ZIP' : `Download ${fileExtension.toUpperCase()}`}
              </>
            )}
          </button>

          <button 
            onClick={() => navigate(`/${toolType}`)} 
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 font-bold text-xs sm:text-sm rounded-lg transition-all cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M21 3v5h-5" />
            </svg>
            Convert Again
          </button>

          <button 
            disabled={isDownloading}
            onClick={() => {
              const activeShareUrl = finalDownloadUrl || window.location.href;
              if (navigator.share && finalDownloadUrl) {
                navigator.share({ title: fileName, url: activeShareUrl }).catch(err => console.log(err));
              } else {
                navigator.clipboard.writeText(activeShareUrl);
                alert("Download asset link successfully copied to clipboard!");
              }
            }}
            className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 font-bold text-xs sm:text-sm rounded-lg transition-all cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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