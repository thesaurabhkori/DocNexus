import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const PAGE_SIZES = {
  A4: { width: 595.28, height: 841.89 },
  LETTER: { width: 612, height: 792 },
  LEGAL: { width: 612, height: 1008 }
};

const safeUnlink = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Error deleting file at ${filePath}:`, err);
    });
  }
};

export const createPdf = async (files, options = {}) => {
  const rawPageSize = options.pageSize || "A4 (210 x 297 mm)";
  const orientation = options.orientation || "Portrait";
  const rawMargins = options.margins || "Normal";
  const rawImageFit = options.imageFit || "Fit to page";
  const rawQuality = options.imageQuality || "High";
  const addCaption = options.addCaption === "true" || options.addCaption === true;

  let pageSizeKey = "A4";
  if (rawPageSize.toLowerCase().includes("original")) {
    pageSizeKey = "ORIGINAL";
  } else if (rawPageSize.toLowerCase().includes("letter")) {
    pageSizeKey = "LETTER";
  } else if (rawPageSize.toLowerCase().includes("legal")) {
    pageSizeKey = "LEGAL";
  }

  // 📐 STRICT POINT BASE MARGIN CONFIGURATION
  let margin = 36; // Normal = 12.7 mm
  if (rawMargins === "Small") margin = 18; // Small = 6.35 mm
  if (rawMargins === "None") margin = 0;

  let imageFit = "contain";
  if (rawImageFit === "Fill page") imageFit = "cover";

  let quality = 90;
  if (rawQuality === "Low") quality = 40;
  if (rawQuality === "Medium") quality = 70;

  const outputDir = path.join(process.cwd(), "converted");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputFileName = `PDF-${Date.now()}-${Math.floor(Math.random() * 1000)}.pdf`;
  const outputPath = path.join(outputDir, outputFileName);

  const doc = new PDFDocument({ autoFirstPage: false });
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  try {
    for (const file of files) {
      const sharpInstance = sharp(file.path);
      const metadata = await sharpInstance.metadata();

      // CHANGE 4: Preserving EXIF orientation and enabling Mozjpeg compression
      const imageBuffer = await sharpInstance
        .rotate()
        .jpeg({ quality: quality, force: true, mozjpeg: true })
        .toBuffer();

      let pageWidth;
      let pageHeight;

      // ⚡ UNIFIED PAGE DIMENSION LOGIC
      if (pageSizeKey === "ORIGINAL") {
        // Image points me screen base size extract karein
        const imgPtsWidth = (metadata.width * 72) / (metadata.density || 72);
        const imgPtsHeight = (metadata.height * 72) / (metadata.density || 72);
        
        // Page size ko image size + margin borders ke sath adjust karein
        pageWidth = imgPtsWidth + margin * 2;
        pageHeight = imgPtsHeight + margin * 2 + (addCaption ? 20 : 0);
      } else {
        const standardSize = PAGE_SIZES[pageSizeKey] || PAGE_SIZES.A4;
        if (orientation.toLowerCase() === "landscape") {
          pageWidth = standardSize.height;
          pageHeight = standardSize.width;
        } else {
          pageWidth = standardSize.width;
          pageHeight = standardSize.height;
        }
      }

      const captionHeightBuffer = addCaption ? 20 : 0;

      doc.addPage({
        size: [pageWidth, pageHeight],
        margin: margin
      });

      const printableWidth = pageWidth - margin * 2;
      const printableHeight = pageHeight - margin * 2 - captionHeightBuffer;

      let renderWidth = printableWidth;
      let renderHeight = printableHeight;
      let xPos = margin;
      let yPos = margin;

      // Original size ho ya standard size, bounding box fitting logic same rahega
      if (pageSizeKey === "ORIGINAL") {
        // CHANGE 1: DPI-based original size dynamic positioning extraction
        const imgPtsWidth = (metadata.width * 72) / (metadata.density || 72);
        const imgPtsHeight = (metadata.height * 72) / (metadata.density || 72);
        renderWidth = imgPtsWidth;
        renderHeight = imgPtsHeight;
      } else if (imageFit === "contain") {
        const srcRatio = metadata.width / metadata.height;

        // CHANGE 2 - Step 1: Always scale image using printableWidth first
        renderWidth = printableWidth;
        renderHeight = printableWidth / srcRatio;

        // CHANGE 2 - Step 2: Center vertically if it perfectly fits layout area safely
        if (renderHeight <= printableHeight) {
          yPos = margin + (printableHeight - renderHeight) / 2;
        } else {
          // CHANGE 2 - Step 3: Otherwise scale using printableHeight and center horizontally
          renderHeight = printableHeight;
          renderWidth = printableHeight * srcRatio;
          xPos = margin + (printableWidth - renderWidth) / 2;
        }
      } else if (imageFit === "cover") {
        const srcRatio = metadata.width / metadata.height;
        const destRatio = printableWidth / printableHeight;

        if (srcRatio > destRatio) {
          renderWidth = printableHeight * srcRatio;
          xPos = margin - (renderWidth - printableWidth) / 2;
        } else {
          renderHeight = printableWidth / srcRatio;
          yPos = margin - (renderHeight - printableHeight) / 2;
        }
      }

      // 🌟 STRICT CLIP CONTAINER
      doc.save();
      doc.rect(margin, margin, printableWidth, printableHeight).clip();

      // CHANGE 3: Always use dynamic render values instead of forcing full page stretch
      doc.image(imageBuffer, xPos, yPos, {
        width: renderWidth,
        height: renderHeight
      });

      doc.restore();

      if (addCaption && file.originalname) {
        doc.fontSize(10)
          .fillColor("#64748B")
          .text(
            file.originalname, 
            margin, 
            pageHeight - margin - 12, 
            { width: printableWidth, align: "center", lineBreak: false }
          );
      }
    }

    doc.end();

    return new Promise((resolve, reject) => {
      writeStream.on("finish", () => {
        setTimeout(() => {
          safeUnlink(outputPath);
          console.log(`Auto-Cleaned compiled file: ${outputFileName}`);
        }, 2 * 60 * 1000);

        resolve(outputFileName);
      });

      writeStream.on("error", (streamError) => {
        safeUnlink(outputPath);
        reject(streamError);
      });
    });

  } catch (processingError) {
    doc.destroy();
    writeStream.destroy();
    safeUnlink(outputPath);
    throw processingError;
  }
};