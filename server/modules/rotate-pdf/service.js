import fs from "fs";
import path from "path";
import { PDFDocument, degrees } from "pdf-lib";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";

class RotatePdfService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Rotates all pages in a PDF by a specified angle.
   * @param {Array<Express.Multer.File>} files - Uploaded PDF file array.
   * @param {Object} bodyParams - Body containing 'degrees' parameter.
   * @returns {Promise<string>} Generated output PDF file name.
   */
  async rotatePdf(files, bodyParams = {}) {
    const file = files[0];

    try {
      const rotateBytes = fs.readFileSync(file.path);
      const rPdf = await PDFDocument.load(rotateBytes);

      const rotationAngle = parseInt(bodyParams.degrees, 10) || 90;
      const allPages = rPdf.getPages();

      allPages.forEach((page) => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + rotationAngle) % 360));
      });

      await safeUnlink(file.path);

      const rName = `Rotated-${Date.now()}.pdf`;
      const rPath = path.join(this.outputDir, rName);

      const savedBytes = await rPdf.save();
      fs.writeFileSync(rPath, savedBytes);

      scheduleCleanUp(rPath, rName);
      return rName;

    } catch (err) {
      if (files && files.length > 0 && files[0]?.path) {
        await safeUnlink(files[0].path);
      }
      throw new Error(`Matrix geometry rotation parameter allocation error: ${err.message}`);
    }
  }
}

export default new RotatePdfService();