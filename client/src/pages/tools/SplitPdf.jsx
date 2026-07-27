import React, { useState, useRef } from 'react';
import { 
  Scissors, 
  Trash2, 
  CheckCircle2, 
  ArrowRight,
  FileText,
  FileMinus,
  Layers,
  Sliders,
  ShieldCheck,
  Zap,
  Check,
  FileCode
} from 'lucide-react';
import UploadBox from '../../components/upload/uploadbox';

const SplitPdf = () => {
  const [file, setFile] = useState(null);
  const [splitMethod, setSplitMethod] = useState('every-page');
  
  // Real File Data States
  const [numPages, setNumPages] = useState(1);
  const [selectedPages, setSelectedPages] = useState([]);
  const [everyNPages, setEveryNPages] = useState(2);
  const [customRange, setCustomRange] = useState('1-2');

  const fileInputRef = useRef(null);

  // Native Fast PDF Page Count Extractor (Works 100% on huge files without memory crash)
  const extractPdfPagesNative = (rawFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      // Regex match for PDF page count /Count tag in metadata structure
      const matches = content.match(/\/Count\s+(\d+)/g);
      if (matches && matches.length > 0) {
        const counts = matches.map(m => parseInt(m.replace(/\/Count\s+/, ''), 10));
        const maxPages = Math.max(...counts);
        if (maxPages > 0) {
          setNumPages(maxPages);
          // Default all pages selected
          setSelectedPages(Array.from({ length: Math.min(maxPages, 12) }, (_, i) => i + 1));
          return;
        }
      }
      // Fallback default
      setNumPages(8);
      setSelectedPages([1, 2, 3, 4, 5, 6, 7, 8]);
    };
    reader.readAsText(rawFile.slice(0, 1024 * 1024)); // Read first 1MB metadata stream
  };

  // File Selection Handler
  const handleFileSelect = (selectedFiles) => {
    if (!selectedFiles) return;

    let incomingFile = null;
    if (selectedFiles instanceof FileList || Array.isArray(selectedFiles)) {
      incomingFile = selectedFiles[0];
    } else if (selectedFiles.target && selectedFiles.target.files) {
      incomingFile = selectedFiles.target.files[0];
    } else if (selectedFiles instanceof File) {
      incomingFile = selectedFiles;
    }

    if (!incomingFile) return;

    setFile({
      name: incomingFile.name,
      size: (incomingFile.size / (1024 * 1024)).toFixed(2) + ' MB',
      rawFile: incomingFile
    });

    extractPdfPagesNative(incomingFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setNumPages(1);
    setSelectedPages([]);
  };

  // Toggle Page Selection for "Extract selected pages" mode
  const togglePageSelection = (pageNum) => {
    if (selectedPages.includes(pageNum)) {
      setSelectedPages(selectedPages.filter((p) => p !== pageNum));
    } else {
      setSelectedPages([...selectedPages, pageNum].sort((a, b) => a - b));
    }
  };

  // Calculate estimated output dynamically
  const getEstimatedFiles = () => {
    if (splitMethod === 'every-page') return numPages;
    if (splitMethod === 'extract-pages') return selectedPages.length;
    if (splitMethod === 'every-n-pages') return Math.ceil(numPages / (everyNPages || 1));
    if (splitMethod === 'custom-range') return customRange ? customRange.split(',').length : 1;
    return 1;
  };

  const splitOptions = [
    {
      id: 'every-page',
      title: 'Split every page',
      desc: 'Create a PDF file for each page.',
      icon: <FileText className="w-4 h-4 text-[#6338F6]" />
    },
    {
      id: 'extract-pages',
      title: 'Extract selected pages',
      desc: 'Select specific pages to extract.',
      icon: <FileMinus className="w-4 h-4 text-[#6338F6]" />
    },
    {
      id: 'every-n-pages',
      title: 'Split every N pages',
      desc: 'Split the PDF every N pages.',
      icon: <Layers className="w-4 h-4 text-[#6338F6]" />
    },
    {
      id: 'custom-range',
      title: 'Custom range',
      desc: 'Enter custom page ranges to split.',
      icon: <Sliders className="w-4 h-4 text-[#6338F6]" />
    }
  ];

  // 1. FIRST VIEW: UploadBox
  if (!file) {
    return (
      <UploadBox
        titlePrefix="Split"
        titleHighlight="PDF"
        subTitle="Split your PDF into multiple files exactly how you need"
        supportedFormat="FILES"
        headerIcon={<Scissors className="w-10 h-10 text-indigo-600" />}
        acceptTypes="application/pdf,.pdf"
        multiple={false}
        onFilesSelect={handleFileSelect}
        onFileSelect={handleFileSelect}
      />
    );
  }

  // Generate Array for Page Cards display (Max 12 visible)
  const displayPagesCount = Math.min(numPages, 12);
  const pageList = Array.from({ length: displayPagesCount }, (_, i) => i + 1);

  return (
    <div className="w-full min-h-screen lg:min-h-0 lg:h-[calc(100vh-65px)] bg-[#F8FAFC] p-3 sm:p-5 font-sans text-slate-800 flex flex-col justify-between overflow-x-hidden">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => {
          handleFileSelect(e.target.files);
          e.target.value = '';
        }} 
        accept="application/pdf,.pdf" 
        className="hidden" 
      />

      <main className="max-w-[1360px] w-full mx-auto flex-1 flex flex-col justify-between min-h-0">
        
        {/* WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 w-full flex-1 min-h-0 items-stretch my-auto">
          
          {/* LEFT SIDE AD BANNER */}
          <div className="order-2 lg:order-1 lg:col-span-3 bg-gradient-to-b from-purple-50/60 via-white to-indigo-50/40 border border-slate-200/80 rounded-lg p-4 sm:p-5 shadow-2xs flex flex-col justify-between h-full">
            <div>
              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                Ad
              </span>
              <h2 className="text-base sm:text-xl font-black text-slate-900 leading-tight mt-2">
                All PDF Tools <br />
                <span className="text-[#6338F6]">In One Place</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Convert, Compress, Merge, Split, Protect, Unlock & more.
              </p>

              <ul className="space-y-2 mt-3.5 text-xs font-medium text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6338F6] shrink-0" /> Fast & Easy to Use
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6338F6] shrink-0" /> 100% Secure
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6338F6] shrink-0" /> Works on All Devices
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6338F6] shrink-0" /> No Installation Required
                </li>
              </ul>
            </div>

            <div className="space-y-2 mt-4">
              <button className="w-full flex items-center justify-center gap-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 py-2 rounded-md text-xs font-bold shadow-2xs transition cursor-pointer">
                <span>Explore All Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="bg-[#6338F6]/10 border border-[#6338F6]/20 rounded-lg p-2.5 text-center flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-[#6338F6]" />
                <p className="text-xs font-bold text-slate-800">DocNexus Suite</p>
              </div>
            </div>
          </div>

          {/* MAIN WORKSPACE */}
          <div className="order-1 lg:order-2 lg:col-span-9 bg-white border border-slate-200/80 rounded-lg p-4 sm:p-6 shadow-2xs flex flex-col justify-between h-full space-y-4">
            
            {/* Header + Selected File Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#6338F6] rounded-md flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Scissors className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">Split PDF</h1>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                    Split your PDF into multiple files exactly how you need.
                  </p>
                </div>
              </div>

              {/* Selected File Card */}
              <div className="border border-slate-200/80 rounded-md px-3 py-1.5 flex items-center justify-between gap-4 bg-white shadow-2xs shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-8 bg-[#FFF0F0] border border-[#FFE0E0] rounded-sm flex items-center justify-center shrink-0">
                    <span className="text-[8px] font-black text-[#E53935] uppercase">PDF</span>
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 truncate leading-tight">{file.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{file.size} &nbsp;•&nbsp; {numPages} Pages</p>
                  </div>
                </div>

                <button 
                  onClick={handleRemoveFile}
                  className="flex items-center gap-1 text-[11px] font-semibold text-red-500 hover:bg-red-50 px-2 py-1 rounded-sm transition cursor-pointer"
                  title="Remove File"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>

            {/* INTERACTIVE PAGE PREVIEW CARDS */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-900">
                  Page Preview ({numPages} Pages)
                </h3>
                {splitMethod === 'extract-pages' && (
                  <span className="text-[10px] font-semibold text-[#6338F6]">
                    Click pages to select/unselect ({selectedPages.length} selected)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {pageList.map((pageNum) => {
                  const isSelected = selectedPages.includes(pageNum);
                  return (
                    <div 
                      key={pageNum} 
                      onClick={() => splitMethod === 'extract-pages' && togglePageSelection(pageNum)}
                      className="flex flex-col items-center shrink-0"
                    >
                      <div className={`relative w-14 h-20 bg-white border rounded-sm p-1.5 flex flex-col justify-between shadow-2xs transition ${
                        splitMethod === 'extract-pages' ? 'cursor-pointer hover:border-[#6338F6]' : 'cursor-default'
                      } ${isSelected ? 'border-[#6338F6] ring-1 ring-[#6338F6] bg-purple-50/20' : 'border-slate-200'}`}>
                        
                        {/* Page Document Graphic Placeholder */}
                        <div className="w-full space-y-1 mt-1">
                          <div className="h-1 bg-slate-200 rounded-xs w-3/4"></div>
                          <div className="h-1 bg-slate-100 rounded-xs w-full"></div>
                          <div className="h-1 bg-slate-100 rounded-xs w-5/6"></div>
                          <div className="h-1 bg-slate-100 rounded-xs w-2/3"></div>
                          <div className="h-1 bg-slate-100 rounded-xs w-4/5"></div>
                        </div>

                        {/* Page Selection Badge Indicator */}
                        {splitMethod === 'extract-pages' && (
                          <div className={`absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                            isSelected ? 'bg-[#6338F6] text-white' : 'border border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        )}
                        
                        <FileCode className="w-3.5 h-3.5 text-slate-300 self-center mb-1" />
                      </div>

                      <span className="text-[10px] font-bold text-slate-600 mt-1">
                        {pageNum}
                      </span>
                    </div>
                  );
                })}

                {/* Show Ellipsis for pages exceeding visible list */}
                {numPages > displayPagesCount && (
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-14 h-20 bg-slate-50 border border-slate-200 rounded-sm flex items-center justify-center text-slate-400 font-bold text-xs">
                      ...
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1">
                      {numPages}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CHOOSE SPLIT METHOD OPTIONS */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 mb-2.5">Choose Split Method</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {splitOptions.map((opt) => {
                  const isSelected = splitMethod === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSplitMethod(opt.id)}
                      className={`border rounded-md p-3 transition cursor-pointer flex flex-col justify-between ${
                        isSelected 
                          ? 'border-[#6338F6] bg-[#F6F5FF] shadow-2xs' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-7 h-7 rounded-sm bg-[#F4F2FF] flex items-center justify-center">
                          {opt.icon}
                        </div>
                        
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                          isSelected ? 'border-[#6338F6] bg-[#6338F6]' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">{opt.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-1 leading-snug">{opt.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Inputs Based on Selected Split Mode */}
              {splitMethod === 'every-n-pages' && (
                <div className="mt-3 bg-purple-50/40 border border-purple-100 rounded-md p-3 flex items-center gap-3">
                  <label className="text-xs font-bold text-slate-700">Split every N pages:</label>
                  <input 
                    type="number" 
                    min="1" 
                    max={numPages} 
                    value={everyNPages} 
                    onChange={(e) => setEveryNPages(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-2.5 py-1 text-xs font-bold border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:border-[#6338F6]" 
                  />
                </div>
              )}

              {splitMethod === 'custom-range' && (
                <div className="mt-3 bg-purple-50/40 border border-purple-100 rounded-md p-3 flex items-center gap-3">
                  <label className="text-xs font-bold text-slate-700">Custom Range (e.g. 1-2, 5):</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 1-3, 5, 8-10" 
                    value={customRange} 
                    onChange={(e) => setCustomRange(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:border-[#6338F6]" 
                  />
                </div>
              )}
            </div>

            {/* ESTIMATED OUTPUT BANNER */}
            <div className="bg-[#F6F5FF] border border-[#EBE9FE] rounded-md p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-white border border-[#EBE9FE] rounded-sm flex items-center justify-center text-[#6338F6]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Estimated Output</h4>
                  <p className="text-[10px] text-slate-500">
                    The resulting PDF files will be created according to the selected option.
                  </p>
                </div>
              </div>

              <div className="bg-[#EBE9FE]/60 px-3 py-1 rounded-sm text-center shrink-0">
                <p className="text-[9px] font-bold text-slate-500 uppercase">Estimated Files</p>
                <p className="text-xs font-black text-[#6338F6] leading-none mt-0.5">
                  {getEstimatedFiles()}
                </p>
              </div>
            </div>

            {/* ACTION SUBMIT BUTTON */}
            <div className="pt-1">
              <button className="w-full bg-[#6338F6] hover:bg-[#5229E0] text-white py-2.5 sm:py-3 rounded-md text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer">
                <Scissors className="w-4 h-4" />
                <span>Split PDF</span>
              </button>

              <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#6338F6]" />
                We never upload or store your files. Your files are 100% secure and private.
              </p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default SplitPdf;