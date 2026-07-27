import React, { useState, useRef } from 'react';
import { 
  Lock, 
  Trash2, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw,
  Info,
  Sparkles,
  Zap
} from 'lucide-react';
import UploadBox from '../../components/upload/uploadbox';

const ProtectPdf = () => {
  const [file, setFile] = useState(null);
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    setConfirmPassword('');
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { label: '', level: 0, color: 'bg-slate-200' };
    if (password.length < 5) return { label: 'Weak', level: 1, color: 'text-red-500', barColor: 'bg-red-500' };
    if (password.length < 8) return { label: 'Medium', level: 2, color: 'text-amber-500', barColor: 'bg-amber-500' };
    return { label: 'Strong', level: 4, color: 'text-emerald-500', barColor: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();
  const isPasswordMatched = password && confirmPassword && password === confirmPassword;
  const isReady = file && isPasswordMatched;

  // 1. FIRST VIEW: UploadBox
  if (!file) {
    return (
      <UploadBox
        titlePrefix="Protect"
        titleHighlight="PDF"
        subTitle="Add password to protect your PDF file and prevent unauthorized access"
        supportedFormat="FILES"
        headerIcon={<Lock className="w-10 h-10 text-indigo-600" />}
        acceptTypes="application/pdf,.pdf"
        multiple={false}
        onFilesSelect={handleFileSelect}
        onFileSelect={handleFileSelect}
      />
    );
  }

  // 2. MAIN LAYOUT
  return (
    <div className="w-full min-h-screen lg:min-h-0 lg:h-[calc(100vh-65px)] bg-[#F8FAFC] p-3 sm:p-4 font-sans text-slate-800 lg:overflow-hidden flex flex-col justify-between">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-0 items-stretch">
          
          {/* LEFT COLUMN: Hidden on mobile/small screen (`hidden lg:flex`) */}
          <div className="hidden lg:flex lg:col-span-3 bg-gradient-to-b from-purple-50/50 via-white to-indigo-50/30 border border-slate-200/80 rounded-lg p-3.5 shadow-2xs flex-col justify-between h-full overflow-hidden">
            <div>
              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                Ad
              </span>
              <h2 className="text-base font-black text-slate-900 leading-tight mt-1">
                All PDF Tools <br />
                <span className="text-[#6338F6]">In One Place</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Convert, Compress, Merge, Split, Protect & more.
              </p>

              <ul className="space-y-1.5 mt-3 text-[11px] font-medium text-slate-700">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6338F6] shrink-0" /> Fast & Easy to Use
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6338F6] shrink-0" /> 100% Secure
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6338F6] shrink-0" /> Works on All Devices
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6338F6] shrink-0" /> No Installation Required
                </li>
              </ul>
            </div>

            <div className="space-y-2 mt-4 lg:mt-0">
              <button className="w-full flex items-center justify-center gap-1.5 bg-[#6338F6] text-white py-2 rounded-md text-xs font-bold shadow-xs hover:bg-[#5229E0] transition cursor-pointer">
                <span>Explore All Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="bg-[#6338F6]/10 border border-[#6338F6]/20 rounded-lg p-2.5 text-center flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-[#6338F6]" />
                <p className="text-[11px] font-bold text-slate-800">DocNexus Tools Suite</p>
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: Set Password Workspace */}
          <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-lg p-4 sm:p-5 shadow-2xs flex flex-col justify-start gap-4 h-full overflow-y-auto">
            
            {/* Header & Selected File */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#6338F6] rounded-md flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">Set Password</h1>
                  <p className="text-[10px] sm:text-xs text-slate-500">
                    Add a password to secure your PDF file and prevent unauthorized access.
                  </p>
                </div>
              </div>

              {/* Selected File Card */}
              <div className="border border-slate-200/80 rounded-md px-3 py-2 flex items-center justify-between bg-white shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 bg-[#FFF0F0] border border-[#FFE0E0] rounded-sm flex items-center justify-center shrink-0">
                    <span className="text-[8px] font-black text-[#E53935] uppercase">PDF</span>
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 truncate leading-tight">{file.name}</p>
                    <p className="text-[10px] text-slate-400">{file.size} &nbsp;|&nbsp; {file.pages}</p>
                  </div>
                </div>

                <button 
                  onClick={handleRemoveFile}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-sm transition cursor-pointer"
                  title="Remove File"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Change File Controls */}
              <div className="flex items-center justify-between pt-0.5">
                <button 
                  onClick={triggerFileInput}
                  className="flex items-center gap-1.5 px-2.5 py-1 border border-slate-200 bg-white hover:bg-slate-50 text-[#6338F6] rounded-md text-[11px] font-semibold shadow-2xs transition cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Change File
                </button>
                <span className="text-[10px] text-slate-400 font-medium">Max file size: 100MB</span>
              </div>
            </div>

            {/* Password Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Password */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-800">Password</label>
                <div className="relative">
                  <div className="absolute left-2.5 top-2.5 text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-md pl-8 pr-8 py-2 bg-white text-slate-800 focus:outline-none focus:border-[#6338F6]"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-800">Confirm Password</label>
                <div className="relative">
                  <div className="absolute left-2.5 top-2.5 text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full text-xs border rounded-md pl-8 pr-8 py-2 bg-white text-slate-800 focus:outline-none transition ${
                      confirmPassword && !isPasswordMatched 
                        ? 'border-red-400 focus:border-red-500' 
                        : 'border-slate-200 focus:border-[#6338F6]'
                    }`}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <div className="flex items-center gap-1 text-slate-800">
                  <span>Password Strength</span>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
                <span className={strength.color}>{strength.label || '—'}</span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div 
                    key={step} 
                    className={`h-1 rounded-sm transition-all ${
                      step <= strength.level ? strength.barColor : 'bg-slate-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* AES-256 Encryption Callout
            <div className="bg-[#F6F5FF] border border-[#EBE9FE] rounded-md p-2.5 flex items-start gap-2.5">
              <div className="w-6 h-6 bg-[#6338F6] rounded-md flex items-center justify-center text-white shrink-0 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-900">AES-256 Encryption</h4>
                <p className="text-[10px] text-slate-500 leading-snug">
                  Your PDF will be encrypted using industry-standard AES-256 encryption.
                </p>
              </div>
            </div> */}

            {/* Action Button */}
            <div className="space-y-1.5 mt-auto pt-2">
              <button 
                disabled={!isReady}
                className={`w-full py-2.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition ${
                  isReady 
                    ? 'bg-[#6338F6] hover:bg-[#5229E0] text-white cursor-pointer' 
                    : 'bg-[#6338F6]/40 text-white cursor-not-allowed'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Set Password</span>
              </button>
              
              <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#6338F6]" />
                We never access or store your password.
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: Upgrade to DocNexus Pro Banner (Shows on both mobile & desktop) */}
          <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-lg p-3.5 shadow-2xs flex flex-col justify-between text-center h-full overflow-hidden">
            <div>
              <p className="text-[11px] font-bold text-slate-700">Upgrade to</p>
              <h3 className="text-sm font-black text-slate-900">
                Doc<span className="text-[#6338F6]">Nexus Pro</span>
              </h3>
              <p className="text-[10px] text-slate-500">
                Unlock powerful tools and features.
              </p>

              <ul className="space-y-1.5 text-left w-full text-[11px] font-medium text-slate-700 pt-3">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6338F6] shrink-0" /> Unlimited Access
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6338F6] shrink-0" /> No Watermark
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6338F6] shrink-0" /> Faster Processing
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6338F6] shrink-0" /> Priority Support
                </li>
              </ul>
            </div>

            <div className="space-y-2 mt-4 lg:mt-0">
              <div className="w-full bg-gradient-to-tr from-purple-100 to-indigo-50 border border-purple-200/60 rounded-lg p-2.5 flex flex-col items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#6338F6]" />
                <span className="text-[10px] font-bold text-slate-800 mt-0.5">DocNexus Pro Features</span>
              </div>

              <button className="w-full bg-[#6338F6] hover:bg-[#5229E0] text-white py-2 rounded-md text-xs font-bold shadow-xs transition cursor-pointer">
                Try DocNexus Pro
              </button>

              <p className="text-[9px] text-slate-400">
                7-day free trial. Cancel anytime.
              </p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default ProtectPdf;