import React, { useState, useRef } from 'react';
import { 
  Unlock, 
  Trash2, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight,
  Info,
  LockKeyhole,
  Zap
} from 'lucide-react';
import UploadBox from '../../components/upload/uploadbox';

const UnlockPdf = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const fileInputRef = useRef(null);

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
      pages: '12 pages',
      rawFile: incomingFile
    });
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPassword('');
  };

  // 1. FIRST SCREEN: UploadBox
  if (!file) {
    return (
      <UploadBox
        titlePrefix="Unlock"
        titleHighlight="PDF"
        subTitle="Enter the password to unlock and access your PDF file"
        supportedFormat="FILES"
        headerIcon={<Unlock className="w-10 h-10 text-indigo-600" />}
        acceptTypes="application/pdf,.pdf"
        multiple={false}
        onFilesSelect={handleFileSelect}
        onFileSelect={handleFileSelect}
      />
    );
  }

  // 2. MAIN UNLOCK PDF WORKSPACE (Screen Fitted Desktop & Mobile Re-ordered)
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

      <main className="max-w-6xl w-full mx-auto flex-1 flex flex-col justify-between min-h-0">
        
        {/* WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 w-full flex-1 min-h-0 items-stretch my-auto">
          
          {/* MAIN UNLOCK PDF CARD (ORDER 1 ON MOBILE, RIGHT SIDE ON DESKTOP) */}
          <div className="order-1 lg:order-2 lg:col-span-7 w-full lg:max-w-[520px] lg:ml-auto bg-white border border-slate-200/80 rounded-lg p-4 sm:p-6 shadow-2xs flex flex-col justify-between h-full">
            
            {/* Top Info Block */}
            <div className="space-y-4 sm:space-y-5">
              {/* Header Section */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#6338F6] rounded-md flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Unlock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">Unlock PDF</h1>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                    Enter the password to unlock and access your PDF file.
                  </p>
                </div>
              </div>

              {/* Selected PDF Card */}
              <div className="border border-slate-200/80 rounded-md p-2.5 sm:p-3 flex items-center justify-between bg-white shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-8 bg-[#FFF0F0] border border-[#FFE0E0] rounded-sm flex items-center justify-center shrink-0">
                    <span className="text-[8px] font-black text-[#E53935] uppercase">PDF</span>
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 truncate leading-tight">{file.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{file.size} &nbsp;•&nbsp; {file.pages}</p>
                  </div>
                </div>

                <button 
                  onClick={handleRemoveFile}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-sm transition cursor-pointer"
                  title="Remove File"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-[11px] sm:text-xs font-bold text-slate-800">Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 sm:top-3 text-slate-400">
                    <LockKeyhole className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter PDF password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-md pl-9 pr-10 py-2 sm:py-2.5 bg-white text-slate-800 focus:outline-none focus:border-[#6338F6]"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 sm:top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>
                </div>
              </div>

              {/* Security Callout Box */}
              <div className="bg-[#F6F5FF] border border-[#EBE9FE] rounded-md p-3 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#6338F6] shrink-0 mt-0.5" />
                <div className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                  <p>We do not upload or store your files.</p>
                  <p className="font-semibold text-slate-700">Your files are 100% secure and private.</p>
                </div>
              </div>
            </div>

            {/* Action Submit Button (Shifted to bottom end) */}
            <div className="mt-auto pt-4 sm:pt-6">
              <button 
                disabled={!password}
                className={`w-full py-2.5 sm:py-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition ${
                  password 
                    ? 'bg-[#6338F6] hover:bg-[#5229E0] text-white cursor-pointer' 
                    : 'bg-[#6338F6]/40 text-white cursor-not-allowed'
                }`}
              >
                <Unlock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Unlock PDF</span>
              </button>
            </div>

          </div>

          {/* LEFT AD BANNER (ORDER 2 ON MOBILE, LEFT SIDE ON DESKTOP) */}
          <div className="order-2 lg:order-1 lg:col-span-5 bg-gradient-to-b from-purple-50/60 via-white to-indigo-50/40 border border-slate-200/80 rounded-lg p-4 sm:p-5 shadow-2xs flex flex-col justify-between h-full">
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

        </div>

      </main>
    </div>
  );
};

export default UnlockPdf;