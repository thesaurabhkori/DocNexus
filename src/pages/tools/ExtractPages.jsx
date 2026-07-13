import React from 'react';
import { FileText } from 'lucide-react';
import UploadBox from '../../components/common/uploadbox';

const ExtractPages = () => {
  return (
    <UploadBox
      titlePrefix="Extract"
      titleHighlight="Pages"
      subTitle="Extract specific pages from a PDF into a new file"
      supportedFormat="FILES"
      headerIcon={<FileText className="w-10 h-10 text-indigo-600" />}
      acceptTypes="application/pdf,.pdf"
      onFilesSelect={(files) => console.log('Extract pages from files:', files)}
    />
  );
};

export default ExtractPages;
