import { useNavigate } from 'react-router-dom';
import UploadBox from '../../components/common/uploadbox';

const PdfToExcel = () => {
  const navigate = useNavigate();

  const handleFilesSelect = (files) => {
    const file = files?.[0];
    if (!file || (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf'))) {
      alert('Please select a valid PDF file.');
      return;
    }

    navigate('/processing', { state: { files: [file], toolType: 'pdf-to-excel' } });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD]">
      <UploadBox
        titlePrefix="PDF"
        titleHighlight="to Excel"
        titleSuffix="Converter"
        subTitle="Extract tables and data from PDF to Excel."
        supportedFormat="PDF"
        maxSize="200 MB"
        onFilesSelect={handleFilesSelect}
      />
    </div>
  );
};

export default PdfToExcel;
