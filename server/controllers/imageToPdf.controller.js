import { createPdf } from "../services/imageToPdf.service.js";
import fs from "fs/promises";

export const convertImageToPdf = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No images uploaded." });
    }

    // --- FRONTEND STRING PAYLOADS KO CLEAN & PARSE KARNA ---
    
    // 1. Page Size clean karein (e.g., "A4 (210 x 297 mm)" se sirf "A4" extract karein)
    let rawPageSize = req.body.pageSize || "A4";
    let cleanedPageSize = rawPageSize.split(" ")[0]; // "A4", "Letter", "Legal", "Original"

    // 2. Margins map karein numeric values me ya service layer standard me
    let rawMargins = req.body.margins || "Normal"; // Normal, Small, None

    // 3. String checkboxes ko accurate Boolean me parse karein
    const addCaption = req.body.addCaption === "true";
    const mergePdf = req.body.mergePdf === "true";

    // Frontend layout parameters read karne ke liye options object
    const options = {
      pageSize: cleanedPageSize,
      orientation: req.body.orientation || "Portrait",
      margins: rawMargins, // "Normal", "Small", "None" 
      imageFit: req.body.imageFit || "Fit to page", // "Fit to page", "Fill page"
      imageQuality: req.body.imageQuality || "High", // "Low", "Medium", "High"
      addCaption: addCaption,
      mergePdf: mergePdf
    };

    // Service function call with uploaded files and configuration
    const pdfPath = await createPdf(req.files, options);

    // ⚡ DYNAMIC PROTOCOL & HOST EXTRACTOR (Dev Tunnels / Mobile IP sync ke liye zaroori hai)
    const dynamicBaseUrl = `${req.protocol}://${req.get("host")}`;

    return res.status(200).json({
      success: true,
      pdfUrl: `${dynamicBaseUrl}/converted/${pdfPath}` // 🌟 Ab yeh output dynamically exact route banayega
    });

  } catch (error) {
    console.error("Error in convertImageToPdf controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong during conversion."
    });
  } finally {
    // Crucial Cleanup: Temp raw files ko process ke baad delete karna mandatory hai
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (cleanupError) {
          console.error(`Temporary file deletion failed for ${file.path}:`, cleanupError);
        }
      }
    }
  }
};