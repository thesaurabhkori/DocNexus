/**
 * Middleware to validate incoming file and compression parameters for PDF compression.
 */
export const validateCompressPdf = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Processing payload error: No file detected for PDF compression."
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

  // Validate compression level if provided (e.g. low, recommended, extreme)
  if (req.body && req.body.level !== undefined) {
    const validLevels = ["low", "recommended", "extreme", "medium", "high"];
    if (typeof req.body.level === "string" && !validLevels.includes(req.body.level.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Validation error: Compression level must be one of 'low', 'recommended', or 'extreme'."
      });
    }
  }

  next();
};