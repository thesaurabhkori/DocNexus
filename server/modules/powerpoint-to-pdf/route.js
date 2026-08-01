import express from "express";
import upload from "../../middlewares/upload.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { validatePowerPointDocument } from "../../shared/validators/office.validator.js";
import { handlePowerPointToPdfController } from "./controller.js";

const router = express.Router();

router.post(
  "/",
  upload.array("files"),
  validate(validatePowerPointDocument),
  handlePowerPointToPdfController
);

export default router;