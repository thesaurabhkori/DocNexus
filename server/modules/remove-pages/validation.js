/**
 * Middleware to validate incoming file and page range parameters for page removal.
 */
export const validateRemovePages = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Processing payload error: No file detected for page removal."
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

  // Validate pages parameter if provided
  if (req.body && req.body.pages !== undefined && typeof req.body.pages === "string") {
    const trimmedPages = req.body.pages.trim();
    if (trimmedPages.length > 0) {
      const validFormatRegex = /^(\d+(-\d+)?\s*,\s*)*\d+(-\d+)?$/;
      if (!validFormatRegex.test(trimmedPages)) {
        return res.status(400).json({
          success: false,
          message: "Validation error: Invalid page format. Expected comma-separated pages or ranges (e.g., '1,3,5' or '1-4,7')."
        });
      }
    }
  }

  next();
};