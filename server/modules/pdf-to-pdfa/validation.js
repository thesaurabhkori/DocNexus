/**
 * Middleware to validate incoming file for PDF to PDF/A archival conversion.
 */
export const validatePdfToPdfa = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Processing payload error: No PDF document detected for PDF/A conversion."
    });
  }

  const file = req.files[0];
  const isValidPdf =
    file.mimetype === "application/pdf" ||
    file.originalname.toLowerCase().endsWith(".pdf");

  if (!isValidPdf) {
    return res.status(400).json({
      success: false,
      message: `Validation error: File '${file.originalname}' is not a valid PDF document.`
    });
  }

  const { pdfVersion } = req.body || {};

  // Validate pdfVersion flag if explicitly provided
  if (pdfVersion !== undefined) {
    const validVersions = ["1", "2", "3", "pdfa-1b", "pdfa-2b", "pdfa-3b"];
    if (!validVersions.includes(String(pdfVersion).toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Validation error: 'pdfVersion' must be a valid PDF/A specification (e.g., '1', '2', 'pdfa-1b')."
      });
    }
  }

  next();
};