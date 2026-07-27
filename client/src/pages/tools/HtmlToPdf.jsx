import { useNavigate } from 'react-router-dom';
import UploadBox from '../../components/upload/uploadbox';

const HtmlToPdf = () => {
  const navigate = useNavigate();

  const handleFilesSelect = (files) => {
    const file = files?.[0];
    if (!file || (!file.name.toLowerCase().endsWith('.html') && !file.name.toLowerCase().endsWith('.htm'))) {
      alert('Please select a valid HTML (.html/.htm) file.');
      return;
    }

    navigate('/processing', { state: { files: [file], toolType: 'html-to-pdf' } });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex items-center justify-center">
      <UploadBox
        titlePrefix="HTML"
        titleHighlight="to PDF"
        titleSuffix="Converter"
        subTitle="Convert HTML files to PDF."
        supportedFormat="FILES"
        acceptTypes="text/html,.html,.htm"
        maxSize="20 MB"
        onFilesSelect={handleFilesSelect}
      />
    </div>
  );
};

export default HtmlToPdf;