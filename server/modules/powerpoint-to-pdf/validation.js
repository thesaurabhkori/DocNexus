/**
 * Middleware to validate incoming file for PowerPoint to PDF conversion.
 */
export const validatePowerPointToPdf = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Processing payload error: No PowerPoint presentation detected for conversion."
    });
  }

  const file = req.files[0];
  const originalName = file.originalname.toLowerCase();

  const validExtensions = [".ppt", ".pptx", ".odp"];
  const validMimeTypes = [
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.oasis.opendocument.presentation"
  ];

  const hasValidExtension = validExtensions.some((ext) => originalName.endsWith(ext));
  const hasValidMimeType = validMimeTypes.includes(file.mimetype);

  if (!hasValidExtension && !hasValidMimeType) {
    return res.status(400).json({
      success: false,
      message: `Validation error: File '${file.originalname}' is not a valid PowerPoint presentation (.ppt, .pptx, or .odp).`
    });
  }

  next();
};