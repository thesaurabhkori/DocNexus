/**
 * Middleware to validate incoming file for PDF splitting.
 */
export const validateSplitPdf = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Processing payload error: No files detected."
    });
  }

  const uploadedFile = req.files[0];
  const isValidPdf = 
    uploadedFile.mimetype === "application/pdf" || 
    uploadedFile.originalname.toLowerCase().endsWith(".pdf");

  if (!isValidPdf) {
    return res.status(400).json({
      success: false,
      message: `Validation error: File '${uploadedFile.originalname}' is not a valid PDF document.`
    });
  }

  next();
};