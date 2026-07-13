import { useNavigate } from 'react-router-dom';
import UploadBox from '../../components/common/uploadbox';

const PdfToPdfa = () => {
  const navigate = useNavigate();

  const handleFilesSelect = (files) => {
    const file = files?.[0];
    if (!file || (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf'))) {
      alert('Please select a valid PDF file.');
      return;
    }

    navigate('/processing', { state: { files: [file], toolType: 'pdf-to-pdfa' } });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD]">
      <UploadBox
        titlePrefix="PDF"
        titleHighlight="to PDF/A"
        titleSuffix="Converter"
        subTitle="Convert PDF to PDF/A archival format."
        supportedFormat="PDF"
        maxSize="200 MB"
        onFilesSelect={handleFilesSelect}
      />
    </div>
  );
};

export default PdfToPdfa;
