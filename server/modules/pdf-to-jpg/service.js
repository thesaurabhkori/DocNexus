import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { fromPath } from "pdf2pic";
import { safeUnlink, scheduleCleanUp } from "../../shared/utils/cleanup.util.js";

const parseSelectedPages = (pagesValue) => {
  if (Array.isArray(pagesValue)) {
    return pagesValue
      .map((page) => Number(page))
      .filter((page) => Number.isInteger(page) && page > 0);
  }

  if (typeof pagesValue === "string") {
    try {
      const parsed = JSON.parse(pagesValue);
      if (Array.isArray(parsed)) {
        return parsed
          .map((page) => Number(page))
          .filter((page) => Number.isInteger(page) && page > 0);
      }
    } catch (error) {
      return [];
    }
  }

  return [];
};

export const normalizePdfToJpgFormat = (formatValue) => {
  const normalized = String(formatValue || "jpg").trim().toLowerCase();

  if (normalized === "png") return "png";
  if (normalized === "jpeg") return "jpeg";
  return "jpg";
};

export const resolvePdfToJpgOutputName = (sourceName, formatValue, pages = [], actualImageCount = 0) => {
  const baseName = sourceName.includes(".") ? sourceName.slice(0, sourceName.lastIndexOf(".")) : sourceName;
  const selectedPages = parseSelectedPages(pages);

  if (selectedPages.length > 1 && actualImageCount > 1) {
    return `${baseName}.zip`;
  }

  const normalized = normalizePdfToJpgFormat(formatValue);
  return `${baseName}.${normalized === "png" ? "png" : normalized === "jpeg" ? "jpeg" : "jpg"}`;
};

class PdfToJpgService {
  constructor() {
    this.outputDir = path.join(process.cwd(), "converted");

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async convertPdfToJpg(files, bodyParams = {}) {
    if (!files || files.length === 0) {
      throw new Error("No PDF file provided for JPG conversion.");
    }

    const file = files[0];
    const sourcePath = path.resolve(file.path);
    const fileBaseName = path.basename(file.originalname || file.filename, path.extname(file.originalname || file.filename));
    const targetFormat = normalizePdfToJpgFormat(bodyParams.format || bodyParams.outputFormat || "jpg");
    const selectedPages = parseSelectedPages(bodyParams.pages);
    const pagesToConvert = selectedPages.length > 0 ? selectedPages : -1;
    const finalBaseName = fileBaseName;

    try {
      const convert = fromPath(sourcePath, {
        density: 180,
        saveFilename: finalBaseName,
        savePath: this.outputDir,
        format: targetFormat,
        width: 1600,
        height: 1600,
        preserveAspectRatio: true,
        quality: Number(bodyParams.quality || 90),
      });

      const result = await convert.bulk(pagesToConvert, { responseType: "image" });
      const generatedFiles = Array.isArray(result)
        ? result
            .filter((entry) => entry && entry.path)
            .sort((a, b) => (a.page ?? 0) - (b.page ?? 0))
        : result && result.path
          ? [result]
          : [];

      if (generatedFiles.length === 0) {
        throw new Error("PDF-to-image conversion produced no output files.");
      }

      const singleOutputName = resolvePdfToJpgOutputName(`${finalBaseName}.pdf`, targetFormat, selectedPages, 1);
      const singleOutputPath = path.join(this.outputDir, singleOutputName);

      if (generatedFiles.length === 1) {
        const singleImage = generatedFiles[0].path;
        const finalImagePath = path.join(this.outputDir, singleOutputName);
        if (singleImage !== finalImagePath && fs.existsSync(singleImage)) {
          fs.renameSync(singleImage, finalImagePath);
        }

        await safeUnlink(file.path);
        scheduleCleanUp(finalImagePath, singleOutputName);
        return singleOutputName;
      }

      const zipOutputName = resolvePdfToJpgOutputName(`${finalBaseName}.pdf`, targetFormat, selectedPages, generatedFiles.length);
      const zipOutputPath = path.join(this.outputDir, zipOutputName);
      const zipArchive = new AdmZip();

      generatedFiles.forEach((generatedFile) => {
        if (fs.existsSync(generatedFile.path)) {
          zipArchive.addLocalFile(generatedFile.path, "", path.basename(generatedFile.path));
        }
      });

      zipArchive.writeZip(zipOutputPath);

      generatedFiles.forEach((generatedFile) => {
        if (fs.existsSync(generatedFile.path)) {
          safeUnlink(generatedFile.path);
        }
      });

      await safeUnlink(file.path);
      scheduleCleanUp(zipOutputPath, zipOutputName);
      return zipOutputName;
    } catch (error) {
      console.error("pdf2pic conversion failed, falling back to LibreOffice:", error);

      const absoluteInputPath = path.resolve(file.path);
      return new Promise((resolve, reject) => {
        const outName = resolvePdfToJpgOutputName(file.originalname || file.filename, targetFormat, selectedPages, 0);
        const outPath = path.join(this.outputDir, outName);
        const defaultLibreOfficeOutputName = `${path.basename(file.path, path.extname(file.path))}.${targetFormat === "png" ? "png" : targetFormat === "jpeg" ? "jpeg" : "jpg"}`;
        const defaultLibreOfficeOutputPath = path.join(this.outputDir, defaultLibreOfficeOutputName);

        const commandArgs = [
          "--headless",
          "--convert-to",
          targetFormat,
          "--outdir",
          this.outputDir,
          absoluteInputPath,
        ];

        import("child_process").then(({ execFile }) => {
          execFile("C:\\Program Files\\LibreOffice\\program\\soffice.exe", commandArgs, { timeout: 60000 }, async (err, stdout, stderr) => {
            console.log(`[FALLBACK STDOUT]:\n${stdout}`);
            if (stderr) console.warn(`[FALLBACK STDERR]:\n${stderr}`);
            await safeUnlink(file.path);

            if (fs.existsSync(outPath)) {
              scheduleCleanUp(outPath, outName);
              return resolve(outName);
            }
            if (fs.existsSync(defaultLibreOfficeOutputPath)) {
              fs.renameSync(defaultLibreOfficeOutputPath, outPath);
              scheduleCleanUp(outPath, outName);
              return resolve(outName);
            }

            if (err) {
              return reject(new Error(`Raster output compilation failed: ${err.message}`));
            }

            return reject(new Error("File conversion pipeline failed: Output mismatch or asset absent from storage layout."));
          });
        }).catch((fallbackErr) => reject(fallbackErr));
      });
    }
  }
}

export default new PdfToJpgService();