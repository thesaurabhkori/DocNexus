import {
  requireSingleFile,
  validateMimeType,
} from "./common.validator.js";

export const validateWordDocument = (req) => {

  requireSingleFile(req);

  validateMimeType(req.files[0], [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]);

};

export const validateExcelDocument = (req) => {

  requireSingleFile(req);

  validateMimeType(req.files[0], [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ]);

};

export const validatePowerPointDocument = (req) => {

  requireSingleFile(req);

  validateMimeType(req.files[0], [
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ]);

};

export const validateHtmlDocument = (req) => {

  requireSingleFile(req);

  validateMimeType(req.files[0], [
    "text/html",
    "application/xhtml+xml",
  ]);

};