import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Processing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const uploadedFiles = location.state?.files || [];
  const toolType = location.state?.toolType || 'image-to-pdf';
  
  // ⚡ ROUTE GUARD GUARDRAIL: Agar refresh kiya aur files nahi mili, toh direct wapas redirect karein
  useEffect(() => {
    if (!location.state || uploadedFiles.length === 0) {
      navigate('/', { replace: true });
    }
  }, [location.state, uploadedFiles.length, navigate]);

  const fileName = uploadedFiles[0]?.name || "Document.pdf";
  const selectedPageCount = location.state?.jpgSettings?.pages?.length || 0;
  
  const getOutputFileName = (name, type, pageCount = 1) => {
    const baseName = name.substring(0, name.lastIndexOf('.')) || name;
    switch (type) {
      case 'image-to-pdf': return `${baseName}.pdf`;
      case 'pdf-to-excel': return `${baseName}.xlsx`;
      case 'pdf-to-ppt': return `${baseName}.pptx`;
      case 'pdf-to-jpg': {
        if (pageCount > 1) return `${baseName}.zip`;
        const outputFormat = location.state?.jpgSettings?.format === 'png' ? 'png' : 'jpeg';
        return `${baseName}.${outputFormat}`;
      }
      case 'pdf-to-text': return `${baseName}.txt`;
      default: return `${baseName}.docx`;
    }
  };

  const outputName = getOutputFileName(fileName, toolType, selectedPageCount);

  // 🛡️ BROWSER REFRESH/CLOSE PREVENTER: Processing ke dauran tab close karne se rokega
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (progress < 100 && uploadedFiles.length > 0) {
        e.preventDefault();
        e.returnValue = 'File is processing. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [progress, uploadedFiles.length]);

  // ⏳ PROGRESS BAR SIMULATION
  useEffect(() => {
    if (uploadedFiles.length === 0) return;

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 15;
        return Math.min(oldProgress + diff, 100);
      });
    }, 400);

    return () => clearInterval(timer);
  }, [uploadedFiles.length]);

  // 🚀 REDIRECT TO RESULT PAGE ON COMPLETION
  useEffect(() => {
    if (progress === 100) {
      const delay = setTimeout(() => {
        navigate('/result', { 
          state: { 
            fileName: outputName, 
            toolType: toolType,
            rawFiles: uploadedFiles,
            pdfSettings: location.state.pdfSettings,
            jpgSettings: location.state.jpgSettings
          } 
        });
      }, 600);
      return () => clearTimeout(delay);
    }
    // Dependency array optimized to prevent infinite triggers
  }, [progress, navigate, outputName, toolType]);

  // Agar condition galat hai toh khali component return karein jab tak redirect na ho jaye
  if (!location.state || uploadedFiles.length === 0) return null;

  return (
    <div className="w-full min-h-[85vh] bg-[#fafbfe] pt-4 pb-12 px-4 sm:px-6 flex items-center justify-center select-none">
      <div className="max-w-5xl w-full bg-white rounded-lg border border-slate-400 shadow-[0_20px_50px_rgba(99,102,241,0.02)] flex flex-col items-center pt-16 overflow-hidden">
        
        {/* Animated Spinner Icon */}
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center relative text-indigo-600 mb-6 shadow-sm">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div className="absolute inset-0 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>

        {/* Header Text */}
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Converting...</h2>
          <p className="text-slate-400 font-medium text-sm sm:text-base">Please wait while we convert your file</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-2xl px-6 mb-8">
          <div className="w-full h-8 bg-slate-50 border border-slate-300 rounded-full relative overflow-hidden p-1 shadow-inner">
            <div 
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full flex items-center justify-end pr-4 transition-all duration-300 min-w-[2rem]"
            >
              {progress > 10 && <span className="text-white text-xs font-black">{Math.round(progress)}%</span>}
            </div>
          </div>
        </div>

        {/* File Information Card */}
        <div className="w-full max-w-xl mx-auto bg-white border border-slate-400 rounded-lg p-4 flex items-center justify-between px-6 mb-6 gap-2">
          {/* Input File Details */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 bg-red-50 text-red-500 rounded-lg text-xs font-bold uppercase shrink-0">
              {fileName.split('.').pop()}
            </div>
            <p className="text-sm font-bold text-slate-700 truncate" title={fileName}>{fileName}</p>
          </div>
          
          {/* Arrow Spacer */}
          <svg className="w-4 h-4 text-slate-400 shrink-0 mx-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          
          {/* Output File Details */}
          <div className="flex items-center gap-3 min-w-0 flex-1 justify-end text-right">
            <p className="text-sm font-bold text-slate-700 truncate" title={outputName}>{outputName}</p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase shrink-0">
              {outputName.split('.').pop()}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Processing;
