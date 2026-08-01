/**
 * Middleware to validate incoming file and rotation degree parameter.
 */
export const validateRotatePdf = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Processing payload error: No file detected for rotation."
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

  // Validate degrees parameter if provided (Default is 90)
  if (req.body && req.body.degrees !== undefined) {
    const angle = parseInt(req.body.degrees, 10);
    const validAngles = [90, 180, 270, 360];

    if (isNaN(angle) || !validAngles.includes(angle)) {
      return res.status(400).json({
        success: false,
        message: "Validation error: Rotation degrees must be one of 90, 180, 270, or 360."
      });
    }
  }

  next();
};