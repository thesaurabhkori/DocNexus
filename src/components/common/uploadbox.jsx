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
    <section className="w-full box-border mx-auto px-4 text-center min-h-[calc(100vh-8rem)] flex flex-col items-center justify-start pt-12 pb-12 sm:px-6 sm:pt-16 sm:pb-16 sm:max-w-[calc(100vw-60px)] md:px-12 md:pt-20 md:pb-20 md:max-w-[calc(100vw-120px)] lg:px-24 lg:pt-24 lg:pb-24 lg:max-w-[calc(100vw-200px)] xl:max-w-[calc(100vw-260px)]">
      <div className="flex flex-col items-center gap-4 mb-8">
        {headerIcon || <FileUp className="w-10 h-10 text-indigo-600" aria-hidden="true" />}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {titlePrefix}{' '}
            {titleHighlight && <span className="text-indigo-600">{titleHighlight}</span>}{' '}
            {titleSuffix}
          </h1>
          {subTitle && <p className="mt-3 text-slate-600 max-w-xl mx-auto">{subTitle}</p>}
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
        className={`cursor-pointer w-full rounded-2xl border-2 border-dashed p-8 sm:p-10 transition-colors min-h-[320px] md:min-h-[380px] lg:min-h-[440px] xl:min-h-[520px] flex flex-col items-center justify-center ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-slate-300 bg-slate-100 hover:border-indigo-400 hover:bg-slate-200'
        }`}
      >
        <Upload className="w-10 h-10 mx-auto text-indigo-600" aria-hidden="true" />
        <p className="mt-4 font-semibold text-slate-800 text-base leading-relaxed">
          Drop your {supportedFormat.toLowerCase()} here
        </p>
        <p className="mt-1 text-sm text-slate-500">or click to browse your device</p>
        <p className="mt-4 text-xs font-medium text-slate-500 break-words">
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
