import multer from "multer";
import path from "path";
import fs from "fs";

// ⚡ Ensure 'uploads' directory exists safely at runtime
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExt = path.extname(file.originalname);
        // 🚀 FIXED: Original file name ko preserve rakha taaki tools.service.js baseName perfectly catch kar sake
        const cleanBaseName = path.basename(file.originalname, fileExt).replace(/[^a-zA-Z0-9]/g, "_");

        cb(null, `${cleanBaseName}-${uniqueSuffix}${fileExt}`);
    }
});

// 🔄 All Tools Enabled File Filter
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        // 🖼️ Images
        "image/jpeg",
        "image/jpg",
        "image/png",
        
        // 📄 PDFs
        "application/pdf",
        
        // 📝 Word Documents (.doc & .docx)
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        
        // 📊 Excel Sheets (.xls & .xlsx)
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        
        // 📉 PowerPoint Presentations (.ppt & .pptx)
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        
        // 🌐 HTML Documents
        "text/html",
        "application/xhtml+xml"
    ];

    // Agar standard image format ho ya humare specified extensions list me ho toh allow karein
    if (file.mimetype.startsWith("image/") || allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        // Validation boundary smooth rakhne ke liye error block trigger hoga
        cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limits mapping to match Frontend controls
    }
});

export default upload;