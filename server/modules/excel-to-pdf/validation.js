/**
 * Middleware to validate incoming file for Excel to PDF conversion.
 */
export const validateExcelToPdf = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Processing payload error: No Excel document detected for conversion."
    });
  }

  const file = req.files[0];
  const originalName = file.originalname.toLowerCase();

  const validExtensions = [".xls", ".xlsx", ".csv", ".ods"];
  const validMimeTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
    "application/vnd.oasis.opendocument.spreadsheet"
  ];

  const hasValidExtension = validExtensions.some((ext) => originalName.endsWith(ext));
  const hasValidMimeType = validMimeTypes.includes(file.mimetype);

  if (!hasValidExtension && !hasValidMimeType) {
    return res.status(400).json({
      success: false,
      message: `Validation error: File '${file.originalname}' is not a valid Excel document (.xls, .xlsx, .csv, or .ods).`
    });
  }

  next();
};