import { FileUp, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

const UploadBox = ({
  titlePrefix = 'Upload',
  titleHighlight,
  titleSuffix = '',
  subTitle,
  supportedFormat = 'FILES',
  maxSize,
  headerIcon,
  onFilesSelect,
  acceptTypes, // optional override for input accept attribute
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const isImageUpload = supportedFormat.toUpperCase() === 'IMAGES';
  const accept = acceptTypes
    ? acceptTypes
    : isImageUpload
    ? 'image/jpeg,image/png,image/webp'
    : 'application/pdf,.pdf';

  const submitFiles = (files) => {
    if (files?.length) onFilesSelect?.(Array.from(files));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    submitFiles(event.dataTransfer.files);
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-12 text-center">
      <div className="flex flex-col items-center gap-4 mb-8">
        {headerIcon || <FileUp className="w-10 h-10 text-indigo-600" aria-hidden="true" />}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {titlePrefix}{' '}
            {titleHighlight && <span className="text-indigo-600">{titleHighlight}</span>}{' '}
            {titleSuffix}
          </h1>
          {subTitle && <p className="mt-3 text-slate-600">{subTitle}</p>}
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
        }}
        onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 transition-colors ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'
        }`}
      >
        <Upload className="w-10 h-10 mx-auto text-indigo-600" aria-hidden="true" />
        <p className="mt-4 font-semibold text-slate-800">Drop your {supportedFormat.toLowerCase()} here</p>
        <p className="mt-1 text-sm text-slate-500">or click to browse your device</p>
        <p className="mt-4 text-xs font-medium text-slate-500">
          Supported: {supportedFormat}{maxSize ? ` · Maximum ${maxSize}` : ''}
        </p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={isImageUpload}
          onChange={(event) => {
            submitFiles(event.target.files);
            event.target.value = '';
          }}
        />
      </div>
    </section>
  );
};

export default UploadBox;
