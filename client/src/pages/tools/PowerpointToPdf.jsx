import { useNavigate } from 'react-router-dom';
import UploadBox from '../../components/upload/uploadbox';

const PowerpointToPdf = () => {
  const navigate = useNavigate();

  const handleFilesSelect = (files) => {
    const file = files?.[0];
    if (!file || (!file.name.toLowerCase().endsWith('.ppt') && !file.name.toLowerCase().endsWith('.pptx'))) {
      alert('Please select a valid PowerPoint (.ppt/.pptx) file.');
      return;
    }

    navigate('/processing', { state: { files: [file], toolType: 'ppt-to-pdf' } });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex items-center justify-center">
      <UploadBox
        titlePrefix="PowerPoint"
        titleHighlight="to PDF"
        titleSuffix="Converter"
        subTitle="Convert PowerPoint presentations to PDF."
        supportedFormat="FILES"
        acceptTypes="application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,.ppt,.pptx"
        maxSize="100 MB"
        onFilesSelect={handleFilesSelect}
      />
    </div>
  );
};

export default PowerpointToPdf;