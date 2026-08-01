import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { LIBREOFFICE_CONFIG } from "../../config/libreoffice.config.js";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";

class PdfToJpgService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Converts a PDF document into JPG raster image maps.
   * @param {Array<Express.Multer.File>} files - Uploaded file array containing PDF document.
   * @param {Object} bodyParams - Options like format, dpi, quality.
   * @returns {Promise<string>} Generated output JPG file name.
   */
  async convertPdfToJpg(files, bodyParams = {}) {
    const file = files[0];
    const absoluteInputPath = path.resolve(file.path);
    const fileBaseName = path.basename(file.filename, path.extname(file.filename));

    return new Promise((resolve, reject) => {
      const outName = `${fileBaseName}.jpg`;
      const outPath = path.join(this.outputDir, outName);

      const defaultLibreOfficeOutputName = `${path.basename(file.path, path.extname(file.path))}.jpg`;
      const defaultLibreOfficeOutputPath = path.join(this.outputDir, defaultLibreOfficeOutputName);

      const cmd = `${LIBREOFFICE_CONFIG.binaryPath} --headless --convert-to jpg --outdir "${this.outputDir}" "${absoluteInputPath}"`;

      console.log(`[EXECUTION] Compiling PDF pages to JPG Raster Maps: ${cmd}`);

      exec(cmd, { timeout: LIBREOFFICE_CONFIG.timeoutMs }, async (err, stdout, stderr) => {
        console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
        if (stderr) console.warn(`[LIBREOFFICE STDERR]:\n${stderr}`);

        // Purge staging upload file immediately after execution
        await safeUnlink(file.path);

        // Standard Case Validation Guard
        if (fs.existsSync(outPath)) {
          scheduleCleanUp(outPath, outName);
          return resolve(outName);
        } else if (fs.existsSync(defaultLibreOfficeOutputPath)) {
          fs.renameSync(defaultLibreOfficeOutputPath, outPath);
          scheduleCleanUp(outPath, outName);
          return resolve(outName);
        }

        // Advanced Recovery Loop: Detect truncated/misnamed output files in output directory
        try {
          const filesInDir = fs.readdirSync(this.outputDir);
          const nameFirstToken = fileBaseName.split(".")[0].toLowerCase();

          const misnamedFile = filesInDir.find(
            (f) =>
              (f.toLowerCase().endsWith(".jpg") || f.toLowerCase().endsWith(".jpeg")) &&
              f.toLowerCase().startsWith(nameFirstToken)
          );

          if (misnamedFile) {
            const currentGeneratedPath = path.join(this.outputDir, misnamedFile);
            console.log(`[RECOVERY INTERCEPT] Truncated runtime format active: '${misnamedFile}'. Syncing names layout...`);

            fs.renameSync(currentGeneratedPath, outPath);

            if (fs.existsSync(outPath)) {
              scheduleCleanUp(outPath, outName);
              return resolve(outName);
            }
          }
        } catch (scanErr) {
          console.error("Directory engine normalizer system check error:", scanErr);
        }

        if (err) {
          return reject(new Error(`Raster output compilation failed: ${err.message}`));
        }

        return reject(
          new Error("File conversion pipeline failed: Output mismatch or asset absent from storage layout.")
        );
      });
    });
  }
}

export default new PdfToJpgService();