import React from 'react';
import { Pen } from 'lucide-react';
import UploadBox from "../../components/upload/uploadbox";

const SignPdf = () => {
  return (
    <UploadBox
      titlePrefix="Sign"
      titleHighlight="PDF"
      subTitle="Add digital signatures to your PDF files"
      supportedFormat="FILES"
      headerIcon={<Pen className="w-10 h-10 text-indigo-600" />}
      acceptTypes="application/pdf,.pdf"
      onFilesSelect={(files) => console.log('Sign files:', files)}
    />
  );
};

export default SignPdf;