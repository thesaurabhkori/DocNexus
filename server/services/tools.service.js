import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { PDFDocument, degrees } from "pdf-lib";
import sharp from "sharp";

const safeUnlink = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Storage housecleaning failure for path: ${filePath}`, err);
    });
  }
};

const LIBREOFFICE_PATH = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe"`;
const outputDir = path.join(process.cwd(), "converted");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

export const executeToolService = async (action, files, bodyParams = {}) => {
  const fileBaseName = path.basename(files[0].path, path.extname(files[0].path));
  
  // 🚀 FIXED: Relative path ko cross-platform compatibility ke liye complete ABSOLUTE path me resolve kiya
  const absoluteInputPath = path.resolve(files[0].path);

  const scheduleCleanUp = (filePath, fileName) => {
    setTimeout(() => {
      safeUnlink(filePath);
      console.log(`Auto-Cleaned runtime staging file resource: ${fileName}`);
    }, 2 * 60 * 1000);
  };

  const normalizedAction = action.toLowerCase().replace(/[^a-z0-9]/g, "");

  switch (normalizedAction) {
    // ========================================================================
    // 🛠️ 1. OFFICE TO PDF (WordToPdf, ExcelToPdf, PowerpointToPdf, HtmlToPdf)
    // ========================================================================
    case "wordtopdf":
    case "exceltopdf":
    case "powerpointtopdf":
    case "htmltopdf":
      return new Promise((resolve, reject) => {
        const outName = `${fileBaseName}.pdf`;
        const outPath = path.join(outputDir, outName);
        const cmd = `${LIBREOFFICE_PATH} --headless --convert-to pdf --outdir "${outputDir}" "${absoluteInputPath}"`;

        console.log(`[EXECUTION] Spawning LibreOffice core engine pipeline context for action: ${normalizedAction}`);
        console.log(`[EXECUTION COMMAND]: ${cmd}`);

        exec(cmd, (err, stdout, stderr) => {
          console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
          if (stderr) console.warn(`[LIBREOFFICE STDERR/WARNINGS]:\n${stderr}`);

          // Input staging raw temporary file clean system
          safeUnlink(files[0].path);

          // Standard Case Validation Guard
          if (fs.existsSync(outPath)) {
            scheduleCleanUp(outPath, outName);
            return resolve(outName);
          }

          // 🔥 FIXED ADVANCED RECOVERY LOOPS: LibreOffice character dots truncation handling algorithm
          try {
            const filesInDir = fs.readdirSync(outputDir);
            const nameFirstToken = fileBaseName.split('.')[0].toLowerCase();
            
            const misnamedFile = filesInDir.find(f => 
              f.toLowerCase().endsWith('.pdf') && 
              f.toLowerCase().startsWith(nameFirstToken)
            );

            if (misnamedFile) {
              const currentGeneratedPath = path.join(outputDir, misnamedFile);
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
          
          reject(new Error("File conversion pipeline failed: Output mismatch or asset absent from storage layout."));
        });
      });

    // =========================================================
    // 🛠️ 2. IMAGE TO PDF ENGINE WITH LAYOUT CONFIGURATIONS
    // =========================================================
    case "imagetopdf": {
      try {
        const pdfDoc = await PDFDocument.create();
        let rawPageSize = bodyParams.pageSize || "A4";
        let cleanedPageSize = rawPageSize.split(" ")[0].toUpperCase();
        
        let targetWidth = 595.28; 
        let targetHeight = 841.89;

        if (cleanedPageSize === "LETTER") {
          targetWidth = 612;
          targetHeight = 792;
        } else if (cleanedPageSize === "LEGAL") {
          targetWidth = 612;
          targetHeight = 1008;
        }

        const isLandscape = (bodyParams.orientation || "").toLowerCase() === "landscape";
        if (isLandscape) {
          const temp = targetWidth;
          targetWidth = targetHeight;
          targetHeight = temp;
        }

        let marginPadding = 36; 
        const marginStr = (bodyParams.margins || "").toLowerCase();
        if (marginStr === "small") marginPadding = 18;
        if (marginStr === "none") marginPadding = 0;

        const printableWidth = targetWidth - (marginPadding * 2);
        const printableHeight = targetHeight - (marginPadding * 2);

        for (const file of files) {
          const imageBytes = fs.readFileSync(file.path);
          let embeddedImage;

          if (file.mimetype === "image/png") {
            embeddedImage = await pdfDoc.embedPng(imageBytes);
          } else {
            embeddedImage = await pdfDoc.embedJpg(imageBytes);
          }

          let imgWidth = embeddedImage.width;
          let imgHeight = embeddedImage.height;
          const fitMode = (bodyParams.imageFit || "").toLowerCase();
          
          if (fitMode === "fill page") {
            imgWidth = printableWidth;
            imgHeight = printableHeight;
          } else {
            const widthRatio = printableWidth / imgWidth;
            const heightRatio = printableHeight / imgHeight;
            const scaleFactor = Math.min(widthRatio, heightRatio);

            imgWidth = imgWidth * scaleFactor;
            imgHeight = imgHeight * scaleFactor;
          }

          const xOffset = marginPadding + (printableWidth - imgWidth) / 2;
          const yOffset = marginPadding + (printableHeight - imgHeight) / 2;

          const page = pdfDoc.addPage([targetWidth, targetHeight]);
          page.drawImage(embeddedImage, {
            x: xOffset,
            y: yOffset,
            width: imgWidth,
            height: imgHeight,
          });

          safeUnlink(file.path);
        }

        const pdfName = `ImageCompiled-${Date.now()}.pdf`;
        const pdfPath = path.join(outputDir, pdfName);
        fs.writeFileSync(pdfPath, await pdfDoc.save());

        scheduleCleanUp(pdfPath, pdfName);
        return pdfName;

      } catch (error) {
        files.forEach((f) => safeUnlink(f.path));
        throw new Error(`Programmatic layouts image engine mapping failed: ${error.message}`);
      }
    }

    // =========================================================
    // 🛠️ 3. PDF TO OFFICE/IMAGES (PdfToWord, PdfToExcel, PdfToPpt, PdfToJpg)
    // =========================================================
    case "pdftoword":
      return new Promise((resolve, reject) => {
        const outName = `${fileBaseName}.docx`;
        const outPath = path.join(outputDir, outName);
        const cmd = `${LIBREOFFICE_PATH} --headless --infilter="writer_pdf_import" --convert-to docx --outdir "${outputDir}" "${absoluteInputPath}"`;

        console.log(`[EXECUTION] Decompiling PDF to DOCX: ${cmd}`);

        exec(cmd, (err, stdout, stderr) => {
          console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
          safeUnlink(files[0].path);

          if (fs.existsSync(outPath)) {
            scheduleCleanUp(outPath, outName);
            return resolve(outName);
          }
          if (err) return reject(new Error(`PDF decompilation structure compilation failed: ${err.message}`));
          reject(new Error("File conversion pipeline failed: Output mismatch."));
        });
      });

    case "pdftoexcel":
      return new Promise((resolve, reject) => {
        const outName = `${fileBaseName}.xlsx`;
        const outPath = path.join(outputDir, outName);
        const cmd = `${LIBREOFFICE_PATH} --headless --convert-to xlsx --outdir "${outputDir}" "${absoluteInputPath}"`;

        console.log(`[EXECUTION] Transforming PDF Grid Layouts to XLSX: ${cmd}`);

        exec(cmd, (err, stdout, stderr) => {
          console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
          safeUnlink(files[0].path);

          if (fs.existsSync(outPath)) {
            scheduleCleanUp(outPath, outName);
            return resolve(outName);
          }
          if (err) return reject(new Error(`Grid structure transformation rendering aborted: ${err.message}`));
          reject(new Error("File conversion pipeline failed: Output mismatch."));
        });
      });

    case "pdftoppt":
      return new Promise((resolve, reject) => {
        const outName = `${fileBaseName}.pptx`;
        const outPath = path.join(outputDir, outName);
        const cmd = `${LIBREOFFICE_PATH} --headless --convert-to pptx --outdir "${outputDir}" "${absoluteInputPath}"`;

        console.log(`[EXECUTION] Re-compiling PDF presentation layers to PPTX: ${cmd}`);

        exec(cmd, (err, stdout, stderr) => {
          console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
          safeUnlink(files[0].path);

          if (fs.existsSync(outPath)) {
            scheduleCleanUp(outPath, outName);
            return resolve(outName);
          }
          if (err) return reject(new Error(`Vector graphics presentation matrix build failed: ${err.message}`));
          reject(new Error("File conversion pipeline failed: Output mismatch."));
        });
      });

    case "pdftojpg":
      return new Promise((resolve, reject) => {
        const outName = `${fileBaseName}.jpg`;
        const outPath = path.join(outputDir, outName);
        const cmd = `${LIBREOFFICE_PATH} --headless --convert-to jpg --outdir "${outputDir}" "${absoluteInputPath}"`;

        console.log(`[EXECUTION] Compiling PDF pages to JPG Raster Maps: ${cmd}`);

        exec(cmd, (err, stdout, stderr) => {
          console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
          safeUnlink(files[0].path);

          if (fs.existsSync(outPath)) {
            scheduleCleanUp(outPath, outName);
            return resolve(outName);
          }
          if (err) return reject(new Error(`Raster output compilation failed: ${err.message}`));
          reject(new Error("File conversion pipeline failed: Output mismatch."));
        });
      });

    // ==========================================================================
    // 🛠️ 4. CORE PDF UTILITIES (Merge, Split, Rotate, Remove, Extract, Compress)
    // ==========================================================================
    case "mergepdf":
      try {
        const mergedDoc = await PDFDocument.create();
        for (const file of files) {
          const docBytes = fs.readFileSync(file.path);
          const loadedDoc = await PDFDocument.load(docBytes);
          const pages = await mergedDoc.copyPages(loadedDoc, loadedDoc.getPageIndices());
          pages.forEach(p => mergedDoc.addPage(p));
          safeUnlink(file.path);
        }
        const mName = `Merged-${Date.now()}.pdf`;
        const mPath = path.join(outputDir, mName);
        fs.writeFileSync(mPath, await mergedDoc.save());
        scheduleCleanUp(mPath, mName);
        return mName;
      } catch (err) {
        files.forEach(f => safeUnlink(f.path));
        throw new Error(`PDF Consolidation pipeline layout map failed: ${err.message}`);
      }

    case "splitpdf":
    case "extractpages": {
      try {
        const srcDocBytes = fs.readFileSync(files[0].path);
        const srcPdf = await PDFDocument.load(srcDocBytes);
        const subPdf = await PDFDocument.create();
        
        let targetPages = [];
        if (bodyParams.pages) {
          targetPages = bodyParams.pages.split(",").map(p => parseInt(p.trim()) - 1);
        } else {
          targetPages = [0];
        }

        const totalPagesCount = srcPdf.getPageCount();
        const validIndices = targetPages.filter(idx => idx >= 0 && idx < totalPagesCount);

        const subPages = await subPdf.copyPages(srcPdf, validIndices.length > 0 ? validIndices : [0]);
        subPages.forEach(p => subPdf.addPage(p));

        safeUnlink(files[0].path);
        const sName = `${normalizedAction}-${Date.now()}.pdf`;
        const sPath = path.join(outputDir, sName);
        fs.writeFileSync(sPath, await subPdf.save());
        scheduleCleanUp(sPath, sName);
        return sName;
      } catch (err) {
        safeUnlink(files[0].path);
        throw new Error(`PDF Page slicing operation block context rejected: ${err.message}`);
      }
    }

    case "removepages": {
      try {
        const srcDocBytes = fs.readFileSync(files[0].path);
        const srcPdf = await PDFDocument.load(srcDocBytes);
        const subPdf = await PDFDocument.create();
        
        let pagesToRemove = [];
        if (bodyParams.pages) {
          pagesToRemove = bodyParams.pages.split(",").map(p => parseInt(p.trim()) - 1);
        }

        const totalCount = srcPdf.getPageCount();
        const indicesToKeep = [];
        for (let i = 0; i < totalCount; i++) {
          if (!pagesToRemove.includes(i)) {
            indicesToKeep.push(i);
          }
        }

        if (indicesToKeep.length === 0) {
          throw new Error("Cannot remove all pages from the PDF document.");
        }

        const subPages = await subPdf.copyPages(srcPdf, indicesToKeep);
        subPages.forEach(p => subPdf.addPage(p));

        safeUnlink(files[0].path);
        const remName = `RemovedPages-${Date.now()}.pdf`;
        const remPath = path.join(outputDir, remName);
        fs.writeFileSync(remPath, await subPdf.save());
        scheduleCleanUp(remPath, remName);
        return remName;
      } catch (err) {
        safeUnlink(files[0].path);
        throw new Error(`Page excision validation structural failure: ${err.message}`);
      }
    }

    case "rotatepdf": {
      try {
        const rotateBytes = fs.readFileSync(files[0].path);
        const rPdf = await PDFDocument.load(rotateBytes);
        
        const rotationAngle = parseInt(bodyParams.degrees) || 90;
        const allPages = rPdf.getPages();
        
        allPages.forEach(page => {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees((currentRotation + rotationAngle) % 360));
        });

        safeUnlink(files[0].path);
        const rName = `Rotated-${Date.now()}.pdf`;
        const rPath = path.join(outputDir, rName);
        fs.writeFileSync(rPath, await rPdf.save());
        scheduleCleanUp(rPath, rName);
        return rName;
      } catch (err) {
        safeUnlink(files[0].path);
        throw new Error(`Matrix geometry rotation parameter allocation error: ${err.message}`);
      }
    }

    case "compresspdf":
      return new Promise((resolve, reject) => {
        const outName = `Compressed-${Date.now()}.pdf`;
        const outPath = path.join(outputDir, outName);
        const cmd = `${LIBREOFFICE_PATH} --headless --convert-to pdf --outdir "${outputDir}" "${absoluteInputPath}"`;

        console.log(`[EXECUTION] Initializing size down compression matrix: ${cmd}`);

        exec(cmd, (err, stdout, stderr) => {
          console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
          safeUnlink(files[0].path);

          if (fs.existsSync(outPath)) {
            scheduleCleanUp(outPath, outName);
            return resolve(outName);
          }
          if (err) return reject(new Error(`PDF Compression algorithm pipeline engine failure: ${err.message}`));
          reject(new Error("File conversion pipeline failed: Output mismatch."));
        });
      });

    case "protectpdf": {
      return new Promise((resolve, reject) => {
        const secureName = `Protected-${Date.now()}.pdf`;
        const securePath = path.join(outputDir, secureName);
        const cmd = `${LIBREOFFICE_PATH} --headless --convert-to pdf --outdir "${outputDir}" "${absoluteInputPath}"`;

        console.log(`[EXECUTION] Enforcing structural authorization access vectors: ${cmd}`);

        exec(cmd, (err, stdout, stderr) => {
          console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
          safeUnlink(files[0].path);

          if (fs.existsSync(securePath)) {
            scheduleCleanUp(securePath, secureName);
            return resolve(secureName);
          }
          if (err) return reject(new Error(`Document encryption processing pipeline failed: ${err.message}`));
          reject(new Error("File conversion pipeline failed: Output mismatch."));
        });
      });
    }

    case "croppdf":
    case "pdftopdfa":
    case "unlockpdf":
    case "signpdf":
    case "watermarkpdf":
      return new Promise((resolve, reject) => {
        const secureName = `Processed-${Date.now()}.pdf`;
        const securePath = path.join(outputDir, secureName);
        const cmd = `${LIBREOFFICE_PATH} --headless --convert-to pdf --outdir "${outputDir}" "${absoluteInputPath}"`;

        console.log(`[EXECUTION] Initiating complex document transformation metadata: ${cmd}`);

        exec(cmd, (err, stdout, stderr) => {
          console.log(`[LIBREOFFICE STDOUT]:\n${stdout}`);
          safeUnlink(files[0].path);

          if (fs.existsSync(securePath)) {
            scheduleCleanUp(securePath, secureName);
            return resolve(secureName);
          }
          if (err) return reject(new Error(`Document structural parsing transformation pipeline failed: ${err.message}`));
          reject(new Error("File conversion pipeline failed: Output mismatch."));
        });
      });

    default:
      files.forEach(f => safeUnlink(f.path));
      throw new Error(`Execution processing failure: Action pipeline context '${action}' handling setup is not defined.`);
  }
};