/**
 * Middleware to validate incoming file and password parameters for PDF unlocking.
 */
export const validateUnlockPdf = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Processing payload error: No file detected for PDF unlocking."
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

  const { password, userPassword, ownerPassword } = req.body || {};
  const activePassword = password || userPassword || ownerPassword;

  // Validate password presence
  if (!activePassword || typeof activePassword !== "string" || activePassword.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Validation error: Password parameter is required to unlock the protected PDF."
    });
  }

  next();
};