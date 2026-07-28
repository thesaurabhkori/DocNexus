import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";

// Lazy Loaded Pages
const Home = lazy(() => import("../Pages/Home"));
const Processing = lazy(() => import("../Pages/Processing"));
const Result = lazy(() => import("../Pages/Result"));
const Error404 = lazy(() => import("../Pages/Error404"));

// Lazy Loaded Tools
const ImageToPdf = lazy(() => import("../Pages/Tools/ImageToPdf"));
const PdfToJpg = lazy(() => import("../Pages/Tools/PdfToJpg"));
const HtmlToPdf = lazy(() => import("../Pages/Tools/HtmlToPdf"));
const PdfToPpt = lazy(() => import("../Pages/Tools/PdfToPpt"));
const PdfToPdfa = lazy(() => import("../Pages/Tools/PdfToPdfa"));
const MergePdf = lazy(() => import("../Pages/Tools/MergePdf"));
const SplitPdf = lazy(() => import("../Pages/Tools/SplitPdf"));
const CompressPdf = lazy(() => import("../Pages/Tools/CompressPdf"));
const RotatePdf = lazy(() => import("../Pages/Tools/RotatePdf"));
const RemovePages = lazy(() => import("../Pages/Tools/RemovePages"));
const ExtractPages = lazy(() => import("../Pages/Tools/ExtractPages"));
const WatermarkPdf = lazy(() => import("../Pages/Tools/WatermarkPdf"));
const CropPdf = lazy(() => import("../Pages/Tools/CropPdf"));
const UnlockPdf = lazy(() => import("../Pages/Tools/UnlockPdf"));
const ProtectPdf = lazy(() => import("../Pages/Tools/ProtectPdf"));
const SignPdf = lazy(() => import("../Pages/Tools/SignPdf"));

// Lazy Loaded Shared Components
const UniversalWorkspace = lazy(() => import("../components/common/UniversalWorkspace"));

const UploadBox = lazy(() => import("../components/upload/uploadbox"));

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

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
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