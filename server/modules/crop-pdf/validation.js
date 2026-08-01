/**
 * Middleware to validate incoming file and crop parameters for PDF cropping.
 */
export const validateCropPdf = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Processing payload error: No file detected for PDF cropping."
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

  const { x, y, width, height, top, bottom, left, right } = req.body || {};

  // Check if explicit x/y/width/height parameters are provided
  if (width !== undefined || height !== undefined) {
    const numWidth = parseFloat(width);
    const numHeight = parseFloat(height);

    if (isNaN(numWidth) || numWidth <= 0 || isNaN(numHeight) || numHeight <= 0) {
      return res.status(400).json({
        success: false,
        message: "Validation error: Crop 'width' and 'height' must be numbers greater than zero."
      });
    }
  }

  // Check if margin parameters (top/bottom/left/right) are provided
  if (top !== undefined || bottom !== undefined || left !== undefined || right !== undefined) {
    const margins = [top, bottom, left, right].map((m) => (m !== undefined ? parseFloat(m) : 0));
    if (margins.some((m) => isNaN(m) || m < 0)) {
      return res.status(400).json({
        success: false,
        message: "Validation error: Crop margins (top, bottom, left, right) must be non-negative numbers."
      });
    }
  }

  next();
};