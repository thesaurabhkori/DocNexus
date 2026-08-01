import express from "express";
import upload from "../../middlewares/upload.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { validateImages } from "../../shared/validators/image.validator.js";
import { handleImageToPdfController } from "./controller.js";

const router = express.Router();

router.post(
  "/",
  upload.array("files"),
  validate(validateImages),
  handleImageToPdfController
);

export default router;