import React from 'react';
import { Unlock } from 'lucide-react';
import UploadBox from '../../components/common/uploadbox';

const UnlockPdf = () => {
  return (
    <UploadBox
      titlePrefix="Unlock"
      titleHighlight="PDF"
      subTitle="Remove password protection from a PDF"
      supportedFormat="FILES"
      headerIcon={<Unlock className="w-10 h-10 text-indigo-600" />}
      acceptTypes="application/pdf,.pdf"
      onFilesSelect={(files) => console.log('Unlock files:', files)}
    />
  );
};

export default UnlockPdf;
