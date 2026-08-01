/**
 * Middleware to validate incoming file and watermark parameters.
 */
export const validateWatermarkPdf = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Processing payload error: No file detected for watermarking."
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

  const { text, watermarkText, opacity, degrees, rotation, fontSize } = req.body || {};
  const activeText = text || watermarkText;

  // Validate watermark text presence when using standard programmatic watermarking
  if (!activeText && activeText !== "") {
    // Note: If no text is passed, we fall back gracefully in the service layer,
    // but recommend providing a text string.
  }

  // Validate Opacity (Must be a float between 0 and 1)
  if (opacity !== undefined) {
    const numOpacity = parseFloat(opacity);
    if (isNaN(numOpacity) || numOpacity < 0 || numOpacity > 1) {
      return res.status(400).json({
        success: false,
        message: "Validation error: Opacity must be a number between 0.0 and 1.0."
      });
    }
  }

  // Validate Font Size
  if (fontSize !== undefined) {
    const numSize = parseFloat(fontSize);
    if (isNaN(numSize) || numSize <= 0) {
      return res.status(400).json({
        success: false,
        message: "Validation error: Font size must be a number greater than zero."
      });
    }
  }

  // Validate Rotation Degrees
  if (degrees !== undefined || rotation !== undefined) {
    const numDegrees = parseFloat(degrees || rotation);
    if (isNaN(numDegrees)) {
      return res.status(400).json({
        success: false,
        message: "Validation error: Rotation angle must be a valid number."
      });
    }
  }

  next();
};