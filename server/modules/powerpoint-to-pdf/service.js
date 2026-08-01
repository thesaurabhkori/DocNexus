import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { LIBREOFFICE_CONFIG } from "../../config/libreoffice.config.js";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";

class PowerPointToPdfService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Converts a PowerPoint presentation (.ppt / .pptx / .odp) to PDF using LibreOffice CLI.
   * @param {Array<Express.Multer.File>} files - Uploaded file array containing PowerPoint presentation.
   * @returns {Promise<string>} Generated output PDF file name.
   */
  async convertPowerPointToPdf(files) {
    const file = files[0];
    const absoluteInputPath = path.resolve(file.path);

    return new Promise((resolve, reject) => {
      const pName = `PptConverted-${Date.now()}.pdf`;
      const pPath = path.join(this.outputDir, pName);

      // LibreOffice generates output in outputDir named after original file stem + .pdf
      const defaultLibreOfficeOutputName = path.basename(file.path, path.extname(file.path)) + ".pdf";
      const defaultLibreOfficeOutputPath = path.join(this.outputDir, defaultLibreOfficeOutputName);

      const cmd = `${LIBREOFFICE_CONFIG.binaryPath} --headless --convert-to pdf --outdir "${this.outputDir}" "${absoluteInputPath}"`;

      console.log(`[EXECUTION] Initializing PowerPoint-to-PDF conversion matrix: ${cmd}`);

      exec(cmd, { timeout: LIBREOFFICE_CONFIG.timeoutMs }, async (err, stdout, stderr) => {
        console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
        if (stderr) console.error(`[LIBREOFFICE STDERR]:\n${stderr}`);

        // Purge staging upload file immediately after execution
        await safeUnlink(file.path);

        // Resolve generated output target path
        let generatedFilePath = null;
        if (fs.existsSync(pPath)) {
          generatedFilePath = pPath;
        } else if (fs.existsSync(defaultLibreOfficeOutputPath)) {
          fs.renameSync(defaultLibreOfficeOutputPath, pPath);
          generatedFilePath = pPath;
        }

        if (generatedFilePath && fs.existsSync(generatedFilePath)) {
          scheduleCleanUp(pPath, pName);
          return resolve(pName);
        }

        if (err) {
          return reject(new Error(`PowerPoint to PDF conversion engine failure: ${err.message}`));
        }

        return reject(new Error("File conversion pipeline failed: Output mismatch."));
      });
    });
  }
}

export default new PowerPointToPdfService();