import { useNavigate } from 'react-router-dom';
import UploadBox from '../../components/common/uploadbox';

const PdfToWord = () => {
  const navigate = useNavigate();

  const handleFilesSelect = (files) => {
    const file = files?.[0];
    if (!file || (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf'))) {
      alert('Please select a valid PDF file.');
      return;
    }

    navigate('/processing', { state: { files: [file], toolType: 'pdf-to-word' } });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD]">
      <UploadBox
        titlePrefix="PDF"
        titleHighlight="to Word"
        titleSuffix="Converter"
        subTitle="Convert PDF documents to editable Word files (.docx)."
        supportedFormat="PDF"
        maxSize="100 MB"
        onFilesSelect={handleFilesSelect}
      />
    </div>
  );
};

export default PdfToWord;
