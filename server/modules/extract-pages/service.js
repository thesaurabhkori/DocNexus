import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";
import { parsePageRanges } from "../../shared/utils/pdf.util.js";

class ExtractPagesService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Extracts specified pages from a PDF file into a new PDF document.
   * @param {Array<Express.Multer.File>} files - Uploaded PDF file array.
   * @param {Object} bodyParams - Body parameters containing 'pages' string (e.g. "1,3-5").
   * @returns {Promise<string>} Generated output PDF file name.
   */
  async extractPages(files, bodyParams = {}) {
    const file = files[0];

    try {
      const srcDocBytes = fs.readFileSync(file.path);
      const srcPdf = await PDFDocument.load(srcDocBytes);
      const totalPagesCount = srcPdf.getPageCount();

      if (totalPagesCount === 0) {
        throw new Error("The uploaded PDF document contains no pages.");
      }

      // Parse user requested pages (Convert 1-indexed string to 0-indexed indices)
      let targetIndices = [];
      if (bodyParams.pages && typeof bodyParams.pages === "string") {
        targetIndices = parsePageRanges(bodyParams.pages, totalPagesCount);
      } else {
        targetIndices = [0]; // Fallback to first page if no pages provided
      }

      // Filter valid 0-based page indices bound within document total count
      const validIndices = targetIndices.filter(
        (idx) => idx >= 0 && idx < totalPagesCount
      );

      const subPdf = await PDFDocument.create();
      const finalIndicesToCopy = validIndices.length > 0 ? validIndices : [0];

      const subPages = await subPdf.copyPages(srcPdf, finalIndicesToCopy);
      subPages.forEach((p) => subPdf.addPage(p));

      await safeUnlink(file.path);

      const sName = `extractpages-${Date.now()}.pdf`;
      const sPath = path.join(this.outputDir, sName);

      const savedBytes = await subPdf.save();
      fs.writeFileSync(sPath, savedBytes);

      scheduleCleanUp(sPath, sName);
      return sName;

    } catch (err) {
      if (files && files.length > 0 && files[0]?.path) {
        await safeUnlink(files[0].path);
      }
      throw new Error(`PDF Page slicing operation block context rejected: ${err.message}`);
    }
  }
}

export default new ExtractPagesService();