import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import sharp from "sharp";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";

class ImageToPdfService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async convertImagesToPdf(files, bodyParams = {}) {
    if (!files || files.length === 0) {
      throw new Error("No image files provided for conversion.");
    }

    try {
      const pdfDocument = await PDFDocument.create();
      const pageSize = bodyParams.pageSize || "A4 (210 x 297 mm)";
      const orientation = bodyParams.orientation || "Portrait";
      const margins = bodyParams.margins || "Normal";
      const imageFit = bodyParams.imageFit || "Fit to page";
      const imageQuality = bodyParams.imageQuality || "High";
      const addCaption = bodyParams.addCaption === "true";

      let pageWidth = 595.28;
      let pageHeight = 841.89;
      if (pageSize.startsWith("Letter")) {
        pageWidth = 612;
        pageHeight = 792;
      } else if (pageSize.startsWith("Legal")) {
        pageWidth = 612;
        pageHeight = 1008;
      }

      if (pageSize === "Original Size") {
        pageWidth = 0;
        pageHeight = 0;
      } else if (orientation.toLowerCase() === "landscape") {
        [pageWidth, pageHeight] = [pageHeight, pageWidth];
      }

      const margin = margins === "Small" ? 18 : margins === "None" ? 0 : 36;
      const captionHeight = addCaption ? 22 : 0;
      const quality = imageQuality === "Low" ? 55 : imageQuality === "Medium" ? 75 : 90;
      const font = addCaption ? await pdfDocument.embedFont(StandardFonts.Helvetica) : null;

      for (const file of files) {
        const imageBytes = fs.readFileSync(file.path);
        let image;

        try {
          const imageBuffer = await sharp(file.path).jpeg({ quality }).toBuffer();
          image = await pdfDocument.embedJpg(imageBuffer);
        } catch (conversionError) {
          if (file.mimetype === "image/png") {
            image = await pdfDocument.embedPng(imageBytes);
          } else {
            image = await pdfDocument.embedJpg(imageBytes);
          }
        }
        const currentPageWidth = pageWidth || image.width;
        const currentPageHeight = pageHeight || image.height;
        const page = pdfDocument.addPage([currentPageWidth, currentPageHeight]);
        const printableWidth = currentPageWidth - margin * 2;
        const printableHeight = currentPageHeight - margin * 2 - captionHeight;
        const scale = imageFit === "Fill page"
          ? Math.max(printableWidth / image.width, printableHeight / image.height)
          : Math.min(printableWidth / image.width, printableHeight / image.height);
        const imageWidth = image.width * scale;
        const imageHeight = image.height * scale;
        page.drawImage(image, {
          x: margin + (printableWidth - imageWidth) / 2,
          y: margin + captionHeight + (printableHeight - imageHeight) / 2,
          width: imageWidth,
          height: imageHeight,
        });

        if (font) {
          page.drawText(file.originalname || file.filename, {
            x: margin,
            y: margin,
            size: 10,
            font,
            color: rgb(0.25, 0.25, 0.25),
            maxWidth: printableWidth,
          });
        }
      }

      const outputFileName = `ImageCompiled-${Date.now()}.pdf`;
      const outputPath = path.join(this.outputDir, outputFileName);
      fs.writeFileSync(outputPath, await pdfDocument.save());

      await Promise.all(files.map((file) => safeUnlink(file.path)));
      scheduleCleanUp(outputPath, outputFileName);

      return outputFileName;
    } catch (error) {
      await Promise.all(files.map((file) => safeUnlink(file.path)));
      throw new Error(`Image to PDF engine error: ${error.message}`);
    }
  }
}

export default new ImageToPdfService();