import fs from "fs";
import powerPointToPdfService from "./service.js";

/**
 * Controller handling PowerPoint to PDF conversion requests.
 */
export const handlePowerPointToPdfController = async (req, res) => {
  try {
    const resultFileName = await powerPointToPdfService.convertPowerPointToPdf(req.files);

    const dynamicBaseUrl = `${req.protocol}://${req.get("host")}`;

    return res.status(200).json({
      success: true,
      message: "POWERPOINTTOPDF execution completed successfully.",
      fileName: resultFileName,
      pdfUrl: `${dynamicBaseUrl}/converted/${resultFileName}`
    });

  } catch (error) {
    console.error("Pipeline crash inside action context [powerpoint-to-pdf]:", error);

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