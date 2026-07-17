import React from 'react';
import { ShieldCheck } from 'lucide-react';
import UploadBox from '../../components/common/uploadbox';

const ProtectPdf = () => {
  return (
    <UploadBox
      titlePrefix="Protect"
      titleHighlight="PDF"
      subTitle="Add password and encrypt your PDF files"
      supportedFormat="FILES"
      headerIcon={<ShieldCheck className="w-10 h-10 text-indigo-600" />}
      acceptTypes="application/pdf,.pdf"
      onFilesSelect={(files) => console.log('Protect files:', files)}
    />
  );
};

export default ProtectPdf;
