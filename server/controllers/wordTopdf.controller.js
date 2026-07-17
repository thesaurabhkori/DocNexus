import { createWordToPdf } from "../services/wordToPdf.service.js";

/**
 * Controller to handle Word to PDF conversion pipeline requests
 */
export const convertWordToPdfController = async (req, res) => {
  try {
    // 1. Check if files exist in the request context payload
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No document files uploaded. Please upload a valid file." 
      });
    }

    // 2. Trigger conversion pipeline service mapping uploaded file objects
    const resultFileName = await createWordToPdf(req.files);

    // 3. Return successfully generated response with compiled filename back to application state
    return res.status(200).json({
      success: true,
      message: "Word Document successfully converted to high-quality PDF.",
      fileName: resultFileName
    });

  } catch (error) {
    console.error("Error inside convertWordToPdfController node execution:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal engine collapse during Word-to-PDF compilation pipeline."
    });
  }
};