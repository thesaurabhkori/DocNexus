import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { LIBREOFFICE_CONFIG } from "../../config/libreoffice.config.js";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";

class PdfToExcelService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Converts a PDF document to Excel (.xlsx) format using LibreOffice Calc.
   * @param {Array<Express.Multer.File>} files - Uploaded file array containing PDF document.
   * @returns {Promise<string>} Generated output Excel spreadsheet file name.
   */
  async convertPdfToExcel(files) {
    const file = files[0];
    const absoluteInputPath = path.resolve(file.path);
    const fileBaseName = path.basename(file.filename, path.extname(file.filename));

    return new Promise((resolve, reject) => {
      const xlsxName = `ExcelConverted-${Date.now()}.xlsx`;
      const xlsxPath = path.join(this.outputDir, xlsxName);

      // Default output path constructed by LibreOffice CLI
      const defaultLibreOfficeOutputName = `${path.basename(file.path, path.extname(file.path))}.xlsx`;
      const defaultLibreOfficeOutputPath = path.join(this.outputDir, defaultLibreOfficeOutputName);

      const cmd = `${LIBREOFFICE_CONFIG.binaryPath} --headless --convert-to xlsx:"Calc Office Open XML" --outdir "${this.outputDir}" "${absoluteInputPath}"`;

      console.log(`[EXECUTION] Initializing PDF-to-Excel conversion matrix: ${cmd}`);

      exec(cmd, { timeout: LIBREOFFICE_CONFIG.timeoutMs }, async (err, stdout, stderr) => {
        console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
        if (stderr) console.warn(`[LIBREOFFICE STDERR]:\n${stderr}`);

        // Purge staging upload file immediately after execution
        await safeUnlink(file.path);

        // Standard Case Validation Guard
        if (fs.existsSync(xlsxPath)) {
          scheduleCleanUp(xlsxPath, xlsxName);
          return resolve(xlsxName);
        } else if (fs.existsSync(defaultLibreOfficeOutputPath)) {
          fs.renameSync(defaultLibreOfficeOutputPath, xlsxPath);
          scheduleCleanUp(xlsxPath, xlsxName);
          return resolve(xlsxName);
        }

        // Advanced Recovery Loop: Detect truncated/misnamed output files in output directory
        try {
          const filesInDir = fs.readdirSync(this.outputDir);
          const nameFirstToken = fileBaseName.split(".")[0].toLowerCase();

          const misnamedFile = filesInDir.find(
            (f) => f.toLowerCase().endsWith(".xlsx") && f.toLowerCase().startsWith(nameFirstToken)
          );

          if (misnamedFile) {
            const currentGeneratedPath = path.join(this.outputDir, misnamedFile);
            console.log(`[RECOVERY INTERCEPT] Truncated runtime format active: '${misnamedFile}'. Syncing names layout...`);

            fs.renameSync(currentGeneratedPath, xlsxPath);

            if (fs.existsSync(xlsxPath)) {
              scheduleCleanUp(xlsxPath, xlsxName);
              return resolve(xlsxName);
            }
          }
        } catch (scanErr) {
          console.error("Directory engine normalizer system check error:", scanErr);
        }

        if (err) {
          console.error(`[COMPILER ENGINE REJECTION EXCEPTION]:`, err);
          return reject(new Error(`PDF to Excel layout parsing aborted: ${err.message}`));
        }

        return reject(
          new Error("File conversion pipeline failed: Output mismatch or asset absent from storage layout.")
        );
      });
    });
  }
}

export default new PdfToExcelService();