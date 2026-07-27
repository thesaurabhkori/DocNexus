import fs from "fs";
import { executeToolService } from "../services/tools.service.js";

/**
 * Master Controller to handle all dynamic 19+ tool pipeline requests
 */
export const handleToolPipelineController = async (req, res) => {
  try {
    const { action } = req.params; // Captures 'word-to-pdf', 'merge-pdf', etc.

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Processing payload error: No files detected." 
      });
    }

    // 🚀 Router middleware se aane wale perfectly normalized action string ko check kiya
    const targetAction = req.normalizedAction || action.toLowerCase().replace(/[^a-z0-9]/g, "");

    // 🚀 req.body ko 3rd parameter ke roop me pass kiya taaki options sync ho sakein
    const resultFileName = await executeToolService(targetAction, req.files, req.body);

    // ⚡ DYNAMIC BASE URL EXTRACTOR (Dev Tunnels / Mobile Hotspot Network alignment ke liye zaroori hai)
    const dynamicBaseUrl = `${req.protocol}://${req.get("host")}`;

    return res.status(200).json({
      success: true,
      message: `${action.toUpperCase()} execution completed successfully.`,
      fileName: resultFileName,
      pdfUrl: `${dynamicBaseUrl}/converted/${resultFileName}` // Direct downloadable asset link structure
    });

  } catch (error) {
    console.error(`Pipeline crash inside action context [${req.params.action}]:`, error);

    // 🚀 FIXED: EMERGENCY CLEANUP ON CRASH
    // Agar conversion service runtime par fail hoti hai, toh upload ki gayi temporary files ko system se delete karein
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