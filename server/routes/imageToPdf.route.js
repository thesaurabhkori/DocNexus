import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { convertImageToPdf } from "../controllers/imageToPdf.controller.js";
import { convertWordToPdfController } from "../controllers/wordTopdf.controller.js";

const router = express.Router();

// ⚡ Multer chain attachment ensuring frontend field matching
router.post(
    "/",
    upload.array("images", 100), // Ensures backend parses 'images' array array correctly
convertImageToPdf
);
router.post(
  "/convert-word",
  upload.array("files", 1), // Frontend uploadBox handle component files payload field
  convertWordToPdfController
);

export default router;