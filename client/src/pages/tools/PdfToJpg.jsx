import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, Eye, FileImage, FileText, Image as ImageIcon, Settings2, Sparkles } from 'lucide-react';
import UploadBox from '../../components/upload/uploadbox';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const PREVIEW_LIMIT = 8;

const getSelectedPages = (pageCount, useAllPages, customRange) => {
  if (useAllPages) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const pages = new Set();

  for (const part of customRange.split(',')) {
    const [startValue, endValue] = part.trim().split('-');
    const start = Number.parseInt(startValue, 10);
    const end = endValue ? Number.parseInt(endValue, 10) : start;
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start || end > pageCount) return null;
    for (let page = start; page <= end; page += 1) pages.add(page);
  }

  return pages.size ? [...pages].sort((a, b) => a - b) : null;
};

const PdfToJpg = () => {
  const navigate = useNavigate();
  const [pdfFile, setPdfFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [previews, setPreviews] = useState([]);
  const [previewPage, setPreviewPage] = useState(1);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [allPages, setAllPages] = useState(true);
  const [customRange, setCustomRange] = useState('');
  const [quality, setQuality] = useState(90);
  const [format, setFormat] = useState('jpeg');
  const [rangeError, setRangeError] = useState('');

  const loadPreviewPage = async (batchNumber, file = pdfFile, totalPages = pageCount) => {
    if (!file || !totalPages) return;

    setIsLoadingPreview(true);
    try {
      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const firstPage = (batchNumber - 1) * PREVIEW_LIMIT + 1;
      const lastPage = Math.min(firstPage + PREVIEW_LIMIT - 1, totalPages);
      const thumbnails = [];

      for (let pageNumber = firstPage; pageNumber <= lastPage; pageNumber += 1) {
        try {
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 0.28 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport }).promise;
          thumbnails.push({ pageNumber, url: canvas.toDataURL('image/jpeg', 0.7) });
        } catch (error) {
          console.warn(`Unable to render preview for page ${pageNumber}:`, error);
        }
      }

      setPreviews(thumbnails);
      setPreviewPage(batchNumber);
    } catch (error) {
      console.error('Unable to load PDF previews:', error);
      alert('Unable to load these PDF previews. Please try again.');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleFilesSelect = async (files) => {
    const file = files?.[0];
    if (!file || (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf'))) {
      alert('Please select a valid PDF file.');
      return;
    }

    setPdfFile(file);
    setPreviews([]);
    setPreviewPage(1);
    setAllPages(true);
    setCustomRange('');
    setRangeError('');
    setIsLoadingPreview(true);

    try {
      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      setPageCount(pdf.numPages);
      await loadPreviewPage(1, file, pdf.numPages);
    } catch (error) {
      console.error('Unable to open PDF:', error);
      alert('Unable to read this PDF file. Please try another file.');
      setPdfFile(null);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleConvert = () => {
    const pages = getSelectedPages(pageCount, allPages, customRange);
    if (!pages) {
      setRangeError(`Enter pages between 1 and ${pageCount}, for example: 1-5, 8, 10-12.`);
      return;
    }

    navigate('/processing', {
      state: { files: [pdfFile], toolType: 'pdf-to-jpg', jpgSettings: { pages, quality, format } },
    });
  };

  if (!pdfFile) {
    return <div className="min-h-screen bg-[#F8FAFD] flex items-center justify-center">
      <UploadBox titlePrefix="PDF" 
      titleHighlight="to JPG" 
      titleSuffix="Converter" 
      subTitle="Convert PDF pages into high-quality images." 
      supportedFormat="PDF" 
      maxSize="100 MB" 
      // headerIcon={
      //     <div className="p-4 bg-blue-50 rounded-lg flex shrink-0 text-blue-500 border border-blue-100 shadow-sm">
      //       <ImageIcon className='w-8 h-8'/>
      //     </div>
      //   }
      onFilesSelect={handleFilesSelect} 
      />
      </div>;
  }

  const selectedPageCount = getSelectedPages(pageCount, allPages, customRange)?.length || 0;
  const formatLabel = format.toUpperCase();

  return (
    <main className="min-h-screen bg-[#F8FAFD] p-3 sm:p-5 xl:h-[calc(100vh-88px)] xl:min-h-0 overflow-x-hidden">
      <div className="mx-auto flex h-full w-full max-w-[1540px] min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <header className="mb-2 flex shrink-0 flex-col gap-3 border-b border-slate-100 pb-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3"><div className="rounded-lg bg-red-50 p-2 text-red-500"><FileImage className="h-8 w-8" /></div><div><h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">PDF to JPEG</h1><p className="mt-0.5 text-sm text-slate-600">Convert PDF pages to high quality JPEG images</p></div></div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"><FileText className="h-6 w-6 text-red-500" /><div><p className="max-w-48 truncate text-sm font-bold text-slate-800">{pdfFile.name}</p><p className="text-xs text-slate-500">{pageCount} pages · {(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p></div><button type="button" onClick={() => setPdfFile(null)} className="ml-2 text-xs font-bold text-violet-600 hover:text-violet-800">Change</button></div>
        </header>

        <div className="grid min-h-0 flex-1 min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
          <section className="flex min-h-0 min-w-0 flex-col rounded-xl border border-slate-200 p-4 overflow-hidden">
            <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-3"><Eye className="h-6 w-6 text-violet-600" /><div><h2 className="font-bold text-slate-900">Preview</h2><p className="text-xs text-slate-500">See how your images will look</p></div></div><p className="text-sm font-medium text-slate-600">{allPages ? `All ${pageCount}` : `${selectedPageCount || 'Selected'} pages`} will be converted to {formatLabel}</p></div>
            <div className="min-h-0 flex-1 min-w-0">
              {isLoadingPreview ? <div className="flex h-full min-h-72 items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" /></div> : <div className="grid h-full grid-cols-2 gap-3 sm:grid-cols-4 sm:grid-rows-2">{previews.map((preview) => <article key={preview.pageNumber} className="flex min-h-0 min-w-0 flex-col"><div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm"><img src={preview.url} alt={`Preview page ${preview.pageNumber}`} className="h-full w-full object-contain" /></div><p className="shrink-0 pt-1 text-center text-xs font-bold text-slate-700">{preview.pageNumber}</p></article>)}</div>}
            </div>
            {pageCount > PREVIEW_LIMIT && <div className="mt-2 flex shrink-0 items-center justify-center gap-5 text-sm font-semibold text-slate-700"><button type="button" onClick={() => loadPreviewPage(previewPage - 1)} disabled={isLoadingPreview || previewPage === 1} aria-label="Previous preview pages" className="rounded-lg p-1.5 disabled:cursor-not-allowed disabled:text-slate-300"><ChevronLeft className="h-5 w-5" /></button><span>{previewPage} / {Math.ceil(pageCount / PREVIEW_LIMIT)}</span><button type="button" onClick={() => loadPreviewPage(previewPage + 1)} disabled={isLoadingPreview || previewPage === Math.ceil(pageCount / PREVIEW_LIMIT)} aria-label="Next preview pages" className="rounded-lg border border-violet-100 p-1.5 text-violet-600 shadow-sm hover:bg-violet-50 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300"><ChevronRight className="h-5 w-5" /></button></div>}
          </section>

          <aside className="rounded-xl border border-slate-200 p-4 min-w-0 xl:overflow-hidden">
            <div className="mb-3 flex items-center gap-3"><Settings2 className="h-6 w-6 text-violet-600" /><div><h2 className="text-lg font-bold text-slate-900">Page Range</h2><p className="text-xs text-slate-500">Choose pages to convert</p></div></div>
            <label className="mb-3 flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-800"><input type="radio" checked={allPages} onChange={() => { setAllPages(true); setRangeError(''); }} className="h-5 w-5 accent-violet-600" />All Pages</label>
            <div className="mb-3 flex items-center gap-3"><label className="flex cursor-pointer items-center gap-3 whitespace-nowrap text-sm font-semibold text-slate-800"><input type="radio" checked={!allPages} onChange={() => setAllPages(false)} className="h-5 w-5 accent-violet-600" />Custom Range</label><input value={customRange} onChange={(event) => { setCustomRange(event.target.value); setAllPages(false); setRangeError(''); }} placeholder="e.g. 1-5, 8, 10-12" className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500" /></div>
            {rangeError && <p className="-mt-3 mb-3 text-xs font-medium text-red-600">{rangeError}</p>}
            <div className="border-t border-slate-200 py-3"><div className="mb-3 flex items-center gap-3"><ImageIcon className="h-5 w-5 text-violet-600" /><div><h2 className="font-bold text-slate-900">Image Quality</h2><p className="text-xs text-slate-500">Select output quality</p></div></div><div className="flex items-center gap-3"><input type="range" min="50" max="100" step="5" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="h-2 flex-1 accent-violet-600" /><span className="rounded-lg bg-violet-50 px-3 py-1.5 font-bold text-violet-700">{quality}%</span></div><div className="mt-1 flex justify-between text-xs text-slate-500"><span>Low</span><span>Medium</span><span>High</span><span className="font-semibold text-violet-600">Best</span></div></div>
            <div className="border-t border-slate-200 py-3"><div className="mb-2 flex items-center gap-3"><FileImage className="h-5 w-5 text-violet-600" /><div><h2 className="font-bold text-slate-900">Image Format</h2><p className="text-xs text-slate-500">Choose image format</p></div></div><select value={format} onChange={(event) => setFormat(event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-violet-500"><option value="jpeg">JPEG</option><option value="png">PNG</option></select></div>
            <button type="button" disabled={isLoadingPreview} onClick={handleConvert} className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 font-bold text-white shadow-lg shadow-violet-200 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"><Sparkles className="h-5 w-5" />Convert to {formatLabel}</button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default PdfToJpg;