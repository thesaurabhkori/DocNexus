import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import MainLayout from "../components/Layout/MainLayout";
import Home from "../Pages/Home";
import Processing from "../Pages/Processing";
import Result from "../Pages/Result";
import Error404 from "../Pages/Error404";

import ImageToPdf from "../Pages/Tools/ImageToPdf";
import PdfToJpg from "../Pages/Tools/PdfToJpg";
import HtmlToPdf from "../Pages/Tools/HtmlToPdf";
import PdfToPpt from "../Pages/Tools/PdfToPpt";
import PdfToPdfa from "../Pages/Tools/PdfToPdfa";
import MergePdf from "../Pages/Tools/MergePdf";
import SplitPdf from "../Pages/Tools/SplitPdf";
import CompressPdf from "../Pages/Tools/CompressPdf";
import RotatePdf from "../Pages/Tools/RotatePdf";
import RemovePages from "../Pages/Tools/RemovePages";
import ExtractPages from "../Pages/Tools/ExtractPages";
import WatermarkPdf from "../Pages/Tools/WatermarkPdf";
import CropPdf from "../Pages/Tools/CropPdf";
import UnlockPdf from "../Pages/Tools/UnlockPdf";
import ProtectPdf from "../Pages/Tools/ProtectPdf";
import SignPdf from "../Pages/Tools/SignPdf";

import UniversalWorkspace from "../components/common/UniversalWorkspace";
// Naya UploadBox import yahan add kiya hai:
import UploadBox from "../components/upload/uploadbox";

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

          {/* Individual Tools Routes */}
          <Route path="image-to-pdf" element={<ImageToPdf />} />
          <Route path="pdf-to-jpg" element={<PdfToJpg />} />
          <Route path="jpg-to-pdf" element={<ImageToPdf />} />
          <Route path="html-to-pdf" element={<HtmlToPdf />} />
          <Route path="pdf-to-ppt" element={<PdfToPpt />} />
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

          {/* 🚀 SHARED WORKSPACE PORTAL CHANNELS */}
          {/* In paanchon paths par ab hamara common, optimized workspace render hoga */}
          <Route path="word-to-pdf" element={<UniversalWorkspace />} />
          <Route path="pdf-to-word" element={<UniversalWorkspace />} />
          <Route path="excel-to-pdf" element={<UniversalWorkspace />} />
          <Route path="pdf-to-excel" element={<UniversalWorkspace />} />
          <Route path="ppt-to-pdf" element={<UniversalWorkspace />} />

          {/* Baaki utility pages */}
          {/* Yahan element ko <Upload /> se badal kar <UploadBox /> kar diya hai */}
          <Route path="upload" element={<UploadBox />} />
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