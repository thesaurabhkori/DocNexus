import express from "express";
import upload from "../../middlewares/upload.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { validatePdfFiles } from "../../shared/validators/pdf.validator.js";
import { handlePdfToWordController } from "./controller.js";

const router = express.Router();

router.post(
  "/",
  upload.array("files"),
  validate(validatePdfFiles),
  handlePdfToWordController
);

export default router;