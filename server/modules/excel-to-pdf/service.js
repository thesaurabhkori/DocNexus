import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { LIBREOFFICE_CONFIG } from "../../config/libreoffice.config.js";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";

class ExcelToPdfService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Converts an Excel spreadsheet (.xls / .xlsx / .csv / .ods) to PDF using LibreOffice CLI.
   * @param {Array<Express.Multer.File>} files - Uploaded file array containing Excel spreadsheet.
   * @returns {Promise<string>} Generated output PDF file name.
   */
  async convertExcelToPdf(files) {
    const file = files[0];
    const absoluteInputPath = path.resolve(file.path);

    return new Promise((resolve, reject) => {
      const eName = `ExcelConverted-${Date.now()}.pdf`;
      const ePath = path.join(this.outputDir, eName);

      // LibreOffice generates output in outputDir named after original file stem + .pdf
      const defaultLibreOfficeOutputName = path.basename(file.path, path.extname(file.path)) + ".pdf";
      const defaultLibreOfficeOutputPath = path.join(this.outputDir, defaultLibreOfficeOutputName);

      const cmd = `${LIBREOFFICE_CONFIG.binaryPath} --headless --convert-to pdf --outdir "${this.outputDir}" "${absoluteInputPath}"`;

      console.log(`[EXECUTION] Initializing Excel-to-PDF conversion matrix: ${cmd}`);

      exec(cmd, { timeout: LIBREOFFICE_CONFIG.timeoutMs }, async (err, stdout, stderr) => {
        console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
        if (stderr) console.error(`[LIBREOFFICE STDERR]:\n${stderr}`);

        // Purge staging upload file immediately after execution
        await safeUnlink(file.path);

        // Resolve target file path
        let generatedFilePath = null;
        if (fs.existsSync(ePath)) {
          generatedFilePath = ePath;
        } else if (fs.existsSync(defaultLibreOfficeOutputPath)) {
          fs.renameSync(defaultLibreOfficeOutputPath, ePath);
          generatedFilePath = ePath;
        }

        if (generatedFilePath && fs.existsSync(generatedFilePath)) {
          scheduleCleanUp(ePath, eName);
          return resolve(eName);
        }

        if (err) {
          return reject(new Error(`Excel to PDF conversion engine failure: ${err.message}`));
        }

        return reject(new Error("File conversion pipeline failed: Output mismatch."));
      });
    });
  }
}

export default new ExcelToPdfService();