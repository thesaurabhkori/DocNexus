import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { PDFDocument } from "pdf-lib";
import { LIBREOFFICE_CONFIG } from "../../config/libreoffice.config.js";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";

class UnlockPdfService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Unlocks a password-protected PDF document.
   * @param {Array<Express.Multer.File>} files - Uploaded PDF file array.
   * @param {Object} bodyParams - Body containing 'password' or 'userPassword'.
   * @returns {Promise<string>} Generated output PDF file name.
   */
  async unlockPdf(files, bodyParams = {}) {
    const file = files[0];
    const absoluteInputPath = path.resolve(file.path);
    const providedPassword = bodyParams.password || bodyParams.userPassword || bodyParams.ownerPassword || "";

    // Mode 1: Direct Programmatic Decryption via pdf-lib
    try {
      const pdfBytes = fs.readFileSync(file.path);

      // Attempt to load PDF using provided password (or ignore password if unencrypted)
      const pdfDoc = await PDFDocument.load(pdfBytes, {
        password: providedPassword,
        ignoreEncryption: true,
      });

      const uName = `Unlocked-${Date.now()}.pdf`;
      const uPath = path.join(this.outputDir, uName);

      // Saving document strips existing password protection flags
      const savedBytes = await pdfDoc.save();
      fs.writeFileSync(uPath, savedBytes);

      await safeUnlink(file.path);
      scheduleCleanUp(uPath, uName);

      return uName;

    } catch (pdfLibError) {
      console.warn(`[UNLOCK WARNING] pdf-lib direct unlock bypassed, attempting CLI engine fallback: ${pdfLibError.message}`);
      
      // Mode 2: Legacy Subprocess CLI Execution Fallback
      return this.unlockViaLibreOffice(file, absoluteInputPath);
    }
  }

  /**
   * Legacy LibreOffice conversion pipeline fallback.
   */
  async unlockViaLibreOffice(file, absoluteInputPath) {
    return new Promise((resolve, reject) => {
      const uName = `Unlocked-${Date.now()}.pdf`;
      const uPath = path.join(this.outputDir, uName);
      const cmd = `${LIBREOFFICE_CONFIG.binaryPath} --headless --convert-to pdf --outdir "${this.outputDir}" "${absoluteInputPath}"`;

      console.log(`[EXECUTION] Executing document security credential bypass pipeline: ${cmd}`);

      exec(cmd, { timeout: LIBREOFFICE_CONFIG.timeoutMs }, async (err, stdout, stderr) => {
        console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
        if (stderr) console.error(`[LIBREOFFICE STDERR]:\n${stderr}`);

        await safeUnlink(file.path);

        const defaultLibreOfficeOutputName = path.basename(file.path, path.extname(file.path)) + ".pdf";
        const defaultLibreOfficeOutputPath = path.join(this.outputDir, defaultLibreOfficeOutputName);

        if (fs.existsSync(uPath)) {
          scheduleCleanUp(uPath, uName);
          return resolve(uName);
        } else if (fs.existsSync(defaultLibreOfficeOutputPath)) {
          fs.renameSync(defaultLibreOfficeOutputPath, uPath);
          scheduleCleanUp(uPath, uName);
          return resolve(uName);
        }

        if (err) {
          return reject(new Error(`Document decryption processing pipeline failed: ${err.message}`));
        }

        return reject(new Error("File conversion pipeline failed: Output mismatch."));
      });
    });
  }
}

export default new UnlockPdfService();