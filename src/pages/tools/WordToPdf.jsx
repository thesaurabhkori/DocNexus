import { useNavigate } from 'react-router-dom';
import UploadBox from '../../components/common/uploadbox';

const WordToPdf = () => {
  const navigate = useNavigate();

  const handleFilesSelect = (files) => {
    const file = files?.[0];
    if (!file || (!file.name.toLowerCase().endsWith('.doc') && !file.name.toLowerCase().endsWith('.docx'))) {
      alert('Please select a valid Word (.doc/.docx) file.');
      return;
    }

    navigate('/processing', { state: { files: [file], toolType: 'word-to-pdf' } });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD]">
      <UploadBox
        titlePrefix="Word"
        titleHighlight="to PDF"
        titleSuffix="Converter"
        subTitle="Convert Word documents to PDF."
        supportedFormat="FILES"
        acceptTypes="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.doc,.docx"
        maxSize="50 MB"
        onFilesSelect={handleFilesSelect}
      />
    </div>
  );
};

export default WordToPdf;
