import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  Zap, 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Upload, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Menu, 
  MoreVertical, 
  Info, 
  RotateCcw, 
  ArrowRight,
  X,
  FileText,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import UploadBox from '../../components/upload/uploadbox';

// PDF Worker Setup
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const CompressPdf = () => {
  const [viewMode, setViewMode] = useState('upload');
  
  // File States
  const [files, setFiles] = useState([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [compressionLevel, setCompressionLevel] = useState('High');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Container Width Reference for Responsive Page Fitting
  const pageContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const fileInputRef = useRef(null);

  // Measure Viewer Container Width Dynamically
  useEffect(() => {
    if (!pageContainerRef.current) return;

    const updateWidth = () => {
      if (pageContainerRef.current) {
        // Subtract padding space to ensure perfect fit without horizontal overflow
        setContainerWidth(pageContainerRef.current.clientWidth - 32);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [viewMode, files]);

  // Clean Blob URLs
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.url) URL.revokeObjectURL(file.url);
      });
    };
  }, [files]);

  const currentFile = files[activeFileIndex] || null;

  const handleFilesSelect = (newFiles) => {
    if (newFiles && newFiles.length > 0) {
      const added = Array.from(newFiles).map((file, idx) => ({
        id: Date.now() + idx,
        fileObj: file,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        rawSize: parseFloat((file.size / (1024 * 1024)).toFixed(2)),
        url: URL.createObjectURL(file),
      }));

      setFiles((prev) => [...prev, ...added]);
      if (files.length === 0) setActiveFileIndex(0);
      setViewMode('workspace');
    }
  };

  const removeFile = (id) => {
    const targetFile = files.find((f) => f.id === id);
    if (targetFile?.url) URL.revokeObjectURL(targetFile.url);

    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    if (activeFileIndex >= updated.length) {
      setActiveFileIndex(Math.max(0, updated.length - 1));
    }
  };

  const clearAllFiles = () => {
    files.forEach((f) => f.url && URL.revokeObjectURL(f.url));
    setFiles([]);
    setActiveFileIndex(0);
    setCurrentPage(1);
    setNumPages(1);
    setIsDone(false);
  };

  const handleBackToUpload = () => {
    clearAllFiles();
    setViewMode('upload');
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  // Zoom Handlers
  const handleZoomIn = () => {
    if (zoomLevel < 180) setZoomLevel((prev) => prev + 15);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 60) setZoomLevel((prev) => prev - 15);
  };

  const getEstimatedSize = () => {
    if (!files.length) return '0.00 MB';
    const totalSize = files.reduce((acc, f) => acc + f.rawSize, 0);
    let ratio = 0.15;
    if (compressionLevel === 'Low') ratio = 0.6;
    if (compressionLevel === 'Medium') ratio = 0.3;
    return (totalSize * ratio).toFixed(2);
  };

  const getTotalOriginalSize = () => {
    if (!files.length) return '0.00 MB';
    return files.reduce((acc, f) => acc + f.rawSize, 0).toFixed(2);
  };

  const handleStartCompress = () => {
    if (!files.length) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
    }, 1200);
  };

  const handleDownload = () => {
    if (currentFile?.url) {
      const link = document.createElement('a');
      link.href = currentFile.url;
      link.download = `compressed_${currentFile.name}`;
      link.click();
    }
  };

  // 1. Initial Upload View Mode
  if (viewMode === 'upload') {
    return (
      <UploadBox
        titlePrefix="Compress"
        titleHighlight="PDF"
        subTitle="Reduce PDF file size without losing quality"
        supportedFormat="FILES"
        headerIcon={<Zap className="w-10 h-10 text-indigo-600" />}
        acceptTypes="application/pdf,.pdf"
        onFilesSelect={handleFilesSelect}
      />
    );
  }

  // 2. Main Workspace View
  return (
    <div className="h-[calc(100vh-70px)] bg-slate-50 text-slate-800 font-sans flex flex-col justify-between p-3 md:p-4 overflow-hidden">
      
      <input 
        type="file" 
        ref={fileInputRef} 
        multiple 
        accept="application/pdf,.pdf" 
        className="hidden" 
        onChange={(e) => handleFilesSelect(e.target.files)}
      />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBackToUpload}
            title="Back to Upload Box"
            className="p-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">Compress PDF</h1>
            <p className="text-[11px] text-slate-500">Reduce PDF file size while keeping good quality.</p>
          </div>
        </div>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 bg-white border border-indigo-200 text-indigo-600 font-medium px-3 py-1.5 rounded-md hover:bg-indigo-50 transition shadow-xs text-xs active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add More Files</span>
        </button>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 my-2 flex-1 min-h-0 overflow-hidden">
        
        {/* Left Column */}
        <div className="lg:col-span-3 flex flex-col gap-2.5 h-full overflow-hidden">
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col flex-1 min-h-0">
            <div className="flex justify-between items-center mb-2 shrink-0">
              <span className="font-semibold text-xs text-slate-700">Uploaded Files ({files.length})</span>
              {files.length > 0 && (
                <button 
                  onClick={clearAllFiles}
                  className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-700 font-medium cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Clear All
                </button>
              )}
            </div>

            <div className="space-y-1.5 overflow-y-auto pr-1 flex-1">
              {files.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 rounded-md bg-slate-50/50">
                  <p className="text-xs font-medium text-slate-400">No files uploaded</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 text-[11px] text-indigo-600 underline font-semibold cursor-pointer"
                  >
                    Click to add files
                  </button>
                </div>
              ) : (
                files.map((file, index) => {
                  const isActive = activeFileIndex === index;
                  return (
                    <div 
                      key={file.id} 
                      onClick={() => {
                        setActiveFileIndex(index);
                        setCurrentPage(1);
                      }}
                      className={`relative flex items-center p-2 border rounded-md transition cursor-pointer ${
                        isActive 
                          ? 'bg-indigo-50/80 border-indigo-400' 
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`absolute -top-1 -left-1 text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold ${
                        isActive ? 'bg-indigo-600 text-white' : 'bg-slate-400 text-white'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="p-1 bg-red-100 text-red-600 rounded-sm mr-2 shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{file.name}</p>
                        <p className="text-[10px] text-slate-400">{file.size}</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="text-slate-400 hover:text-red-500 p-1 shrink-0 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-indigo-200 bg-indigo-50/30 rounded-lg p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50/60 transition shrink-0"
          >
            <div className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-md flex items-center justify-center mb-1">
              <Upload className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-slate-700">Drag & drop PDF files here</p>
            <p className="text-[11px] text-slate-500">or <span className="text-indigo-600 font-semibold underline">click to browse</span></p>
            <p className="text-[9px] text-slate-400 mt-1">Max file size: 100MB</p>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-2.5 flex items-center gap-2 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-800">Your files are secure</p>
              <p className="text-[10px] text-slate-500 leading-tight">We delete your files automatically after processing.</p>
            </div>
          </div>
        </div>

        {/* Middle Column: Responsive PDF Preview Container */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-3 shadow-xs flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center mb-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-slate-700">Preview</span>
              <span className="text-[11px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-sm font-medium truncate max-w-[220px]">
                {currentFile ? currentFile.name : 'No file selected'}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              <button 
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={!currentFile || currentPage <= 1}
                className="hover:bg-slate-200 p-0.5 rounded-sm disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <span className="font-medium text-[11px]">{currentFile ? currentPage : 0} / {numPages}</span>
              <button 
                onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                disabled={!currentFile || currentPage >= numPages}
                className="hover:bg-slate-200 p-0.5 rounded-sm disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Dark PDF Viewer Frame */}
          <div className="flex-1 bg-slate-900 rounded-lg overflow-hidden flex flex-col min-h-0">
            <div className="bg-slate-950 text-slate-300 px-3 py-1.5 flex items-center justify-between text-xs border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Menu className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px]">{currentFile ? currentPage : 0} / {numPages}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-[11px]">
                <button onClick={handleZoomOut} disabled={!currentFile} title="Zoom Out" className="hover:text-white p-0.5 disabled:opacity-30 cursor-pointer"><ZoomOut className="w-3 h-3" /></button>
                <span className="w-10 text-center">{zoomLevel}%</span>
                <button onClick={handleZoomIn} disabled={!currentFile} title="Zoom In" className="hover:text-white p-0.5 disabled:opacity-30 cursor-pointer"><ZoomIn className="w-3 h-3" /></button>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleDownload} disabled={!currentFile} title="Download File" className="hover:text-white p-0.5 disabled:opacity-30 cursor-pointer"><Download className="w-3.5 h-3.5" /></button>
                <button title="More Options" className="hover:text-white p-0.5 cursor-pointer"><MoreVertical className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            {/* Document Render Zone with Dynamic Container Fitting */}
            <div 
              ref={pageContainerRef} 
              className="flex-1 bg-slate-900 w-full h-full relative overflow-y-auto flex justify-center items-start p-3"
            >
              {currentFile?.url ? (
                <div className="shadow-2xl rounded-sm overflow-hidden bg-white my-auto transition-all duration-150">
                  <Document
                    file={currentFile.url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                      <div className="flex items-center gap-2 text-slate-400 text-xs p-10">
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                        <span>Loading PDF Preview...</span>
                      </div>
                    }
                    error={
                      <div className="text-red-400 text-xs p-10">
                        Failed to load PDF document.
                      </div>
                    }
                  >
                    <Page 
                      pageNumber={currentPage} 
                      width={containerWidth ? (containerWidth * zoomLevel) / 100 : undefined}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400 text-xs my-auto">
                  <FileText className="w-8 h-8 text-slate-600" />
                  <p>No document loaded</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 flex flex-col gap-2.5 h-full overflow-hidden">
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs shrink-0">
            <h3 className="font-semibold text-xs text-slate-800 mb-2">Compression Level</h3>
            <div className="grid grid-cols-3 gap-1.5">
              {['Low', 'Medium', 'High'].map((level) => (
                <button
                  key={level}
                  onClick={() => setCompressionLevel(level)}
                  className={`py-1.5 text-xs font-medium rounded-md border transition cursor-pointer ${
                    compressionLevel === level
                      ? 'bg-indigo-50 text-indigo-600 border-indigo-500 font-semibold shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex-1 flex flex-col justify-between overflow-hidden">
            <div>
              <h3 className="font-semibold text-xs text-slate-800 mb-2">Estimated Result</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Original Size</span>
                  <span className="font-semibold text-slate-800">{getTotalOriginalSize()} MB</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Estimated Size</span>
                  <span className="font-semibold text-indigo-600">~ {getEstimatedSize()} MB</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Reduction</span>
                  <span className="font-semibold text-emerald-600">
                    ~ {files.length === 0 ? '0%' : compressionLevel === 'Low' ? '40%' : compressionLevel === 'Medium' ? '70%' : '85%'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 rounded-md p-2.5 flex gap-2 mt-2">
              <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-600 leading-tight">
                Actual result may vary depending on the content of the PDF.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-200 shrink-0">
        <button 
          onClick={handleBackToUpload}
          className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 font-medium px-3 py-1.5 rounded-md hover:bg-slate-50 transition text-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tools</span>
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setCompressionLevel('High');
              setZoomLevel(100);
              setCurrentPage(1);
              setIsDone(false);
            }}
            className="flex items-center gap-1 bg-white border border-slate-200 text-slate-600 font-medium px-3 py-1.5 rounded-md hover:bg-slate-50 transition text-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          
          <button 
            onClick={isDone ? handleDownload : handleStartCompress}
            disabled={isProcessing || files.length === 0}
            className={`flex items-center gap-1.5 text-white font-medium px-4 py-1.5 rounded-md transition shadow-xs text-xs active:scale-95 cursor-pointer ${
              isDone 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <span>Compressing...</span>
            ) : isDone ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Download Compressed PDF</span>
              </>
            ) : (
              <>
                <span>Compress PDF</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};

export default CompressPdf;