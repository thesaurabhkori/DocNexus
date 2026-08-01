import multer from "multer";
import path from "path";
import { envConfig } from "./env.config.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, envConfig.uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

export const multerConfig = {
  storage,
  limits: {
    fileSize: envConfig.maxFileSize,
  },
};