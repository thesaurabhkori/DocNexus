import fs from "fs";
import path from "path";
import docxConverter from "docx-pdf";

const safeUnlink = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Error deleting file at ${filePath}:`, err);
    });
  }
};

/**
 * Word to PDF conversion service using docx-pdf pipeline
 * @param {Array} files - Multer uploaded file descriptors
 * @returns {Promise<string>} - Converted PDF filename
 */
export const createWordToPdf = async (files) => {
  if (!files || files.length === 0) {
    throw new Error("No files uploaded for conversion.");
  }

  const inputFile = files[0];
  const outputDir = path.join(process.cwd(), "converted");
  
  // Ensure target folder exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputFileName = `PDF-WORD-${Date.now()}-${Math.floor(Math.random() * 1000)}.pdf`;
  const outputPath = path.join(outputDir, outputFileName);

  return new Promise((resolve, reject) => {
    // Execute docx to pdf converter engine logic
    docxConverter(inputFile.path, outputPath, (err, result) => {
      // ⚠️ Staging source clean-up: Convert hote hi original docx delete karein temp se
      safeUnlink(inputFile.path);

      if (err) {
        safeUnlink(outputPath);
        return reject(err);
      }

      // ⏱️ Auto-clean target converted files from disk after 2 minutes
      setTimeout(() => {
        safeUnlink(outputPath);
        console.log(`Auto-Cleaned compiled file: ${outputFileName}`);
      }, 2 * 60 * 1000);

      resolve(outputFileName);
    });
  });
};