import fs from "fs";
import pdfToPptService from "./service.js";

/**
 * Controller handling PDF to PowerPoint conversion requests.
 */
export const handlePdfToPptController = async (req, res) => {
  try {
    const resultFileName = await pdfToPptService.convertPdfToPpt(req.files);

    const dynamicBaseUrl = `${req.protocol}://${req.get("host")}`;

    return res.status(200).json({
      success: true,
      message: "PDFTOPPT execution completed successfully.",
      fileName: resultFileName,
      pptxUrl: `${dynamicBaseUrl}/converted/${resultFileName}`,
      pptUrl: `${dynamicBaseUrl}/converted/${resultFileName}`,
      pdfUrl: `${dynamicBaseUrl}/converted/${resultFileName}`
    });

  } catch (error) {
    console.error("Pipeline crash inside action context [pdf-to-ppt]:", error);

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