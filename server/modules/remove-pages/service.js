import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";
import { parsePageRanges } from "../../shared/utils/pdf.util.js";

class RemovePagesService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Removes specified pages from a PDF document.
   * @param {Array<Express.Multer.File>} files - Uploaded PDF file array.
   * @param {Object} bodyParams - Body parameters containing 'pages' string (e.g., "1,3" or "2-4").
   * @returns {Promise<string>} Generated output PDF file name.
   */
  async removePages(files, bodyParams = {}) {
    const file = files[0];

    try {
      const srcDocBytes = fs.readFileSync(file.path);
      const srcPdf = await PDFDocument.load(srcDocBytes);
      const totalCount = srcPdf.getPageCount();

      if (totalCount === 0) {
        throw new Error("The uploaded PDF document contains no pages.");
      }

      // Parse 0-indexed page indices requested for removal
      let pagesToRemove = [];
      if (bodyParams.pages && typeof bodyParams.pages === "string") {
        pagesToRemove = parsePageRanges(bodyParams.pages, totalCount);
      }

      // Calculate indices to keep by inverting removal set
      const indicesToKeep = [];
      for (let i = 0; i < totalCount; i++) {
        if (!pagesToRemove.includes(i)) {
          indicesToKeep.push(i);
        }
      }

      if (indicesToKeep.length === 0) {
        throw new Error("Cannot remove all pages from the PDF document.");
      }

      const subPdf = await PDFDocument.create();
      const subPages = await subPdf.copyPages(srcPdf, indicesToKeep);
      subPages.forEach((p) => subPdf.addPage(p));

      await safeUnlink(file.path);

      const remName = `RemovedPages-${Date.now()}.pdf`;
      const remPath = path.join(this.outputDir, remName);

      const savedBytes = await subPdf.save();
      fs.writeFileSync(remPath, savedBytes);

      scheduleCleanUp(remPath, remName);
      return remName;

    } catch (err) {
      if (files && files.length > 0 && files[0]?.path) {
        await safeUnlink(files[0].path);
      }
      throw new Error(`Page excision validation structural failure: ${err.message}`);
    }
  }
}

export default new RemovePagesService();