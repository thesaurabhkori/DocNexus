import React from 'react';
import { FilePlus } from 'lucide-react';
import UploadBox from '../../components/common/uploadbox';

const MergePdf = () => {
  return (
    <UploadBox
      titlePrefix="Merge"
      titleHighlight="PDF"
      subTitle="Combine multiple PDF files into a single document"
      supportedFormat="FILES"
      headerIcon={<FilePlus className="w-10 h-10 text-indigo-600" />}
      acceptTypes="application/pdf,.pdf"
      onFilesSelect={(files) => console.log('Merge files:', files)}
    />
  );
};

export default MergePdf;
