/**
 * Middleware to validate incoming file for Word to PDF conversion.
 */
export const validateWordToPdf = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Processing payload error: No Word document detected for conversion."
    });
  }

  const file = req.files[0];
  const originalName = file.originalname.toLowerCase();
  
  const validExtensions = [".doc", ".docx"];
  const validMimeTypes = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  const hasValidExtension = validExtensions.some((ext) => originalName.endsWith(ext));
  const hasValidMimeType = validMimeTypes.includes(file.mimetype);

  if (!hasValidExtension && !hasValidMimeType) {
    return res.status(400).json({
      success: false,
      message: `Validation error: File '${file.originalname}' is not a valid Word document (.doc or .docx).`
    });
  }

  next();
};