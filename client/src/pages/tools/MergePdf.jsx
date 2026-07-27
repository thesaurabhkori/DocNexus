import React, { useState, useRef } from 'react';
import { 
  FilePlus, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  GripVertical, 
  Info, 
  UploadCloud, 
  ArrowRight,
  Settings,
  ArrowUpDown,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import UploadBox from '../../components/upload/uploadbox';

const MergePdf = () => {
  // Initial empty state
  const [files, setFiles] = useState([]);
  const [pageSize, setPageSize] = useState('As in Source (Recommended)');
  const [margin, setMargin] = useState('No Margin');
  
  // Hidden input reference for workspace browsing
  const fileInputRef = useRef(null);

  // Robust Multiple Files Selection Handler
  const handleFilesSelect = (selectedFiles) => {
    if (!selectedFiles) return;

    let incomingArray = [];
    if (selectedFiles instanceof FileList || Array.isArray(selectedFiles)) {
      incomingArray = Array.from(selectedFiles);
    } else if (selectedFiles.target && selectedFiles.target.files) {
      incomingArray = Array.from(selectedFiles.target.files);
    } else if (selectedFiles instanceof File) {
      incomingArray = [selectedFiles];
    }

    if (incomingArray.length === 0) return;

    const formattedFiles = incomingArray.map((file, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      rawFile: file
    }));

    setFiles((prev) => [...prev, ...formattedFiles]);
  };

  // Remove Single File
  const handleRemoveFile = (id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  // Reset to Upload Box
  const handleClearAll = () => {
    setFiles([]);
  };

  // Trigger browser file picker
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Drag & Drop Handlers for Inner Dashed Box
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer && e.dataTransfer.files) {
      handleFilesSelect(e.dataTransfer.files);
    }
  };

  // 1. FIRST SCREEN: UploadBox with Explicit Multiple Support
  if (files.length === 0) {
    return (
      <UploadBox
        titlePrefix="Merge"
        titleHighlight="PDF"
        subTitle="Combine multiple PDF files into a single document"
        supportedFormat="FILES"
        headerIcon={<FilePlus className="w-10 h-10 text-indigo-600" />}
        acceptTypes="application/pdf,.pdf"
        multiple={true}
        isMultiple={true}
        onFilesSelect={handleFilesSelect}
        onFileSelect={handleFilesSelect}
      />
    );
  }

  // 2. WORKSPACE: Fitted Full Screen
  const isMergeReady = files.length >= 2;

  return (
    <div className="w-full h-[calc(100vh-75px)] bg-[#F8FAFC] px-4 md:px-8 py-3 font-sans text-slate-800 overflow-hidden flex flex-col">
      {/* Hidden File Input for Workspace Selection */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => {
          handleFilesSelect(e.target.files);
          e.target.value = ''; // Reset input to allow selecting same file again
        }} 
        multiple 
        accept="application/pdf,.pdf" 
        className="hidden" 
      />

      <main className="w-full mx-auto flex-1 flex flex-col justify-between min-h-0">
        
        {/* Top Header Section */}
        <div className="bg-white border-b border-[#EBE9FE] rounded-lg p-3 flex items-center justify-between shrink-0 mb-2.5 w-full height">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleClearAll}
              className="p-1.5 bg-white border border-slate-200 rounded-sm hover:bg-slate-50 transition shadow-2xs text-slate-700 cursor-pointer"
              title="Back to Upload"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">Merge PDF</h1>
              <p className="text-[10px] text-slate-500">
                Merge your PDFs in a few clicks.
              </p>
            </div>
          </div>

          <button 
            onClick={triggerFileInput}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#6338F6] text-[#6338F6] rounded-md text-xs font-semibold hover:bg-purple-50 transition shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Upload More
          </button>
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 mb-2.5 w-full">
          
          {/* LEFT CONTAINER: Arrange Files */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-lg p-4 shadow-2xs flex flex-col justify-between overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-2 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-sm bg-[#F4F2FF] text-[#6338F6] flex items-center justify-center">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900">Arrange Files</h2>
                  <p className="text-[10px] text-slate-400">Drag and drop to change the order</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isMergeReady && (
                  <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Select at least 2 files
                  </span>
                )}
                <span className="px-2 py-0.5 bg-[#F4F2FF] text-[#6338F6] text-[10px] font-bold rounded-sm">
                  Total Files: {files.length}
                </span>
              </div>
            </div>

            {/* Scrollable File List */}
            <div className="space-y-1.5 overflow-y-auto pr-1 flex-1">
              {files.map((file, index) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between bg-white border border-slate-200/70 rounded-md px-3.5 py-2 shadow-2xs hover:border-[#6338F6]/40 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <GripVertical className="w-3.5 h-3.5 text-slate-400 cursor-grab shrink-0" />
                    
                    <span className="w-4 h-4 rounded-sm bg-[#6338F6] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>

                    {/* PDF Badge Icon */}
                    <div className="w-6 h-6 bg-[#FFF0F0] border border-[#FFE0E0] rounded-sm flex items-center justify-center shrink-0">
                      <span className="text-[7px] font-black text-[#E53935] uppercase">PDF</span>
                    </div>

                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 truncate leading-tight">{file.name}</p>
                      <p className="text-[9px] text-slate-400">{file.size}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-medium text-slate-500">{file.size}</span>
                    <button 
                      onClick={() => handleRemoveFile(file.id)}
                      className="p-1 text-[#E53935] hover:bg-red-50 rounded-sm transition cursor-pointer"
                      title="Remove File"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Inner Dashed Drop Box */}
            <div 
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border border-dashed border-[#C7BEFE] bg-[#F9F8FF] rounded-md py-2.5 px-3 text-center transition hover:bg-[#F3F0FF] cursor-pointer shrink-0 mt-2"
            >
              <UploadCloud className="w-4 h-4 text-[#6338F6] mx-auto mb-0.5" />
              <p className="text-xs font-bold text-slate-800">
                Drag & drop more PDF files here
              </p>
              <p className="text-[10px] text-slate-500">
                or <span className="text-[#6338F6] font-semibold underline">click to browse</span>
              </p>
              <p className="text-[9px] text-slate-400">Max file size: 100MB</p>
            </div>

          </div>

          {/* RIGHT CONTAINER: Merge Settings */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-lg p-4 shadow-2xs flex flex-col justify-between shrink-0">
            
            <div>
              {/* Settings Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-[#F4F2FF] text-[#6338F6] flex items-center justify-center">
                  <Settings className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-xs font-bold text-slate-900">Merge Settings</h2>
              </div>

              {/* Page Size Select */}
              <div className="space-y-1 mb-3">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">Page Size</label>
                <div className="relative">
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-md px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none focus:border-[#6338F6] appearance-none pr-7 cursor-pointer"
                  >
                    <option>As in Source (Recommended)</option>
                    <option>A4 (210 x 297 mm)</option>
                    <option>US Letter</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Page Margin Radio Buttons */}
              <div className="space-y-1 mb-3">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">Page Margin</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['No Margin', 'Small', 'Large'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setMargin(option)}
                      className={`py-1.5 px-1 text-[11px] font-semibold rounded-md border text-center transition cursor-pointer ${
                        margin === option
                          ? 'border-[#6338F6] bg-white text-[#6338F6] ring-1 ring-[#6338F6]'
                          : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between shrink-0 w-full">
          <button 
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Tools
          </button>

          <button 
            disabled={!isMergeReady}
            className={`flex items-center gap-1.5 px-5 py-1.5 rounded-md text-xs font-semibold shadow-xs transition ${
              isMergeReady
                ? 'bg-[#6338F6] hover:bg-[#5229E0] text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Merge PDF
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </main>
    </div>
  );
};

export default MergePdf;