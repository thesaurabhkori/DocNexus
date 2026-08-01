import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { LIBREOFFICE_CONFIG } from "../../config/libreoffice.config.js";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";

class CompressPdfService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Compresses a PDF file using LibreOffice headless CLI execution.
   * @param {Array<Express.Multer.File>} files - Uploaded PDF file array.
   * @returns {Promise<string>} Generated output PDF file name.
   */
  async compressPdf(files) {
    const file = files[0];
    const absoluteInputPath = path.resolve(file.path);

    return new Promise((resolve, reject) => {
      const outName = `Compressed-${Date.now()}.pdf`;
      const outPath = path.join(this.outputDir, outName);

      // LibreOffice generates file in outputDir with original filename
      const defaultLibreOfficeOutputName = path.basename(file.path, path.extname(file.path)) + ".pdf";
      const defaultLibreOfficeOutputPath = path.join(this.outputDir, defaultLibreOfficeOutputName);

      const cmd = `${LIBREOFFICE_CONFIG.binaryPath} --headless --convert-to pdf --outdir "${this.outputDir}" "${absoluteInputPath}"`;

      console.log(`[EXECUTION] Initializing size down compression matrix: ${cmd}`);

      exec(cmd, { timeout: LIBREOFFICE_CONFIG.timeoutMs }, async (err, stdout, stderr) => {
        console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
        if (stderr) console.error(`[LIBREOFFICE STDERR]:\n${stderr}`);

        // Purge staging upload file immediately after execution
        await safeUnlink(file.path);

        // Check if generated file exists under default output name or outPath
        let generatedFilePath = null;
        if (fs.existsSync(outPath)) {
          generatedFilePath = outPath;
        } else if (fs.existsSync(defaultLibreOfficeOutputPath)) {
          fs.renameSync(defaultLibreOfficeOutputPath, outPath);
          generatedFilePath = outPath;
        }

        if (generatedFilePath && fs.existsSync(generatedFilePath)) {
          scheduleCleanUp(outPath, outName);
          return resolve(outName);
        }

        if (err) {
          return reject(new Error(`PDF Compression algorithm pipeline engine failure: ${err.message}`));
        }

        return reject(new Error("File conversion pipeline failed: Output mismatch."));
      });
    });
  }
}

export default new CompressPdfService();