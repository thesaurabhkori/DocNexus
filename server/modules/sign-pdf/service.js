import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import { LIBREOFFICE_CONFIG } from "../../config/libreoffice.config.js";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";

class SignPdfService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Embeds a signature onto a PDF document.
   * @param {Array<Express.Multer.File>} files - Uploaded files array (files[0] = PDF, files[1] = optional signature image).
   * @param {Object} bodyParams - Body containing 'signature', 'x', 'y', 'width', 'height', 'pageNumber'.
   * @returns {Promise<string>} Generated output PDF file name.
   */
  async signPdf(files, bodyParams = {}) {
    const pdfFile = files[0];
    const absoluteInputPath = path.resolve(pdfFile.path);

    // Check if client explicitly requests CLI execution or fallback mode
    if (bodyParams.useCli === "true" || bodyParams.useCli === true) {
      return this.signViaLibreOffice(pdfFile, absoluteInputPath);
    }

    try {
      const pdfBytes = fs.readFileSync(pdfFile.path);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();

      if (pages.length === 0) {
        throw new Error("The uploaded PDF document contains no pages.");
      }

      // Determine Target Page (1-indexed input converted to 0-indexed)
      const requestedPage = parseInt(bodyParams.pageNumber, 10) || 1;
      const pageIndex = Math.max(0, Math.min(requestedPage - 1, pages.length - 1));
      const targetPage = pages[pageIndex];

      // Extract Signature Bytes (from 2nd uploaded file or base64 payload string)
      let signatureBuffer = null;

      if (files.length > 1 && files[1]?.path) {
        signatureBuffer = fs.readFileSync(files[1].path);
        await safeUnlink(files[1].path);
      } else if (bodyParams.signature && typeof bodyParams.signature === "string") {
        const base64Data = bodyParams.signature.replace(/^data:image\/\w+;base64,/, "");
        signatureBuffer = Buffer.from(base64Data, "base64");
      }

      // If a signature image buffer is available, embed it onto the target page
      if (signatureBuffer) {
        // Optimize and convert signature image to PNG buffer via Sharp
        const processedImageBuffer = await sharp(signatureBuffer)
          .png()
          .toBuffer();

        const embeddedImage = await pdfDoc.embedPng(processedImageBuffer);

        const { width: pageWidth, height: pageHeight } = targetPage.getSize();

        const sigWidth = parseFloat(bodyParams.width) || embeddedImage.width / 2;
        const sigHeight = parseFloat(bodyParams.height) || embeddedImage.height / 2;

        // Default position: bottom-right corner if coordinates not provided
        const posX = bodyParams.x !== undefined ? parseFloat(bodyParams.x) : pageWidth - sigWidth - 50;
        const posY = bodyParams.y !== undefined ? parseFloat(bodyParams.y) : 50;

        targetPage.drawImage(embeddedImage, {
          x: posX,
          y: posY,
          width: sigWidth,
          height: sigHeight,
        });
      }

      await safeUnlink(pdfFile.path);

      const sName = `Signed-${Date.now()}.pdf`;
      const sPath = path.join(this.outputDir, sName);

      const savedBytes = await pdfDoc.save();
      fs.writeFileSync(sPath, savedBytes);

      scheduleCleanUp(sPath, sName);
      return sName;

    } catch (err) {
      if (files && files.length > 0) {
        files.forEach((f) => safeUnlink(f.path));
      }
      throw new Error(`PDF Signature embedding pipeline failed: ${err.message}`);
    }
  }

  /**
   * Legacy LibreOffice conversion pipeline fallback.
   */
  async signViaLibreOffice(file, absoluteInputPath) {
    return new Promise((resolve, reject) => {
      const sName = `Signed-${Date.now()}.pdf`;
      const sPath = path.join(this.outputDir, sName);
      const cmd = `${LIBREOFFICE_CONFIG.binaryPath} --headless --convert-to pdf --outdir "${this.outputDir}" "${absoluteInputPath}"`;

      console.log(`[EXECUTION] Executing digital signature transformation pipeline: ${cmd}`);

      exec(cmd, { timeout: LIBREOFFICE_CONFIG.timeoutMs }, async (err, stdout, stderr) => {
        console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
        if (stderr) console.error(`[LIBREOFFICE STDERR]:\n${stderr}`);

        await safeUnlink(file.path);

        const defaultLibreOfficeOutputName = path.basename(file.path, path.extname(file.path)) + ".pdf";
        const defaultLibreOfficeOutputPath = path.join(this.outputDir, defaultLibreOfficeOutputName);

        if (fs.existsSync(sPath)) {
          scheduleCleanUp(sPath, sName);
          return resolve(sName);
        } else if (fs.existsSync(defaultLibreOfficeOutputPath)) {
          fs.renameSync(defaultLibreOfficeOutputPath, sPath);
          scheduleCleanUp(sPath, sName);
          return resolve(sName);
        }

        if (err) {
          return reject(new Error(`Document signature processing pipeline failed: ${err.message}`));
        }

        return reject(new Error("File conversion pipeline failed: Output mismatch."));
      });
    });
  }
}

export default new SignPdfService();