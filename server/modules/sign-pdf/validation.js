/**
 * Middleware to validate incoming files and signature parameters for PDF signing.
 */
export const validateSignPdf = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Processing payload error: No PDF file detected for signature application."
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

  const { pageNumber, x, y, width, height } = req.body || {};

  // Validate Page Number if provided
  if (pageNumber !== undefined) {
    const pageNum = parseInt(pageNumber, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({
        success: false,
        message: "Validation error: 'pageNumber' must be a positive integer starting from 1."
      });
    }
  }

  // Validate Signature Bounding Dimensions if provided
  if (width !== undefined || height !== undefined) {
    const numWidth = parseFloat(width);
    const numHeight = parseFloat(height);

    if ((width !== undefined && (isNaN(numWidth) || numWidth <= 0)) ||
        (height !== undefined && (isNaN(numHeight) || numHeight <= 0))) {
      return res.status(400).json({
        success: false,
        message: "Validation error: Signature 'width' and 'height' must be numbers greater than zero."
      });
    }
  }

  next();
};