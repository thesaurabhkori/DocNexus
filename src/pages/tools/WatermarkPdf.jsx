import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import UploadBox from '../../components/common/uploadbox';

const WatermarkPdf = () => {
  return (
    <UploadBox
      titlePrefix="Watermark"
      titleHighlight="PDF"
      subTitle="Add text or image watermark to your PDF"
      supportedFormat="FILES"
      headerIcon={<ImageIcon className="w-10 h-10 text-indigo-600" />}
      acceptTypes="application/pdf,.pdf"
      onFilesSelect={(files) => console.log('Watermark files:', files)}
    />
  );
};

export default WatermarkPdf;
