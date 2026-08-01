import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { LIBREOFFICE_CONFIG } from "../../config/libreoffice.config.js";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";

class WordToPdfService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Converts a Word document (.doc / .docx) to PDF using LibreOffice headless CLI.
   * @param {Array<Express.Multer.File>} files - Uploaded file array containing Word document.
   * @returns {Promise<string>} Generated output PDF file name.
   */
  async convertWordToPdf(files) {
    const file = files[0];
    const absoluteInputPath = path.resolve(file.path);

    return new Promise((resolve, reject) => {
      const wName = `WordConverted-${Date.now()}.pdf`;
      const wPath = path.join(this.outputDir, wName);

      // LibreOffice generates file in outputDir with original filename stem + .pdf
      const defaultLibreOfficeOutputName = path.basename(file.path, path.extname(file.path)) + ".pdf";
      const defaultLibreOfficeOutputPath = path.join(this.outputDir, defaultLibreOfficeOutputName);

      const cmd = `${LIBREOFFICE_CONFIG.binaryPath} --headless --convert-to pdf --outdir "${this.outputDir}" "${absoluteInputPath}"`;

      console.log(`[EXECUTION] Initializing Word-to-PDF conversion matrix: ${cmd}`);

      exec(cmd, { timeout: LIBREOFFICE_CONFIG.timeoutMs }, async (err, stdout, stderr) => {
        console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
        if (stderr) console.error(`[LIBREOFFICE STDERR]:\n${stderr}`);

        // Purge staging upload file immediately after execution
        await safeUnlink(file.path);

        // Check if generated file exists under default output name or wPath
        let generatedFilePath = null;
        if (fs.existsSync(wPath)) {
          generatedFilePath = wPath;
        } else if (fs.existsSync(defaultLibreOfficeOutputPath)) {
          fs.renameSync(defaultLibreOfficeOutputPath, wPath);
          generatedFilePath = wPath;
        }

        if (generatedFilePath && fs.existsSync(generatedFilePath)) {
          scheduleCleanUp(wPath, wName);
          return resolve(wName);
        }

        if (err) {
          return reject(new Error(`Word to PDF conversion engine failure: ${err.message}`));
        }

        return reject(new Error("File conversion pipeline failed: Output mismatch."));
      });
    });
  }
}

export default new WordToPdfService();