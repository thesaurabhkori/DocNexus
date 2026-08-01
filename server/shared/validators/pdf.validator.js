import {
  requireFiles,
  validateMimeType,
} from "./common.validator.js";

export const validatePdfFiles = (req) => {

  requireFiles(req);

  req.files.forEach((file) => {
    validateMimeType(file, [
      "application/pdf",
    ]);
  });

};