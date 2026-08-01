/**
 * Middleware to validate incoming file for HTML to PDF conversion.
 */
export const validateHtmlToPdf = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Processing payload error: No HTML file detected for conversion."
    });
  }

  const file = req.files[0];
  const originalName = file.originalname.toLowerCase();

  const validExtensions = [".html", ".htm"];
  const validMimeTypes = ["text/html", "application/xhtml+xml"];

  const hasValidExtension = validExtensions.some((ext) => originalName.endsWith(ext));
  const hasValidMimeType = validMimeTypes.includes(file.mimetype);

  if (!hasValidExtension && !hasValidMimeType) {
    return res.status(400).json({
      success: false,
      message: `Validation error: File '${file.originalname}' is not a valid HTML document (.html or .htm).`
    });
  }

  next();
};