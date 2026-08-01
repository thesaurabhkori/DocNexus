import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";
import { parsePageRanges } from "../../shared/utils/pdf.util.js";

class SplitPdfService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Splits a source PDF according to provided page numbers or ranges.
   * @param {Array<Express.Multer.File>} files - Uploaded PDF file array.
   * @param {Object} bodyParams - Body containing 'pages' or 'range' parameter.
   * @returns {Promise<string>} Generated output PDF file name.
   */
  async splitPdf(files, bodyParams = {}) {
    const file = files[0];

    try {
      const pdfBytes = fs.readFileSync(file.path);
      const srcDoc = await PDFDocument.load(pdfBytes);
      const totalPages = srcDoc.getPageCount();

      if (totalPages === 0) {
        throw new Error("The uploaded PDF contains no pages.");
      }

      // Range string parsing (e.g. "1-3" or "2,4,6")
      const rangeInput = bodyParams.pages || bodyParams.range || `1-${totalPages}`;
      const targetIndices = parsePageRanges(rangeInput, totalPages);

      if (targetIndices.length === 0) {
        throw new Error("Invalid page selection specified for PDF splitting.");
      }

      // Create new split PDF document containing targeted pages
      const splitDoc = await PDFDocument.create();
      const copiedPages = await splitDoc.copyPages(srcDoc, targetIndices);
      copiedPages.forEach((p) => splitDoc.addPage(p));

      const splitFileName = `Split-${Date.now()}.pdf`;
      const splitFilePath = path.join(this.outputDir, splitFileName);

      const savedBytes = await splitDoc.save();
      fs.writeFileSync(splitFilePath, savedBytes);

      // Clean up uploaded staging file
      await safeUnlink(file.path);

      // Schedule cleanup for generated output file
      scheduleCleanUp(splitFilePath, splitFileName);

      return splitFileName;

    } catch (error) {
      if (files && files.length > 0) {
        files.forEach((f) => safeUnlink(f.path));
      }
      throw new Error(`PDF Splitting process failed: ${error.message}`);
    }
  }
}

export default new SplitPdfService();