import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Upload from "../pages/Upload";
import Processing from "../pages/Processing";
import Result from "../pages/Result";
import Error404 from "../pages/Error404";
import ImageToPdf from "../pages/tools/ImageToPdf";
import PdfToJpg from "../pages/tools/PdfToJpg";
import PdfToWord from "../pages/tools/PdfToWord";
import WordToPdf from "../pages/tools/WordToPdf";
import PowerpointToPdf from "../pages/tools/PowerpointToPdf";
import ExcelToPdf from "../pages/tools/ExcelToPdf";
import HtmlToPdf from "../pages/tools/HtmlToPdf";
import PdfToPpt from "../pages/tools/PdfToPpt";
import PdfToExcel from "../pages/tools/PdfToExcel";
import PdfToPdfa from "../pages/tools/PdfToPdfa";
import MergePdf from "../pages/tools/MergePdf";
import SplitPdf from "../pages/tools/SplitPdf";
import CompressPdf from "../pages/tools/CompressPdf";
import RotatePdf from "../pages/tools/RotatePdf";
import RemovePages from "../pages/tools/RemovePages";
import ExtractPages from "../pages/tools/ExtractPages";
import WatermarkPdf from "../pages/tools/WatermarkPdf";
import CropPdf from "../pages/tools/CropPdf";
import UnlockPdf from "../pages/tools/UnlockPdf";
import ProtectPdf from "../pages/tools/ProtectPdf";
import SignPdf from "../pages/tools/SignPdf";
// Baaki tools jo aap future me banayenge, unhe bhi yahan import kar sakte hain.

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* MainLayout ke andar ke saare routes */}
        <Route path="/" element={<MainLayout />}>
          {/* Main Home Page */}
          <Route index element={<Home />} />

          {/* Individual Tools Routes (Taki header/footer/sidebar bar-bar load na ho) */}
          <Route path="image-to-pdf" element={<ImageToPdf />} />
          <Route path="pdf-to-jpg" element={<PdfToJpg />} />
            <Route path="pdf-to-word" element={<PdfToWord />} />
            <Route path="jpg-to-pdf" element={<ImageToPdf />} />
            <Route path="word-to-pdf" element={<WordToPdf />} />
            <Route path="ppt-to-pdf" element={<PowerpointToPdf />} />
            <Route path="excel-to-pdf" element={<ExcelToPdf />} />
            <Route path="html-to-pdf" element={<HtmlToPdf />} />
            <Route path="pdf-to-ppt" element={<PdfToPpt />} />
            <Route path="pdf-to-excel" element={<PdfToExcel />} />
            <Route path="pdf-to-pdfa" element={<PdfToPdfa />} />
            <Route path="merge-pdf" element={<MergePdf />} />
            <Route path="split-pdf" element={<SplitPdf />} />
            <Route path="compress-pdf" element={<CompressPdf />} />
            <Route path="rotate-pdf" element={<RotatePdf />} />
            <Route path="remove-pages" element={<RemovePages />} />
            <Route path="extract-pages" element={<ExtractPages />} />
            <Route path="watermark-pdf" element={<WatermarkPdf />} />
            <Route path="crop-pdf" element={<CropPdf />} />
            <Route path="unlock-pdf" element={<UnlockPdf />} />
            <Route path="protect-pdf" element={<ProtectPdf />} />
            <Route path="sign-pdf" element={<SignPdf />} />

          {/* Baaki utility pages */}
          <Route path="upload" element={<Upload />} />
          <Route path="processing" element={<Processing />} />
          <Route path="result" element={<Result />} />
        </Route>

        {/* 404 Page (Agar koi galat URL access kare) */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
