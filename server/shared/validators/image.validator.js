import {
  requireFiles,
  validateMimeType,
} from "./common.validator.js";

export const validateImages = (req) => {

  requireFiles(req);

  req.files.forEach((file) => {
    validateMimeType(file, [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ]);
  });

};