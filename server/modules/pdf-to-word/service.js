import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { LIBREOFFICE_CONFIG } from "../../config/libreoffice.config.js";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";

class PdfToWordService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Converts a PDF document to Word (.docx) format using LibreOffice Writer with PDF Import.
   * @param {Array<Express.Multer.File>} files - Uploaded file array containing PDF document.
   * @returns {Promise<string>} Generated output Word document file name.
   */
  async convertPdfToWord(files) {
    const file = files[0];
    const absoluteInputPath = path.resolve(file.path);
    const fileBaseName = path.basename(file.filename, path.extname(file.filename));

    return new Promise((resolve, reject) => {
      const docxName = `WordConverted-${Date.now()}.docx`;
      const docxPath = path.join(this.outputDir, docxName);

      // Default output path constructed by LibreOffice CLI
      const defaultLibreOfficeOutputName = `${path.basename(file.path, path.extname(file.path))}.docx`;
      const defaultLibreOfficeOutputPath = path.join(this.outputDir, defaultLibreOfficeOutputName);

      const cmd = `${LIBREOFFICE_CONFIG.binaryPath} --headless --convert-to docx:"Writer with PDF Import" --outdir "${this.outputDir}" "${absoluteInputPath}"`;

      console.log(`[EXECUTION] Initializing PDF-to-Word conversion matrix: ${cmd}`);

      exec(cmd, { timeout: LIBREOFFICE_CONFIG.timeoutMs }, async (err, stdout, stderr) => {
        console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
        if (stderr) console.warn(`[LIBREOFFICE STDERR]:\n${stderr}`);

        // Purge staging upload file immediately after process execution
        await safeUnlink(file.path);

        // Standard Case Validation Guard
        if (fs.existsSync(docxPath)) {
          scheduleCleanUp(docxPath, docxName);
          return resolve(docxName);
        } else if (fs.existsSync(defaultLibreOfficeOutputPath)) {
          fs.renameSync(defaultLibreOfficeOutputPath, docxPath);
          scheduleCleanUp(docxPath, docxName);
          return resolve(docxName);
        }

        // Advanced Recovery Loop: Detect truncated/misnamed output files in output directory
        try {
          const filesInDir = fs.readdirSync(this.outputDir);
          const nameFirstToken = fileBaseName.split(".")[0].toLowerCase();

          const misnamedFile = filesInDir.find(
            (f) => f.toLowerCase().endsWith(".docx") && f.toLowerCase().startsWith(nameFirstToken)
          );

          if (misnamedFile) {
            const currentGeneratedPath = path.join(this.outputDir, misnamedFile);
            console.log(`[RECOVERY INTERCEPT] Truncated runtime format active: '${misnamedFile}'. Syncing names layout...`);

            fs.renameSync(currentGeneratedPath, docxPath);

            if (fs.existsSync(docxPath)) {
              scheduleCleanUp(docxPath, docxName);
              return resolve(docxName);
            }
          }
        } catch (scanErr) {
          console.error("Directory engine normalizer system check error:", scanErr);
        }

        if (err) {
          console.error(`[COMPILER ENGINE REJECTION EXCEPTION]:`, err);
          return reject(new Error(`PDF to Word layout parsing aborted: ${err.message}`));
        }

        return reject(
          new Error("File conversion pipeline failed: Output mismatch or asset absent from storage layout.")
        );
      });
    });
  }
}

export default new PdfToWordService();