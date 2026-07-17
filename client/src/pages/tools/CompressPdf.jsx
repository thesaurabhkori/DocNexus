import React from 'react';
import { Zap } from 'lucide-react';
import UploadBox from '../../components/common/uploadbox';

const CompressPdf = () => {
  return (
    <UploadBox
      titlePrefix="Compress"
      titleHighlight="PDF"
      subTitle="Reduce PDF file size without losing quality"
      supportedFormat="FILES"
      headerIcon={<Zap className="w-10 h-10 text-indigo-600" />}
      acceptTypes="application/pdf,.pdf"
      onFilesSelect={(files) => console.log('Compress files:', files)}
    />
  );
};

export default CompressPdf;
