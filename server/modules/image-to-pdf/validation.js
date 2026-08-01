/**
 * Middleware to validate incoming payload and file streams for Image-To-PDF conversion.
 */
export const validateImageToPdf = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Processing payload error: No files detected."
    });
  }

  // Ensure all uploaded files are valid image types
  const validMimes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  for (const file of req.files) {
    if (!validMimes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `Validation error: File type '${file.mimetype}' is not a supported image format.`
      });
    }
  }

  next();
};