/**
 * Middleware to validate incoming file for PDF to PPT conversion.
 */
export const validatePdfToPpt = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Processing payload error: No PDF document detected for PowerPoint conversion."
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

  next();
};