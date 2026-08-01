import fs from "fs";
import pdfToWordService from "./service.js";

/**
 * Controller handling PDF to Word conversion requests.
 */
export const handlePdfToWordController = async (req, res) => {
  try {
    const resultFileName = await pdfToWordService.convertPdfToWord(req.files);

    const dynamicBaseUrl = `${req.protocol}://${req.get("host")}`;

    return res.status(200).json({
      success: true,
      message: "PDFTOWORD execution completed successfully.",
      fileName: resultFileName,
      docxUrl: `${dynamicBaseUrl}/converted/${resultFileName}`,
      pdfUrl: `${dynamicBaseUrl}/converted/${resultFileName}`
    });

  } catch (error) {
    console.error("Pipeline crash inside action context [pdf-to-word]:", error);

    // Emergency cleanup on conversion failure
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.path && fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
            console.log(`[EMERGENCY CLEANUP] Successfully unlinked staging file after pipeline failure: ${file.filename}`);
          } catch (unlinkErr) {
            console.error(`[EMERGENCY CLEANUP FAILURE] Could not remove staging file: ${file.path}`, unlinkErr);
          }
        }
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal engine collapse during conversion processing pipeline."
    });
  }
};