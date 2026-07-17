import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadBox from '../../components/common/uploadbox';
import mammoth from 'mammoth';
import { 
  FileText, 
  Layers, 
  Calendar, 
  X, 
  RotateCcw, 
  Minus, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2,
  FileUp,
  Activity,
  Type
} from 'lucide-react';

const WordToPdf = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAd, setShowAd] = useState(true);
  const [pagesArray, setPagesArray] = useState([]);
  const [isReading, setIsReading] = useState(false);
  
  const [metrics, setMetrics] = useState({
    wordCount: 0,
    detectedFont: 'Calibri, Arial',
    fontSizeEst: '11pt',
    hasCodeBlocks: false,
    headingsCount: 0
  });

  useEffect(() => {
    if (!selectedFile) {
      setPagesArray([]);
      return;
    }

    setIsReading(true);
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
        const rawHtml = result.value || "<p>Empty Document</p>";

        const virtualDiv = document.createElement('div');
        virtualDiv.innerHTML = rawHtml;
        const textContent = virtualDiv.textContent || virtualDiv.innerText || "";
        
        const words = textContent.trim().split(/\s+/).filter(w => w.length > 0);
        const totalWords = words.length;

        const hasCode = rawHtml.includes('<code>') || rawHtml.includes('{') || textContent.includes('import ');
        const structuralHeadings = virtualDiv.querySelectorAll('h1, h2, h3, h4').length;
        
        setMetrics({
          wordCount: totalWords,
          detectedFont: hasCode ? 'Consolas, Segoe UI' : 'Calibri, Arial, sans-serif',
          fontSizeEst: totalWords > 1500 ? '10.5pt (Compact)' : '11.5pt (Standard)',
          hasCodeBlocks: hasCode,
          headingsCount: structuralHeadings
        });

        const paragraphs = Array.from(virtualDiv.children);
        let chunks = [];
        let currentChunk = "";
        
        // ⚡ REDUCED ELEMENT COUNT TO 2: Taaki content strict limit me rahe aur scrollbar na aaye
        const elementsPerPage = 2; 

        paragraphs.forEach((p, idx) => {
          currentChunk += p.outerHTML;
          if ((idx + 1) % elementsPerPage === 0 || idx === paragraphs.length - 1) {
            chunks.push(currentChunk);
            currentChunk = "";
          }
        });

        setPagesArray(chunks.length > 0 ? chunks : [rawHtml]);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error generating text parameters data metrics loops:", err);
        setPagesArray(["<p className='text-red-500'>Error paginating. File conversion engine remains active.</p>"]);
      } finally {
        setIsReading(false);
      }
    };

    reader.readAsArrayBuffer(selectedFile.rawFile || selectedFile);
  }, [selectedFile]);

  const totalPages = pagesArray.length || 1;

  const handleFilesSelect = (files) => {
    const file = files?.[0];
    if (!file || (!file.name.toLowerCase().endsWith('.doc') && !file.name.toLowerCase().endsWith('.docx'))) {
      alert('Please select a valid Word (.doc/.docx) file.');
      return;
    }
    setSelectedFile(file);
  };

  const handleConvert = () => {
    if (!selectedFile) return;
    navigate('/processing', { 
      state: { 
        files: [selectedFile], 
        toolType: 'word-to-pdf' 
      } 
    });
  };

  const resetWorkspace = () => {
    setSelectedFile(null);
    setCurrentPage(1);
    setPagesArray([]);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!selectedFile) {
    return (
      <div className="h-[calc(100vh-64px)] bg-[#F8FAFD] flex items-center justify-center p-4">
        <UploadBox
          titlePrefix="Word"
          titleHighlight="to PDF"
          titleSuffix="Converter"
          subTitle="Convert Word documents to PDF."
          supportedFormat="FILES"
          acceptTypes="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.doc,.docx"
          maxSize="50 MB"
          onFilesSelect={handleFilesSelect}
        />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-[#F8FAFD] flex flex-col font-sans select-none overflow-hidden text-slate-700 w-full">
      
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-3 md:p-4 gap-3 md:gap-4 w-full mx-auto max-w-[1600px] h-full">
        
        {/* 📌 LEFT PANEL SIDEBAR */}
        <div className="w-full md:w-[280px] shrink-0 flex flex-row md:flex-col gap-2.5 md:gap-3 overflow-x-auto md:overflow-y-auto max-h-[110px] md:max-h-full p-0.5">
          
          <div className="bg-white rounded-lg p-3 border border-[#E2E8F0] shadow-sm flex items-center gap-3 shrink-0 min-w-[170px] md:min-w-0">
            <div className="bg-[#1F51FF] p-2 rounded-lg text-white shadow-md shadow-blue-200 shrink-0">
              <FileText size={18} className="fill-white/10" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs md:text-sm font-bold text-[#0F172A] leading-tight truncate">Word to PDF</h2>
              <p className="text-[10px] text-[#64748B] mt-0.5">Workspace Mode</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-[#E2E8F0] shadow-sm flex items-center gap-3 shrink-0 min-w-[200px] md:min-w-0 flex-1 md:flex-none">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1F51FF] shrink-0">
              <FileText size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#1E293B] truncate">{selectedFile.name}</p>
              <p className="text-[10px] font-medium text-[#64748B] mt-0.5">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>

          <div className="hidden md:flex bg-white rounded-lg p-3.5 border border-blue-100 shadow-[0_4px_12px_rgba(31,81,255,0.02)] flex-col gap-3 shrink-0">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-1.5 pb-1 border-b border-slate-100">
              <Activity size={12} /> Document Telemetry
            </h4>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B] font-medium flex items-center gap-1.5"><Type size={13} /> Font Family</span>
              <span className="font-bold text-[#0F172A] max-w-[120px] truncate text-[11px]">{metrics.detectedFont.split(',')[0]}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B] font-medium">📏 Text Scale</span>
              <span className="font-bold text-[#0F172A] text-[11px]">{metrics.fontSizeEst}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B] font-medium">🔢 Words Found</span>
              <span className="font-bold text-[#0F172A] bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">{metrics.wordCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B] font-medium">📋 Headings</span>
              <span className="font-bold text-[#0F172A]">{metrics.headingsCount}</span>
            </div>
          </div>

          {showAd && (
            <div className="hidden md:block bg-gradient-to-br from-indigo-50/70 via-blue-50/50 to-white rounded-lg p-4 border border-blue-100/70 shadow-sm relative overflow-hidden group mt-auto shrink-0">
              <button onClick={() => setShowAd(false)} className="absolute top-2.5 right-2.5 p-1 rounded-full text-[#94A3B8] hover:bg-slate-100"><X size={12} /></button>
              <span className="inline-block px-1.5 py-0.5 bg-[#4F46E5] text-[9px] font-bold text-white rounded uppercase mb-2">Ad</span>
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#4F46E5] shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-[#0F172A] text-xs">Go Premium</h4>
                  <p className="text-[10px] text-[#64748B] mt-0.5 leading-relaxed">Fast processing window rules.</p>
                </div>
              </div>
              <button className="w-full mt-3 bg-[#1F51FF] hover:bg-blue-600 text-white text-[11px] font-bold py-2 px-3 rounded-lg shadow-md transition-all">Upgrade Now</button>
            </div>
          )}
        </div>

        {/* 📄 VIEWPORT LIVE PREVIEW DOCUMENT BOX */}
        <div className="flex-1 bg-white rounded-lg border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden h-full">
          <div className="h-11 border-b border-[#E2E8F0] px-4 flex items-center justify-between bg-slate-50/50 shrink-0">
            <span className="text-xs font-bold text-[#0F172A]">Preview</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white border border-[#E2E8F0] rounded-lg px-1 py-0.5 shadow-sm">
                <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1 hover:bg-slate-100 rounded text-[#64748B]"><Minus size={12} /></button>
                <span className="text-[10px] font-bold text-[#334155] w-10 text-center">{zoom}%</span>
                <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1 hover:bg-slate-100 rounded text-[#64748B]"><Plus size={12} /></button>
              </div>
              
              <div className="h-3 w-px bg-slate-200" />
              
              <div className="flex items-center bg-white border border-[#E2E8F0] rounded-lg px-1 py-0.5 shadow-sm">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
                  disabled={currentPage === 1} 
                  className="p-1 hover:bg-slate-100 rounded text-[#64748B] disabled:opacity-20 cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[10px] font-bold text-[#334155] px-1.5 min-w-[40px] text-center">{currentPage} / {totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
                  disabled={currentPage === totalPages} 
                  className="p-1 hover:bg-slate-100 rounded text-[#64748B] disabled:opacity-20 cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
              
              <div className="h-3 w-px bg-slate-200 hidden sm:block" />
              <button className="p-1.5 border border-[#E2E8F0] bg-white text-[#64748B] rounded-lg hover:bg-slate-100 shadow-sm hidden sm:block"><Maximize2 size={12} /></button>
            </div>
          </div>

          {/* ⚡ NO SCROLLBARS INSIDE THE A4 PAGE */}
          <div className="flex-1 overflow-auto bg-[#F1F5F9]/60 p-3 sm:p-5 md:p-8 flex items-start justify-center shadow-inner">
            <div 
              style={{ 
                zoom: `${zoom}%`,
                fontFamily: metrics.detectedFont
              }}
              className="bg-white shadow-md border border-slate-200 rounded-sm w-full max-w-[640px] p-6 sm:p-10 md:p-12 mx-auto box-border transition-all flex flex-col min-h-[420px] md:min-h-[820px] h-auto overflow-hidden aspect-[1/1.414]"
            >
              {isReading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                  <div className="w-5 h-5 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-[11px] font-semibold">Analyzing original fonts and texture parameters...</p>
                </div>
              ) : (
                <div className="w-full flex-1 flex flex-col text-[#0F172A] h-full overflow-hidden">
                  <div 
                    className="prose prose-sm max-w-none text-xs sm:text-sm text-[#334155] leading-relaxed select-text space-y-4 docx-preview-content"
                    dangerouslySetInnerHTML={{ __html: pagesArray[currentPage - 1] || "" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 BOTTOM BAR FOOTER */}
      <div className="h-14 bg-white border-t border-[#E2E8F0] px-4 md:px-6 flex items-center justify-between shrink-0 shadow-sm z-20">
        <button onClick={resetWorkspace} className="h-9 px-3 border border-[#E2E8F0] text-[#475569] font-bold text-xs rounded-lg flex items-center gap-1.5 hover:bg-slate-50 transition-all active:scale-[0.98]">
          <RotateCcw size={13} /> <span className="hidden sm:inline">Replace File</span>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={resetWorkspace} className="h-9 px-4 text-[#475569] bg-slate-50 border border-slate-200 font-bold text-xs rounded-lg hover:bg-slate-100">Cancel</button>
          <button onClick={handleConvert} className="h-9 px-5 bg-[#1F51FF] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-md transition-all flex items-center gap-2 active:scale-[0.97]"><FileUp size={13} /> Convert to PDF</button>
        </div>
      </div>
    </div>
  );
};

export default WordToPdf;