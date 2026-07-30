import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";

// Home and heavy utility pages can stay lazy loaded
const Home = lazy(() => import("../Pages/Home"));
const Processing = lazy(() => import("../Pages/Processing"));
const Result = lazy(() => import("../Pages/Result"));
const Error404 = lazy(() => import("../Pages/Error404"));

// Direct imports for tools to eliminate delay/flickering
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

// Direct import for shared workspace & uploadbox
import UniversalWorkspace from "../components/common/UniversalWorkspace";
import UploadBox from "../components/upload/uploadbox";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
};

// Smooth Loader that matches your DocNexus light UI theme
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50/50 backdrop-blur-sm">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
  </div>
);

function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />

            {/* Individual Tools */}
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

            {/* Shared Workspace */}
            <Route path="word-to-pdf" element={<UniversalWorkspace />} />
            <Route path="pdf-to-word" element={<UniversalWorkspace />} />
            <Route path="excel-to-pdf" element={<UniversalWorkspace />} />
            <Route path="pdf-to-excel" element={<UniversalWorkspace />} />
            <Route path="ppt-to-pdf" element={<UniversalWorkspace />} />

            {/* Utility Pages */}
            <Route path="upload" element={<UploadBox />} />
            <Route path="processing" element={<Processing />} />
            <Route path="result" element={<Result />} />
          </Route>

          <Route path="*" element={<Error404 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;