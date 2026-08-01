import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { LIBREOFFICE_CONFIG } from "../../config/libreoffice.config.js";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";

class HtmlToPdfService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Converts an HTML file (.html / .htm) to PDF using LibreOffice CLI.
   * @param {Array<Express.Multer.File>} files - Uploaded file array containing HTML document.
   * @returns {Promise<string>} Generated output PDF file name.
   */
  async convertHtmlToPdf(files) {
    const file = files[0];
    const absoluteInputPath = path.resolve(file.path);
    const fileBaseName = path.basename(file.filename, path.extname(file.filename));

    return new Promise((resolve, reject) => {
      const outName = `${fileBaseName}.pdf`;
      const outPath = path.join(this.outputDir, outName);
      const cmd = `${LIBREOFFICE_CONFIG.binaryPath} --headless --convert-to pdf --outdir "${this.outputDir}" "${absoluteInputPath}"`;

      console.log(`[EXECUTION] Spawning LibreOffice core engine pipeline context for action: htmltopdf`);
      console.log(`[EXECUTION COMMAND]: ${cmd}`);

      exec(cmd, { timeout: LIBREOFFICE_CONFIG.timeoutMs }, async (err, stdout, stderr) => {
        console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
        if (stderr) console.warn(`[LIBREOFFICE STDERR/WARNINGS]:\n${stderr}`);

        // Input staging raw temporary file clean system
        await safeUnlink(file.path);

        // Standard Case Validation Guard
        if (fs.existsSync(outPath)) {
          scheduleCleanUp(outPath, outName);
          return resolve(outName);
        }

        // ADVANCED RECOVERY LOOPS: LibreOffice character dots truncation handling algorithm
        try {
          const filesInDir = fs.readdirSync(this.outputDir);
          const nameFirstToken = fileBaseName.split(".")[0].toLowerCase();

          const misnamedFile = filesInDir.find(
            (f) => f.toLowerCase().endsWith(".pdf") && f.toLowerCase().startsWith(nameFirstToken)
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
          console.error(`[COMPILER ENGINE REJECTION EXCEPTION]:`, err);
          return reject(new Error(`Office layout parsing aborted: ${err.message}`));
        }

        return reject(
          new Error("File conversion pipeline failed: Output mismatch or asset absent from storage layout.")
        );
      });
    });
  }
}

export default new HtmlToPdfService();