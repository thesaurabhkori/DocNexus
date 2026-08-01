/**
 * Middleware to validate incoming file and image conversion parameters for PDF to JPG.
 */
export const validatePdfToJpg = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Processing payload error: No PDF document detected for JPG conversion."
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

  const { format, dpi, quality } = req.body || {};

  // Validate format if explicitly provided
  if (format !== undefined) {
    const validFormats = ["jpg", "jpeg", "png"];
    if (!validFormats.includes(format.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Validation error: Target image format must be 'jpg', 'jpeg', or 'png'."
      });
    }
  }

  // Validate DPI value if provided
  if (dpi !== undefined) {
    const numDpi = parseInt(dpi, 10);
    if (isNaN(numDpi) || numDpi < 72 || numDpi > 600) {
      return res.status(400).json({
        success: false,
        message: "Validation error: 'dpi' must be an integer between 72 and 600."
      });
    }
  }

  // Validate Quality value if provided
  if (quality !== undefined) {
    const numQuality = parseInt(quality, 10);
    if (isNaN(numQuality) || numQuality < 10 || numQuality > 100) {
      return res.status(400).json({
        success: false,
        message: "Validation error: 'quality' must be an integer between 10 and 100."
      });
    }
  }

  next();
};