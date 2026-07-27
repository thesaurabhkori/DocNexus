import { useNavigate } from 'react-router-dom';
import UploadBox from '../../components/upload/uploadbox';

const ExcelToPdf = () => {
  const navigate = useNavigate();

  const handleFilesSelect = (files) => {
    const file = files?.[0];
    if (!file || (!file.name.toLowerCase().endsWith('.xls') && !file.name.toLowerCase().endsWith('.xlsx'))) {
      alert('Please select a valid Excel (.xls/.xlsx) file.');
      return;
    }

    navigate('/processing', { state: { files: [file], toolType: 'excel-to-pdf' } });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex items-center justify-center">
      <UploadBox
        titlePrefix="Excel"
        titleHighlight="to PDF"
        titleSuffix="Converter"
        subTitle="Convert Excel spreadsheets to PDF."
        supportedFormat="FILES"
        acceptTypes="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xls,.xlsx"
        maxSize="50 MB"
        onFilesSelect={handleFilesSelect}
      />
    </div>
  );
};

export default ExcelToPdf;