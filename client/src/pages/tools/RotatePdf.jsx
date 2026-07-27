import React from 'react';
import { RotateCw } from 'lucide-react';
import UploadBox from '../../components/upload/uploadbox';

const RotatePdf = () => {
  return (
    <UploadBox
      titlePrefix="Rotate"
      titleHighlight="PDF"
      subTitle="Rotate PDF pages to the desired direction"
      supportedFormat="FILES"
      headerIcon={<RotateCw className="w-10 h-10 text-indigo-600" />}
      acceptTypes="application/pdf,.pdf"
      onFilesSelect={(files) => console.log('Rotate files:', files)}
    />
  );
};

export default RotatePdf;