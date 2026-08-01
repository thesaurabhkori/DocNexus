import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";

class MergePdfService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Merges multiple PDF files into a single consolidated PDF document.
   * @param {Array<Express.Multer.File>} files - Array of uploaded PDF files.
   * @returns {Promise<string>} Generated output PDF file name.
   */
  async mergePdf(files) {
    try {
      const mergedDoc = await PDFDocument.create();

      for (const file of files) {
        const docBytes = fs.readFileSync(file.path);
        const loadedDoc = await PDFDocument.load(docBytes);
        const pages = await mergedDoc.copyPages(loadedDoc, loadedDoc.getPageIndices());
        
        pages.forEach((p) => mergedDoc.addPage(p));
        
        await safeUnlink(file.path);
      }

      const mName = `Merged-${Date.now()}.pdf`;
      const mPath = path.join(this.outputDir, mName);

      const savedBytes = await mergedDoc.save();
      fs.writeFileSync(mPath, savedBytes);

      scheduleCleanUp(mPath, mName);
      return mName;

    } catch (err) {
      if (files && files.length > 0) {
        files.forEach((f) => safeUnlink(f.path));
      }
      throw new Error(`PDF Consolidation pipeline layout map failed: ${err.message}`);
    }
  }
}

export default new MergePdfService();