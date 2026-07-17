import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Unlock, Eye, EyeOff, Trash2, UploadCloud, ShieldCheck } from 'lucide-react';

const UnlockPdf = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a PDF file.');
      return;
    }
    setSelectedFile(file);
  };

  const handleInputChange = (event) => {
    handleFileSelect(event.target.files);
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileSelect(event.dataTransfer.files);
  };

  const handleUnlock = () => {
    if (!selectedFile) {
      alert('Please upload a password-protected PDF.');
      return;
    }
    if (!password) {
      alert('Please enter the PDF password.');
      return;
    }

    navigate('/processing', {
      state: {
        files: [selectedFile],
        toolType: 'unlock-pdf',
        password,
      },
    });
  };

  return (
    <div className="bg-[#F7F8FF] px-3 py-4 sm:px-4 sm:py-5">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
          <div className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">1. Upload PDF</p>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">Select the PDF file you want to unlock</h2>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => inputRef.current?.click()}
              className={`group relative cursor-pointer overflow-hidden rounded-lg border-2 border-dashed px-4 py-7 text-center transition ${
                isDragging ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-300 bg-slate-50 hover:border-indigo-300'
              }`}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-600 transition duration-200 group-hover:bg-indigo-200">
                <UploadCloud className="h-7 w-7" />
              </div>
              <p className="text-base font-semibold text-slate-900">Drag & drop your PDF here</p>
              <p className="mt-2 text-sm text-slate-500">or choose a file from your device</p>
              <button
                type="button"
                className="mt-5 inline-flex items-center justify-center rounded-full border border-indigo-500 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50"
              >
                Choose PDF
              </button>
              <p className="mt-5 text-xs text-slate-500">PDF only • Max file size: 100MB</p>
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={handleInputChange}
              />
            </div>

            {selectedFile && (
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      PDF
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{selectedFile.name}</p>
                      <p className="text-sm text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-red-300 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-full rounded-lg border border-slate-200 bg-[#F8F5FF] p-4 shadow-sm sm:p-5">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">2. Enter Password</p>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">Unlock your PDF</h2>
              <p className="mt-2 text-sm text-slate-500">Enter the password used to protect the PDF file.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter PDF password"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Show password
              </label>

              <div className="rounded-lg border border-indigo-100 bg-white p-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="font-semibold text-indigo-600">Your files are secure</p>
                    <p className="mt-1">Files are processed locally and removed after your session.</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleUnlock}
                disabled={!selectedFile || !password}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/15 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Unlock className="h-4 w-4" />
                Unlock PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockPdf;
