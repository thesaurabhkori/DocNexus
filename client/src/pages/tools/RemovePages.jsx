import React from 'react';
import { Trash2 } from 'lucide-react';
import UploadBox from '../../components/upload/uploadbox';

const RemovePages = () => {
  return (
    <UploadBox
      titlePrefix="Remove"
      titleHighlight="Pages"
      subTitle="Remove unwanted pages from your PDF"
      supportedFormat="FILES"
      headerIcon={<Trash2 className="w-10 h-10 text-indigo-600" />}
      acceptTypes="application/pdf,.pdf"
      onFilesSelect={(files) => console.log('Remove pages from files:', files)}
    />
  );
};

export default RemovePages;