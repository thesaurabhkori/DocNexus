import wordToPdfService from "./service.js";
import { outputManager, cleanupManager } from "../../managers/index.js";
import { logger } from "../../config/index.js";

/**
 * Controller handling Word to PDF conversion requests.
 */
export const handleWordToPdfController = async (req, res) => {
  try {
    const resultFileName = await wordToPdfService.convertWordToPdf(req.files);

    const pdfUrl = outputManager.buildDownloadUrl(req, resultFileName);

    return res.status(200).json({
      success: true,
      message: "WORDTOPDF execution completed successfully.",
      fileName: resultFileName,
      pdfUrl: pdfUrl
    });

  } catch (error) {
    logger.error(`Pipeline crash inside action context [word-to-pdf]: ${error.message}`);

    // Emergency cleanup using centralized cleanup manager on conversion failure
    if (req.files && req.files.length > 0) {
      await cleanupManager.handleEmergencyCleanup(req.files);
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal engine collapse during conversion processing pipeline."
    });
  }
};