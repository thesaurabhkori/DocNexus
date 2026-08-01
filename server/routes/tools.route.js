// import express from "express";
// import multer from "multer";
// import upload from "../middlewares/upload.middleware.js";
// import { handleToolPipelineController } from "../controllers/tools.controller.js";

// const router = express.Router();

// // Supported dynamic actions matrix filter loop safety layer
// const allowedTools = [
//   "imagetopdf", "wordtopdf", // 🚀 FIXED: Case-insensitive dynamic match configuration
//   "compresspdf", "croppdf", "exceltopdf", "extractpages", "htmltopdf",
//   "mergepdf", "pdftoexcel", "pdftojpg", "pdftopdfa", "pdftoppt",
//   "pdftoword", "powerpointtopdf", "protectpdf", "removepages", 
//   "rotatepdf", "signpdf", "splitpdf", "unlockpdf", "watermarkpdf"
// ];

// // Wrapper array storage interceptor to gracefully capture Multer boundary failures
// const multerUploadWrapper = (req, res, next) => {
//   upload.array("files")(req, res, (err) => {
//     if (err) {
//       console.error("[MULTER FAULT] Error captured during dynamic stream intercept:", err);
      
//       // Handle explicit field name mismatches structurally
//       if (err instanceof multer.MulterError) {
//         if (err.code === "LIMIT_UNEXPECTED_FILE") {
//           return res.status(400).json({
//             success: false,
//             message: "Multer mapping mismatch error: Multiparts form key payload must strictly target field string 'files'."
//           });
//         }
//         return res.status(400).json({ success: false, message: `Storage boundary error: ${err.message}` });
//       }
      
//       return res.status(400).json({ success: false, message: err.message || "File formatting validation rejected." });
//     }
//     next();
//   });
// };

// // 🚀 Unified dynamic endpoint pipeline router
// router.post("/:action", multerUploadWrapper, (req, res, next) => {
//   // Normalize action structure to match case-insensitive configurations array (e.g., 'word-to-pdf' becomes 'wordtopdf')
//   const normalizedAction = req.params.action.toLowerCase().replace(/[^a-z0-9]/g, "");
  
//   if (!allowedTools.includes(normalizedAction)) {
//     return res.status(404).json({
//       success: false,
//       message: `The endpoint path processing engine does not support '/api/${req.params.action}'.`
//     });
//   }

//   // 🚀 FIXED: Normalized string ko request object me inject kar diya taaki controller bina hyphen issue ke read kar sake
//   req.normalizedAction = normalizedAction;
  
//   next();
// }, handleToolPipelineController);

// export default router;