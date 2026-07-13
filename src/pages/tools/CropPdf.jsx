import React from 'react';
import { Crop } from 'lucide-react';
import UploadBox from '../../components/common/uploadbox';

const CropPdf = () => {
  return (
    <UploadBox
      titlePrefix="Crop"
      titleHighlight="PDF"
      subTitle="Crop PDF pages to remove margins or trim content"
      supportedFormat="FILES"
      headerIcon={<Crop className="w-10 h-10 text-indigo-600" />}
      acceptTypes="application/pdf,.pdf"
      onFilesSelect={(files) => console.log('Crop files:', files)}
    />
  );
};

export default CropPdf;
