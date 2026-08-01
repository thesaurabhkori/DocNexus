import express from "express";
import upload from "../../middlewares/upload.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { validateExcelDocument } from "../../shared/validators/office.validator.js";
import { handleExcelToPdfController } from "./controller.js";

const router = express.Router();

router.post(
  "/",
  upload.array("files"),
  validate(validateExcelDocument),
  handleExcelToPdfController
);

export default router;