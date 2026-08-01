import express from "express";
import upload from "../../middlewares/upload.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { validateWordDocument } from "../../shared/validators/office.validator.js";
import { handleWordToPdfController } from "./controller.js";

const router = express.Router();

router.post(
  "/",
  upload.array("files"),
  validate(validateWordDocument),
  handleWordToPdfController
);

export default router;