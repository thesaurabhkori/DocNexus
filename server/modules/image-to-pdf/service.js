import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";

class ImageToPdfService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");
    
    // Ensure output directory exists at initialization
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Converts uploaded images into a PDF document according to provided options.
   * @param {Array<Express.Multer.File>} files - Uploaded image files.
   * @param {Object} bodyParams - Options like pageSize, orientation, margins, imageFit.
   * @returns {Promise<string>} Generated PDF file name.
   */
  async convertImageToPdf(files, bodyParams = {}) {
    try {
      const pdfDoc = await PDFDocument.create();

      let rawPageSize = bodyParams.pageSize || "A4";
      let cleanedPageSize = rawPageSize.split(" ")[0].toUpperCase();

      let targetWidth = 595.28;
      let targetHeight = 841.89;

      if (cleanedPageSize === "LETTER") {
        targetWidth = 612;
        targetHeight = 792;
      } else if (cleanedPageSize === "LEGAL") {
        targetWidth = 612;
        targetHeight = 1008;
      }

      const isLandscape = (bodyParams.orientation || "").toLowerCase() === "landscape";
      if (isLandscape) {
        const temp = targetWidth;
        targetWidth = targetHeight;
        targetHeight = temp;
      }

      let marginPadding = 36;
      const marginStr = (bodyParams.margins || "").toLowerCase();
      if (marginStr === "small") marginPadding = 18;
      if (marginStr === "none") marginPadding = 0;

      const printableWidth = targetWidth - marginPadding * 2;
      const printableHeight = targetHeight - marginPadding * 2;

      for (const file of files) {
        const imageBytes = fs.readFileSync(file.path);
        let embeddedImage;

        if (file.mimetype === "image/png") {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        }

        let imgWidth = embeddedImage.width;
        let imgHeight = embeddedImage.height;
        const fitMode = (bodyParams.imageFit || "").toLowerCase();

        if (fitMode === "fill page") {
          imgWidth = printableWidth;
          imgHeight = printableHeight;
        } else {
          const widthRatio = printableWidth / imgWidth;
          const heightRatio = printableHeight / imgHeight;
          const scaleFactor = Math.min(widthRatio, heightRatio);

          imgWidth = imgWidth * scaleFactor;
          imgHeight = imgHeight * scaleFactor;
        }

        const xOffset = marginPadding + (printableWidth - imgWidth) / 2;
        const yOffset = marginPadding + (printableHeight - imgHeight) / 2;

        const page = pdfDoc.addPage([targetWidth, targetHeight]);
        page.drawImage(embeddedImage, {
          x: xOffset,
          y: yOffset,
          width: imgWidth,
          height: imgHeight,
        });

        await safeUnlink(file.path);
      }

      const pdfName = `ImageCompiled-${Date.now()}.pdf`;
      const pdfPath = path.join(this.outputDir, pdfName);
      
      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync(pdfPath, pdfBytes);

      scheduleCleanUp(pdfPath, pdfName);
      return pdfName;

    } catch (error) {
      // Clean up uploaded files on failure
      if (files && files.length > 0) {
        files.forEach((f) => safeUnlink(f.path));
      }
      throw new Error(`Programmatic layouts image engine mapping failed: ${error.message}`);
    }
  }
}

export default new ImageToPdfService();