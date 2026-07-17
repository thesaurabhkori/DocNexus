import React from 'react';
import { Scissors } from 'lucide-react';
import UploadBox from '../../components/common/uploadbox';

const SplitPdf = () => {
  return (
    <UploadBox
      titlePrefix="Split"
      titleHighlight="PDF"
      subTitle="Split a PDF into multiple files or extract specific pages"
      supportedFormat="FILES"
      headerIcon={<Scissors className="w-10 h-10 text-indigo-600" />}
      acceptTypes="application/pdf,.pdf"
      onFilesSelect={(files) => console.log('Split files:', files)}
    />
  );
};

export default SplitPdf;
