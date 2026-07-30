import React from 'react';
import ReactDOM from 'react-dom';
import { X, ChevronRight, FileText, Image, FileCode, Presentation, Sheet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConvertPdfModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const convertToPdfTools = [
    { name: 'JPG to PDF', path: '/jpg-to-pdf', icon: <Image className="w-4 h-4 text-amber-500" /> },
    { name: 'WORD to PDF', path: '/word-to-pdf', icon: <FileText className="w-4 h-4 text-blue-600" /> },
    { name: 'POWERPOINT to PDF', path: '/powerpoint-to-pdf', icon: <Presentation className="w-4 h-4 text-orange-500" /> },
    { name: 'EXCEL to PDF', path: '/excel-to-pdf', icon: <Sheet className="w-4 h-4 text-emerald-600" /> },
    { name: 'HTML to PDF', path: '/html-to-pdf', icon: <FileCode className="w-4 h-4 text-amber-600" /> },
  ];

  const convertFromPdfTools = [
    { name: 'PDF to JPG', path: '/pdf-to-jpg', icon: <Image className="w-4 h-4 text-amber-500" /> },
    { name: 'PDF to WORD', path: '/pdf-to-word', icon: <FileText className="w-4 h-4 text-blue-600" /> },
    { name: 'PDF to POWERPOINT', path: '/pdf-to-powerpoint', icon: <Presentation className="w-4 h-4 text-orange-500" /> },
    { name: 'PDF to EXCEL', path: '/pdf-to-excel', icon: <Sheet className="w-4 h-4 text-emerald-600" /> },
    { name: 'PDF to PDF/A', path: '/pdf-to-pdfa', icon: <FileText className="w-4 h-4 text-indigo-600" /> },
  ];

  // Handler updated to prevent home screen micro-flicker
  const handleToolClick = (path) => {
    // 1. Pehle path par navigate hone do
    navigate(path);
    
    // 2. Micro-delay ke sath modal close karo taaki routing DOM render completely switch ho jaye
    setTimeout(() => {
      if (onClose) onClose();
    }, 120);
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate/20 backdrop-blur-2xl animate-in fade-in duration-200">
      
      {/* Click Outside Overlay to Close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card Surface */}
      <div className="relative z-10 w-full max-w-3xl bg-white/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
        
        {/* Top Floating Badge Icon */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-white/20 rounded-lg border border-purple-500/20 flex items-center justify-center shadow-xl shadow-purple-500/10">
          <FileText className="w-7 h-7 text-purple-600" />
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mt-2 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Convert PDF</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Convert PDF to other formats or other formats to PDF
          </p>
        </div>

        {/* Modal Grid Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* CONVERT TO PDF */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase mb-3 px-1">
              Convert To PDF
            </h3>
            <div className="space-y-2">
              {convertToPdfTools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => handleToolClick(tool.path)}
                  className="w-full text-left flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-purple-500/20 border border-purple-500/50 hover:border-purple-500/20 text-slate-700 hover:text-purple-700 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-xs group-hover:scale-105 transition-transform">
                      {tool.icon}
                    </div>
                    <span className="text-xs font-bold tracking-wide">{tool.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>

          {/* CONVERT FROM PDF */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase mb-3 px-1">
              Convert From PDF
            </h3>
            <div className="space-y-2">
              {convertFromPdfTools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => handleToolClick(tool.path)}
                  className="w-full text-left flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-purple-500/20 border border-purple-500/50 hover:border-purple-200 text-slate-700 hover:text-purple-700 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-xs group-hover:scale-105 transition-transform">
                      {tool.icon}
                    </div>
                    <span className="text-xs font-bold tracking-wide">{tool.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>,
    document.body
  );
};

export default ConvertPdfModal;