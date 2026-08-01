import express from "express";
import upload from "../../middlewares/upload.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { validateHtmlDocument } from "../../shared/validators/office.validator.js";
import { handleHtmlToPdfController } from "./controller.js";

const router = express.Router();

router.post(
  "/",
  upload.array("files"),
  validate(validateHtmlDocument),
  handleHtmlToPdfController
);

export default router;