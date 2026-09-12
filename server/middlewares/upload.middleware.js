import multer from "multer";
import { multerConfig } from "../config/multer.config.js";

const upload = multer(multerConfig);

export default upload;
