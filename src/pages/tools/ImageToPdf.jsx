import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Upload, Trash2, GripVertical, Plus, 
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, 
  RotateCcw, FileText, ChevronDown 
} from 'lucide-react';
import UploadBox from '../../components/common/uploadbox';

const MAX_IMAGE_SIZE_MB = 100;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const ImageToPdf = () => {
  const navigate = useNavigate();
  
  // State Management
  const [uploadedImages, setUploadedImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  
  // Drag and Drop Trackers
  const dragItemIndex = useRef(null);
  const dragOverItemIndex = useRef(null);

  // PDF Settings States
  const [pageSize, setPageSize] = useState('A4 (210 x 297 mm)');
  const [orientation, setOrientation] = useState('Portrait');
  const [margins, setMargins] = useState('Normal');
  const [imageFit, setImageFit] = useState('Fit to page');
  const [imageQuality, setImageQuality] = useState('High');
  const [addCaption, setAddCaption] = useState(false);
  const [mergePdf, setMergePdf] = useState(false);

  const isOriginalSize = pageSize === "Original Size";

  // --- AUTOMATION LINKAGE EFFECT ---
  useEffect(() => {
    if (isOriginalSize && uploadedImages[currentPage - 1]) {
      const activeImage = uploadedImages[currentPage - 1];
      setOrientation(activeImage.aspectRatio > 1 ? 'Landscape' : 'Portrait');
      setImageFit('Fit to page'); 
    }
  }, [pageSize, isOriginalSize, currentPage, uploadedImages]);

  // Helper to read image dimensions asynchronously
  const getImageDimensionsAsync = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve({ width: 0, height: 0 });
      img.src = url;
    });
  };

  // Dynamic Page Dimension Calculator based on Size & Orientation
  const getPageDimensions = () => {
    const activeImage = uploadedImages[currentPage - 1];

    if (isOriginalSize && activeImage && activeImage.aspectRatio) {
      const maxCanvasWidth = 620;
      const maxCanvasHeight = 480;
      const imgRatio = activeImage.aspectRatio;
      const previewMargin = margins === 'Normal' ? 24 : margins === 'Small' ? 12 : 0;
      const availableWidth = maxCanvasWidth - previewMargin * 2;
      const availableHeight = maxCanvasHeight - previewMargin * 2;

      let contentWidth = availableWidth;
      let contentHeight = availableHeight;

      if (imgRatio > availableWidth / availableHeight) {
        contentHeight = availableWidth / imgRatio;
      } else {
        contentWidth = availableHeight * imgRatio;
      }

      return {
        width: `${contentWidth + previewMargin * 2}px`,
        height: `${contentHeight + previewMargin * 2}px`
      };
    }

    let width = 310;  
    let height = 440;

    if (pageSize.includes('Letter')) {
      width = 340;
      height = 440;
    } else if (pageSize.includes('Legal')) {
      width = 267;
      height = 440;
    }

    return orientation === 'Portrait' 
      ? { width: `${width}px`, height: `${height}px` }
      : { width: `${height}px`, height: `${width}px` };
  };

  // Core Dynamic File Handler
  const processFiles = async (filesList) => {
    if (!filesList || filesList.length === 0) return;

    const files = Array.from(filesList);
    const oversizedFiles = files.filter(file => file.size > MAX_IMAGE_SIZE_BYTES);
    const validFiles = files.filter(file => file.size <= MAX_IMAGE_SIZE_BYTES);

    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(file => file.name).join(', ');
      alert(`Some images were skipped because they are larger than ${MAX_IMAGE_SIZE_MB} MB: ${fileNames}`);
    }

    if (validFiles.length === 0) return;

    const newImagesPromises = validFiles.map(async (file, index) => {
      const url = URL.createObjectURL(file);
      const dims = await getImageDimensionsAsync(url);
      
      return {
        id: `img-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 4)}`,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        url,
        rawFile: file,
        width: dims.width,
        height: dims.height,
        aspectRatio: dims.width && dims.height ? dims.width / dims.height : 1
      };
    });

    const resolvedNewImages = await Promise.all(newImagesPromises);

    setUploadedImages((prev) => {
      const newList = [...prev, ...resolvedNewImages];
      if (prev.length === 0 && newList.length > 0) {
        setCurrentPage(1);
      }
      return newList;
    });
  };

  // NATIVE DRAG & DROP REORDER IMPLEMENTATION
  const handleDragStart = (index) => {
    dragItemIndex.current = index;
  };

  const handleDragEnter = (index) => {
    dragOverItemIndex.current = index;
  };

  const handleDragSort = () => {
    if (dragItemIndex.current === null || dragOverItemIndex.current === null) return;
    
    const copyListItems = [...uploadedImages];
    const dragItemContent = copyListItems[dragItemIndex.current];
    
    copyListItems.splice(dragItemIndex.current, 1);
    copyListItems.splice(dragOverItemIndex.current, 0, dragItemContent);
    
    const targetPageIndex = dragOverItemIndex.current + 1;
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
    
    setUploadedImages(copyListItems);
    setCurrentPage(targetPageIndex);
  };

  const handleInputChange = (e) => { e.target.files && processFiles(e.target.files); };
  const handleNextPage = () => { if (currentPage < uploadedImages.length) setCurrentPage(prev => prev + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };

  const handleDeleteImage = (id) => {
    const targetImage = uploadedImages.find(img => img.id === id);
    if (targetImage) {
      URL.revokeObjectURL(targetImage.url);
    }

    const updated = uploadedImages.filter(img => img.id !== id);
    setUploadedImages(updated);
    if (currentPage > updated.length) {
      setCurrentPage(updated.length > 0 ? updated.length : 1);
    }
  };

  const handleReset = () => {
    uploadedImages.forEach(img => URL.revokeObjectURL(img.url));
    setUploadedImages([]);
    setCurrentPage(1);
    setZoom(100);
  };

  // ⚡ INTERACTION PIPELINE REDIRECTION (Synchronized with Fixed Parsing State Layouts)
  const handleConvertToPdf = () => {
    if (uploadedImages.length === 0) return;

    // Enforce parsing structures properly carrying native binary fields safely
    const formattedFiles = uploadedImages.map(img => ({
      name: img.name,
      size: img.size,
      url: img.url,
      rawFile: img.rawFile // 🌟 Carrying actual native binary file stream for Processing.jsx
    }));

    // Direct routing to Processing screen passing standardized routing state packages
    navigate('/processing', {
      state: {
        files: formattedFiles,        // Processing page expects 'files' array
        rawFiles: formattedFiles,     // Result page expects 'rawFiles' array to show size properly
        toolType: 'image-to-pdf',
        pdfSettings: {
          pageSize,
          orientation,
          margins,
          imageFit,
          imageQuality,
          addCaption,
          mergePdf
        }
      }
    });
  };

  if (uploadedImages.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFD] flex items-center justify-center">
        <UploadBox 
          titlePrefix="Image"
          titleHighlight="to PDF"
          titleSuffix="Converter"
          subTitle="Convert your JPG, PNG, or WebP images into a single high-quality PDF document instantly."
          supportedFormat="IMAGES"
          maxSize={`${MAX_IMAGE_SIZE_MB} MB`}
          onFilesSelect={processFiles}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F9FAFC] text-[#1E293B] flex flex-col xl:h-[calc(100dvh-4rem)] xl:min-h-0 xl:overflow-hidden">
      
      {/* Sub-Header Actions */}
      <div className="bg-white border-b border-[#E2E8F0] px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 xl:min-h-16 xl:px-6 xl:py-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleReset}
            className="p-2.5 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] transition xl:p-2"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Image to PDF</h1>
            <p className="text-xs text-[#64748B]">Convert your images into a high-quality PDF</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              aria-label="Previous image"
              className="p-1 border border-[#E2E8F0] rounded-sm cursor-pointer text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-40 transition"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-semibold px-2 py-1 bg-[#F1F5F9] rounded-lg">
              {currentPage} / {uploadedImages.length}
            </span>
            <button 
              onClick={handleNextPage} 
              disabled={currentPage === uploadedImages.length}
              aria-label="Next image"
              className="p-1 border border-[#E2E8F0] rounded-sm cursor-pointer text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-40 transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex items-center border border-[#E2E8F0] rounded-sm bg-white shadow-xs overflow-hidden">
            <button onClick={() => setZoom(z => Math.max(50, z - 10))} aria-label="Zoom out" className="p-1.5 text-[#64748B] hover:bg-[#F1F5F9] transition cursor-pointer">
              <ZoomOut size={16} />
            </button>
            <span className="text-xs font-bold px-3 border-x border-[#E2E8F0] text-[#1E293B] min-w-[55px] text-center">
              {zoom}%
            </span>
            <button onClick={() => setZoom(z => Math.min(150, z + 10))} aria-label="Zoom in" className="p-1.5 text-[#64748B] cursor-pointer hover:bg-[#F1F5F9] transition">
              <ZoomIn size={16} />
            </button>
          </div>
          <button onClick={() => setZoom(100)} className="flex items-center gap-1.5 text-xs font-bold border border-[#E2E8F0] bg-white text-[#1E293B] px-3 py-1.5 rounded-sm cursor-pointer shadow-xs hover:bg-[#F1F5F9] transition">
            <Maximize size={14} />
            <span>Fit to page</span>
          </button>
        </div>
        
        <label className="flex items-center justify-center gap-2 text-sm font-semibold text-[#4F46E5] border-2 border-dashed border-[#4F46E5] hover:bg-[#EEF2FF] px-5 py-2.5 rounded-sm cursor-pointer transition xl:px-4 xl:py-1.5 xl:text-xs">
          <Plus size={18} />
          <span>Add More Images</span>
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleInputChange} />
        </label>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[minmax(280px,3fr)_minmax(0,7fr)_minmax(330px,3fr)] gap-6 p-6 max-w-[1600px] w-full mx-auto xl:overflow-hidden">
        
        {/* LEFT COLUMN: LIST */}
        <section className="bg-white border border-[#E2E8F0] rounded-lg p-5 flex flex-col justify-between shadow-sm min-h-[400px] xl:min-h-0 xl:h-full xl:overflow-hidden">
          <div className="min-h-0 flex flex-1 flex-col">
            <h2 className="font-bold text-sm tracking-wide mb-4">Uploaded Images ({uploadedImages.length})</h2>
            <div className="space-y-3 overflow-y-auto pr-1 flex-1 max-h-[300px] xl:max-h-none">
              {uploadedImages.map((img, idx) => (
                <div 
                  key={img.id} 
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragEnter={() => handleDragEnter(idx)}
                  onDragEnd={handleDragSort}
                  onDragOver={(e) => e.preventDefault()}
                  className={`flex items-center justify-between p-3 border rounded-lg bg-[#FAFAFA] cursor-pointer transition active:opacity-60 ${
                    currentPage === idx + 1 ? 'border-[#4F46E5]' : 'border-[#E2E8F0]'
                  }`}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  <div className="flex items-center gap-3">
                    <img src={img.url} alt="" className="w-12 h-12 object-cover rounded-lg border border-[#E2E8F0]" />
                    <div className="truncate max-w-[120px]">
                      <p className="text-sm font-semibold truncate">{img.name}</p>
                      <p className="text-xs text-[#94A3B8] font-medium">{img.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#94A3B8]" onClick={(e) => e.stopPropagation()}>
                    <button className="p-1.5 hover:text-[#1E293B] cursor-grab active:cursor-grabbing" aria-label="Drag to reorder">
                      <GripVertical size={16} />
                    </button>
                    <button onClick={() => handleDeleteImage(img.id)} className="p-1.5 hover:text-red-500 transition" aria-label="Delete image">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <label className="relative mt-4 border-2 border-dashed border-[#D9DDE3] bg-[#F8FAFC] rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#F1F5F9] transition block">
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleInputChange} />
              <div className="bg-white p-2.5 rounded-lg shadow-sm text-[#4F46E5] mb-2 border border-[#E2E8F0]">
                <Upload size={20} />
              </div>
              <p className="text-xs font-semibold text-[#1E293B]">Drag & drop more images here</p>
              <p className="text-[10px] text-[#94A3B8] mt-1 font-medium">JPG, PNG, WEBP (Max {MAX_IMAGE_SIZE_MB}MB each)</p>
            </label>
          </div>
        </section>

        {/* CENTER COLUMN: PREVIEW */}
        <section className="flex flex-col gap-4 min-h-0">
          <div className="bg-white border border-[#E2E8F0] rounded-lg flex-1 min-h-[400px] p-6 flex flex-col justify-between shadow-sm xl:min-h-0">
            <div className="flex-1 min-h-0 bg-[#F8FAFC] rounded-lg flex items-center justify-center p-4 xl:p-6 overflow-hidden border border-[#F1F5F9]">
              {uploadedImages[currentPage - 1] && (
                <div 
                  className="bg-white shadow-lg border border-[#E2E8F0] flex items-center justify-center transition-all duration-200 max-w-full max-h-full"
                  style={{ 
                    ...getPageDimensions(),
                    transform: `scale(${zoom / 100})`,
                    padding: margins === 'Normal' ? '24px' : margins === 'Small' ? '12px' : '0px',
                    boxSizing: 'border-box'
                  }}
                >
                  <img 
                    src={uploadedImages[currentPage - 1].url} 
                    alt="" 
                    className={`min-w-0 min-h-0 w-full h-full ${isOriginalSize ? 'object-fill' : imageFit === 'Fit to page' ? 'object-contain' : 'object-cover'} shadow-xs`}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: CONTROLS CONFIGURATION PANEL */}
        <section className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-sm space-y-5 overflow-y-auto xl:h-full xl:min-h-0">
          <h2 className="font-bold text-sm tracking-wide border-b border-[#F1F5F9] pb-2">PDF Settings</h2>
          
          {/* Page Size Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#64748B]">Page Size</label>
            <div className="relative">
              <select 
                value={pageSize} 
                onChange={(e) => {
                  const nextPageSize = e.target.value;
                  setPageSize(nextPageSize);
                  if (nextPageSize === 'Original Size') {
                    setImageFit('Fit to page');
                  } else if (pageSize === 'Original Size') {
                    setOrientation('Portrait');
                    setImageFit('Fit to page');
                  }
                }}
                className="w-full text-xs font-medium border border-[#E2E8F0] rounded-lg p-3 bg-white appearance-none focus:outline-none cursor-pointer"
              >
                <option>Original Size</option>
                <option>A4 (210 x 297 mm)</option>
                <option>Letter (8.5 x 11 in)</option>
                <option>Legal (8.5 x 14 in)</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-3.5 text-[#94A3B8] pointer-events-none" />
            </div>
          </div>

          {/* Orientation Toggle */}
          <div className="space-y-1.5 opacity-100 transition">
            <label className="text-xs font-semibold text-[#64748B]">Orientation</label>
            <div className={`grid grid-cols-2 p-1 rounded-lg transition ${isOriginalSize ? 'bg-[#F1F5F9] opacity-55 cursor-not-allowed' : 'bg-[#F1F5F9]'}`}>
              <button 
                disabled={isOriginalSize}
                onClick={() => setOrientation('Portrait')}
                className={`py-2 text-xs font-bold rounded-lg transition ${isOriginalSize ? 'text-[#94A3B8] cursor-not-allowed' : orientation === 'Portrait' ? 'bg-white text-[#4F46E5] shadow-xs' : 'text-[#64748B]'}`}
              >
                Portrait
              </button>
              <button 
                disabled={isOriginalSize}
                onClick={() => setOrientation('Landscape')}
                className={`py-2 text-xs font-bold rounded-lg transition ${isOriginalSize ? 'text-[#94A3B8] cursor-not-allowed' : orientation === 'Landscape' ? 'bg-white text-[#4F46E5] shadow-xs' : 'text-[#64748B]'}`}
              >
                Landscape
              </button>
            </div>
          </div>

          {/* Margins Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#64748B]">Margins</label>
            <div className="relative">
              <select 
                value={margins} 
                onChange={(e) => setMargins(e.target.value)}
                className="w-full text-xs font-medium border border-[#E2E8F0] rounded-lg p-3 bg-white appearance-none focus:outline-none cursor-pointer"
              >
                <option>Normal</option>
                <option>Small</option>
                <option>None</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-3.5 text-[#94A3B8] pointer-events-none" />
            </div>
          </div>

          {/* Image Fit Option Matrix */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#64748B]">Image Fit</label>
            <div className="relative">
              <select 
                disabled={isOriginalSize}
                value={imageFit} 
                onChange={(e) => setImageFit(e.target.value)}
                className={`w-full text-xs font-medium border border-[#E2E8F0] rounded-lg p-3 bg-white appearance-none focus:outline-none cursor-pointer ${isOriginalSize ? 'bg-[#F8FAFC] text-[#94A3B8] cursor-not-allowed' : ''}`}
              >
                <option>Fit to page</option>
                <option>Fill page</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-3.5 text-[#94A3B8] pointer-events-none" />
            </div>
          </div>

          {/* Quality Layout Tabs */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#64748B]">Image Quality</label>
            <div className="grid grid-cols-3 p-1 bg-[#F1F5F9] rounded-lg">
              {['Low', 'Medium', 'High'].map((q) => (
                <button 
                  key={q} 
                  onClick={() => setImageQuality(q)}
                  className={`py-2 text-xs font-bold rounded-lg transition ${imageQuality === q ? 'bg-white text-[#4F46E5] shadow-xs' : 'text-[#64748B]'}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Checkboxes */}
          <div className="space-y-3 pt-3 border-t border-[#F1F5F9]">
            <h3 className="font-bold text-xs tracking-wide">More Options</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={addCaption} onChange={(e) => setAddCaption(e.target.checked)} className="w-4 h-4 rounded text-[#4F46E5] accent-[#4F46E5]" />
              <span className="text-xs font-medium text-[#64748B]">Add image name as caption</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={mergePdf} onChange={(e) => setMergePdf(e.target.checked)} className="w-4 h-4 rounded text-[#4F46E5] accent-[#4F46E5]" />
              <span className="text-xs font-medium text-[#64748B]">Merge all images into one PDF</span>
            </label>
          </div>
        </section>

      </main>

      {/* Action Sticky Footer Panel */}
      <footer className="bg-white border-t border-[#E2E8F0] p-4 mt-auto shrink-0 xl:px-5 xl:py-2">
        <div className="max-w-[1550px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <button onClick={() => navigate(-1)} className="w-full sm:w-auto text-sm font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] px-6 py-3 rounded-sm transition xl:px-5 xl:py-2">
            Back to Upload
          </button>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
            <button onClick={handleReset} className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-red-50 hover:text-red-600 px-6 py-3 rounded-sm transition xl:px-5 xl:py-2">
              <RotateCcw size={16} />
              <span>Reset All</span>
            </button>
            <button onClick={handleConvertToPdf} className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] px-10 py-3 rounded-sm shadow-md transition xl:px-8 xl:py-2">
              <FileText size={16} />
              <span>Convert to PDF</span>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default ImageToPdf;