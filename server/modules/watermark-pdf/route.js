import express from "express";
import multer from "multer";
import upload from "../../middlewares/upload.middleware.js";
import { validateWatermarkPdf } from "./validation.js";
import { handleWatermarkPdfController } from "./controller.js";

const router = express.Router();

/**
 * Wrapper interceptor to catch Multer errors gracefully
 */
const multerUploadWrapper = (req, res, next) => {
  upload.array("files")(req, res, (err) => {
    if (err) {
      console.error("[MULTER FAULT] Error captured during dynamic stream intercept:", err);

      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({
            success: false,
            message: "Multer mapping mismatch error: Multiparts form key payload must strictly target field string 'files'."
          });
        }
        return res.status(400).json({
          success: false,
          message: `Storage boundary error: ${err.message}`
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message || "File formatting validation rejected."
      });
    }
    next();
  });
};

// Target Endpoint: POST /api/watermark-pdf (and /api/watermarkpdf)
router.post(
  "/",
  multerUploadWrapper,
  validateWatermarkPdf,
  handleWatermarkPdfController
);

export default router;