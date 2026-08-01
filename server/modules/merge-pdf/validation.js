/**
 * Middleware to validate incoming files for PDF merging.
 */
export const validateMergePdf = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Processing payload error: No files detected."
    });
  }

  if (req.files.length < 2) {
    return res.status(400).json({
      success: false,
      message: "Validation error: At least 2 PDF files are required to perform a merge."
    });
  }

  const validMimes = ["application/pdf"];
  for (const file of req.files) {
    if (!validMimes.includes(file.mimetype) && !file.originalname.toLowerCase().endsWith(".pdf")) {
      return res.status(400).json({
        success: false,
        message: `Validation error: File '${file.originalname}' is not a valid PDF document.`
      });
    }
  }

  next();
};