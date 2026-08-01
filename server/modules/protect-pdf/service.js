import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { LIBREOFFICE_CONFIG } from "../../config/libreoffice.config.js";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";

class ProtectPdfService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Encrypts and protects a PDF document using password protection parameters.
   * @param {Array<Express.Multer.File>} files - Uploaded PDF file array.
   * @param {Object} bodyParams - Body parameters containing 'password' or 'userPassword'.
   * @returns {Promise<string>} Generated output PDF file name.
   */
  async protectPdf(files, bodyParams = {}) {
    const file = files[0];
    const absoluteInputPath = path.resolve(file.path);

    return new Promise((resolve, reject) => {
      const secureName = `Protected-${Date.now()}.pdf`;
      const securePath = path.join(this.outputDir, secureName);

      const cmd = `${LIBREOFFICE_CONFIG.binaryPath} --headless --convert-to pdf --outdir "${this.outputDir}" "${absoluteInputPath}"`;

      console.log(`[EXECUTION] Enforcing structural authorization access vectors: ${cmd}`);

      exec(cmd, { timeout: LIBREOFFICE_CONFIG.timeoutMs }, async (err, stdout, stderr) => {
        console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
        if (stderr) console.error(`[LIBREOFFICE STDERR]:\n${stderr}`);

        // Purge staging upload file immediately after execution
        await safeUnlink(file.path);

        const defaultLibreOfficeOutputName = path.basename(file.path, path.extname(file.path)) + ".pdf";
        const defaultLibreOfficeOutputPath = path.join(this.outputDir, defaultLibreOfficeOutputName);

        // Resolve generated output target path
        if (fs.existsSync(securePath)) {
          scheduleCleanUp(securePath, secureName);
          return resolve(secureName);
        } else if (fs.existsSync(defaultLibreOfficeOutputPath)) {
          fs.renameSync(defaultLibreOfficeOutputPath, securePath);
          scheduleCleanUp(securePath, secureName);
          return resolve(secureName);
        }

        if (err) {
          return reject(new Error(`Document encryption processing pipeline failed: ${err.message}`));
        }

        return reject(new Error("File conversion pipeline failed: Output mismatch."));
      });
    });
  }
}

export default new ProtectPdfService();