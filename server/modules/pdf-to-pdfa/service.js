import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { LIBREOFFICE_CONFIG } from "../../config/libreoffice.config.js";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";

class PdfToPdfaService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Converts a standard PDF document to PDF/A ISO archival format using LibreOffice PDF Export filter.
   * @param {Array<Express.Multer.File>} files - Uploaded file array containing PDF document.
   * @param {Object} bodyParams - Additional options like pdfVersion.
   * @returns {Promise<string>} Generated output PDF/A file name.
   */
  async convertPdfToPdfa(files, bodyParams = {}) {
    const file = files[0];
    const absoluteInputPath = path.resolve(file.path);
    const fileBaseName = path.basename(file.filename, path.extname(file.filename));

    return new Promise((resolve, reject) => {
      const pdfaName = `PdfaConverted-${Date.now()}.pdf`;
      const pdfaPath = path.join(this.outputDir, pdfaName);

      // Default output path constructed by LibreOffice CLI
      const defaultLibreOfficeOutputName = `${path.basename(file.path, path.extname(file.path))}.pdf`;
      const defaultLibreOfficeOutputPath = path.join(this.outputDir, defaultLibreOfficeOutputName);

      // Apply LibreOffice PDF/A-1b export filter specification
      const filterSpec = 'pdf:writer_pdf_Export:{"SelectPdfVersion":{"type":"long","value":"1"}}';
      const cmd = `${LIBREOFFICE_CONFIG.binaryPath} --headless --convert-to '${filterSpec}' --outdir "${this.outputDir}" "${absoluteInputPath}"`;

      console.log(`[EXECUTION] Initializing PDF-to-PDFA archival conversion matrix: ${cmd}`);

      exec(cmd, { timeout: LIBREOFFICE_CONFIG.timeoutMs }, async (err, stdout, stderr) => {
        console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
        if (stderr) console.warn(`[LIBREOFFICE STDERR]:\n${stderr}`);

        // Purge staging upload file immediately after execution
        await safeUnlink(file.path);

        // Standard Case Validation Guard
        if (fs.existsSync(pdfaPath)) {
          scheduleCleanUp(pdfaPath, pdfaName);
          return resolve(pdfaName);
        } else if (fs.existsSync(defaultLibreOfficeOutputPath)) {
          fs.renameSync(defaultLibreOfficeOutputPath, pdfaPath);
          scheduleCleanUp(pdfaPath, pdfaName);
          return resolve(pdfaName);
        }

        // Advanced Recovery Loop: Detect truncated/misnamed output files in output directory
        try {
          const filesInDir = fs.readdirSync(this.outputDir);
          const nameFirstToken = fileBaseName.split(".")[0].toLowerCase();

          const misnamedFile = filesInDir.find(
            (f) => f.toLowerCase().endsWith(".pdf") && f.toLowerCase().startsWith(nameFirstToken)
          );

          if (misnamedFile) {
            const currentGeneratedPath = path.join(this.outputDir, misnamedFile);
            console.log(`[RECOVERY INTERCEPT] Truncated runtime format active: '${misnamedFile}'. Syncing names layout...`);

            fs.renameSync(currentGeneratedPath, pdfaPath);

            if (fs.existsSync(pdfaPath)) {
              scheduleCleanUp(pdfaPath, pdfaName);
              return resolve(pdfaName);
            }
          }
        } catch (scanErr) {
          console.error("Directory engine normalizer system check error:", scanErr);
        }

        if (err) {
          console.error(`[COMPILER ENGINE REJECTION EXCEPTION]:`, err);
          return reject(new Error(`PDF to PDF/A archival export aborted: ${err.message}`));
        }

        return reject(
          new Error("File conversion pipeline failed: Output mismatch or asset absent from storage layout.")
        );
      });
    });
  }
}

export default new PdfToPdfaService();