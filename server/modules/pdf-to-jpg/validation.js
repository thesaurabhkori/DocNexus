import ApiError from "../../shared/errors/ApiError.js";
import {
  requireFiles,
  validateMimeType,
} from "../../shared/validators/common.validator.js";

/**
 * Middleware to validate incoming file and image conversion parameters for PDF to JPG.
 */
export const validatePdfToJpg = (req) => {
  requireFiles(req);

  req.files.forEach((file) => {
    const isValidPdf =
      file.mimetype === "application/pdf" ||
      (file.originalname || "").toLowerCase().endsWith(".pdf");

    if (!isValidPdf) {
      throw new ApiError(
        400,
        `Validation error: File '${file.originalname || "unknown"}' is not a valid PDF document.`
      );
    }

    validateMimeType(file, ["application/pdf"]);
  });

  const { format, dpi, quality } = req.body || {};

  if (format !== undefined) {
    const validFormats = ["jpg", "jpeg", "png"];
    if (!validFormats.includes(String(format).toLowerCase())) {
      throw new ApiError(
        400,
        "Validation error: Target image format must be 'jpg', 'jpeg', or 'png'."
      );
    }
  }

  if (dpi !== undefined) {
    const numDpi = parseInt(dpi, 10);
    if (Number.isNaN(numDpi) || numDpi < 72 || numDpi > 600) {
      throw new ApiError(
        400,
        "Validation error: 'dpi' must be an integer between 72 and 600."
      );
    }
  }

  if (quality !== undefined) {
    const numQuality = parseInt(quality, 10);
    if (Number.isNaN(numQuality) || numQuality < 10 || numQuality > 100) {
      throw new ApiError(
        400,
        "Validation error: 'quality' must be an integer between 10 and 100."
      );
    }
  }
};