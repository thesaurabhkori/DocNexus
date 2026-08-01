import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { LIBREOFFICE_CONFIG } from "../../config/libreoffice.config.js";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";

class WatermarkPdfService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Applies text watermark onto all pages of a PDF document using pdf-lib.
   * Falls back to LibreOffice CLI transformation if specified.
   * @param {Array<Express.Multer.File>} files - Uploaded PDF file array.
   * @param {Object} bodyParams - Options like text, opacity, fontSize, degrees, color.
   * @returns {Promise<string>} Generated output PDF file name.
   */
  async watermarkPdf(files, bodyParams = {}) {
    const file = files[0];
    const absoluteInputPath = path.resolve(file.path);

    // If client explicitly requests CLI execution or fallback mode
    if (bodyParams.useCli === "true" || bodyParams.useCli === true) {
      return this.watermarkViaLibreOffice(file, absoluteInputPath);
    }

    try {
      const srcBytes = fs.readFileSync(file.path);
      const pdfDoc = await PDFDocument.load(srcBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const watermarkText = bodyParams.text || bodyParams.watermarkText || "WATERMARK";
      const fontSize = parseFloat(bodyParams.fontSize) || 50;
      const opacity = bodyParams.opacity !== undefined ? parseFloat(bodyParams.opacity) : 0.3;
      const rotationAngle = parseFloat(bodyParams.degrees || bodyParams.rotation) || 45;

      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, fontSize);
        const textHeight = helveticaFont.heightAtSize(fontSize);

        // Center position calculation
        const xPos = (width - textWidth) / 2;
        const yPos = (height - textHeight) / 2;

        page.drawText(watermarkText, {
          x: xPos,
          y: yPos,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0.7, 0.7, 0.7),
          opacity: opacity,
          rotate: degrees(rotationAngle),
        });
      });

      await safeUnlink(file.path);

      const secureName = `Processed-${Date.now()}.pdf`;
      const securePath = path.join(this.outputDir, secureName);

      const savedBytes = await pdfDoc.save();
      fs.writeFileSync(securePath, savedBytes);

      scheduleCleanUp(securePath, secureName);
      return secureName;

    } catch (err) {
      if (files && files.length > 0 && files[0]?.path) {
        await safeUnlink(files[0].path);
      }
      throw new Error(`Document structural parsing transformation pipeline failed: ${err.message}`);
    }
  }

  /**
   * Legacy LibreOffice conversion pipeline wrapper.
   */
  async watermarkViaLibreOffice(file, absoluteInputPath) {
    return new Promise((resolve, reject) => {
      const secureName = `Processed-${Date.now()}.pdf`;
      const securePath = path.join(this.outputDir, secureName);
      const cmd = `${LIBREOFFICE_CONFIG.binaryPath} --headless --convert-to pdf --outdir "${this.outputDir}" "${absoluteInputPath}"`;

      console.log(`[EXECUTION] Initiating complex document transformation metadata: ${cmd}`);

      exec(cmd, { timeout: LIBREOFFICE_CONFIG.timeoutMs }, async (err, stdout, stderr) => {
        console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
        if (stderr) console.error(`[LIBREOFFICE STDERR]:\n${stderr}`);

        await safeUnlink(file.path);

        const defaultLibreOfficeOutputName = path.basename(file.path, path.extname(file.path)) + ".pdf";
        const defaultLibreOfficeOutputPath = path.join(this.outputDir, defaultLibreOfficeOutputName);

        if (fs.existsSync(securePath)) {
          scheduleCleanUp(securePath, secureName);
          return resolve(secureName);
        } else if (fs.existsSync(defaultLibreOfficeOutputPath)) {
          fs.renameSync(defaultLibreOfficeOutputPath, securePath);
          scheduleCleanUp(securePath, secureName);
          return resolve(secureName);
        }

        if (err) {
          return reject(new Error(`Document structural parsing transformation pipeline failed: ${err.message}`));
        }

        return reject(new Error("File conversion pipeline failed: Output mismatch."));
      });
    });
  }
}

export default new WatermarkPdfService();