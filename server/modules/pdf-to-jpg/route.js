import express from "express";
import upload from "../../middlewares/upload.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { validatePdfToJpg } from "./validation.js";
import { handlePdfToJpgController } from "./controller.js";

const router = express.Router();

router.post(
  "/",
  upload.array("files"),
  validate(validatePdfToJpg),
  handlePdfToJpgController
);

export default router;