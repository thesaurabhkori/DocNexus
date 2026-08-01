import ApiError from "../errors/ApiError.js";

export const requireFiles = (req) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No files uploaded.");
  }
};

export const requireSingleFile = (req) => {
  if (!req.files || req.files.length !== 1) {
    throw new ApiError(400, "Exactly one file is required.");
  }
};

export const requireMinimumFiles = (req, count) => {
  if (!req.files || req.files.length < count) {
    throw new ApiError(
      400,
      `At least ${count} files are required.`
    );
  }
};

export const validateFileSize = (file, maxSize) => {
  if (file.size > maxSize) {
    throw new ApiError(
      400,
      `Maximum allowed file size is ${maxSize / 1024 / 1024} MB`
    );
  }
};

export const validateMimeType = (file, allowedMimeTypes) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new ApiError(
      400,
      `Unsupported file type: ${file.mimetype}`
    );
  }
};