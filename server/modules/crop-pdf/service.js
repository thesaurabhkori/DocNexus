import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";

class CropPdfService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Crops all pages in a PDF according to bounding box coordinates or margin parameters.
   * @param {Array<Express.Multer.File>} files - Uploaded PDF file array.
   * @param {Object} bodyParams - Crop coordinates (x, y, width, height) or margins (top, bottom, left, right).
   * @returns {Promise<string>} Generated output PDF file name.
   */
  async cropPdf(files, bodyParams = {}) {
    const file = files[0];

    try {
      const srcBytes = fs.readFileSync(file.path);
      const pdfDoc = await PDFDocument.load(srcBytes);
      const pages = pdfDoc.getPages();

      if (pages.length === 0) {
        throw new Error("The uploaded PDF document contains no pages.");
      }

      pages.forEach((page) => {
        const { width: originalWidth, height: originalHeight } = page.getSize();

        let cropX = 0;
        let cropY = 0;
        let cropWidth = originalWidth;
        let cropHeight = originalHeight;

        // Mode 1: Explicit Bounding Box (x, y, width, height)
        if (bodyParams.width && bodyParams.height) {
          cropX = parseFloat(bodyParams.x) || 0;
          cropY = parseFloat(bodyParams.y) || 0;
          cropWidth = parseFloat(bodyParams.width);
          cropHeight = parseFloat(bodyParams.height);
        } 
        // Mode 2: Margin Offsets (top, bottom, left, right)
        else if (bodyParams.top || bodyParams.bottom || bodyParams.left || bodyParams.right) {
          const marginTop = parseFloat(bodyParams.top) || 0;
          const marginBottom = parseFloat(bodyParams.bottom) || 0;
          const marginLeft = parseFloat(bodyParams.left) || 0;
          const marginRight = parseFloat(bodyParams.right) || 0;

          cropX = marginLeft;
          cropY = marginBottom;
          cropWidth = Math.max(1, originalWidth - marginLeft - marginRight);
          cropHeight = Math.max(1, originalHeight - marginTop - marginBottom);
        }

        // Apply CropBox bounding rect to PDF page
        page.setCropBox(cropX, cropY, cropWidth, cropHeight);
      });

      await safeUnlink(file.path);

      const cName = `Cropped-${Date.now()}.pdf`;
      const cPath = path.join(this.outputDir, cName);

      const savedBytes = await pdfDoc.save();
      fs.writeFileSync(cPath, savedBytes);

      scheduleCleanUp(cPath, cName);
      return cName;

    } catch (err) {
      if (files && files.length > 0 && files[0]?.path) {
        await safeUnlink(files[0].path);
      }
      throw new Error(`PDF Bounding box cropping transformation failed: ${err.message}`);
    }
  }
}

export default new CropPdfService();