import express from "express";
import path from "path";
import fs from "fs";
import {
  helmetMiddleware,
  corsMiddleware,
  compressionMiddleware,
  rateLimiter,
  hppMiddleware,
} from "./config/security.config.js";

import loggerMiddleware from "./middlewares/logger.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// Trust reverse proxy (Nginx, Cloudflare, Render, Vercel)
app.set("trust proxy", 1);

// ==========================================
// 1. EARLY SECURITY LAYER (Rate Limiter & Dynamic CORS)
// ==========================================
app.use(rateLimiter);
app.use(corsMiddleware);

// ==========================================
// 2. HTTP HEADER SECURITY (HELMET)
// ==========================================
app.use(helmetMiddleware);

// ==========================================
// 3. LOGGER MIDDLEWARE
// ==========================================
app.use(loggerMiddleware);

// ==========================================
// 4. BODY PARSERS
// ==========================================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ==========================================
// 5. HTTP PARAMETER POLLUTION (HPP)
// ==========================================
app.use(hppMiddleware);

// ==========================================
// 6. RESPONSE COMPRESSION
// ==========================================
app.use(compressionMiddleware);

// ==========================================
// 7. SERVE CONVERTED FILES (STATIC FILES)
// ==========================================
const convertedDir = path.join(process.cwd(), "converted");

// Folder ki availability ensure karein taaki crashes na hon
if (!fs.existsSync(convertedDir)) {
  fs.mkdirSync(convertedDir, { recursive: true });
}

app.use(
  "/converted",
  express.static(convertedDir, {
    dotfiles: "ignore",
    index: false,
  })
);

// ==========================================
// 8. MASTER MODULE AUTO-LOADER
// ==========================================
const ALL_TOOLS = [
  "image-to-pdf",
  "word-to-pdf",
  "excel-to-pdf",
  "powerpoint-to-pdf",
  "html-to-pdf",
  "pdf-to-word",
  "pdf-to-excel",
  "pdf-to-ppt",
  "pdf-to-jpg",
  "pdf-to-pdfa",
  "merge-pdf",
  "split-pdf",
  "extract-pages",
  "remove-pages",
  "rotate-pdf",
  "compress-pdf",
  "crop-pdf",
  "protect-pdf",
  "unlock-pdf",
  "watermark-pdf",
  "sign-pdf",
];

const modulesDirPath = path.join(process.cwd(), "modules");

for (const toolSlug of ALL_TOOLS) {
  const routeFilePath = path.join(modulesDirPath, toolSlug, "route.js");

  if (fs.existsSync(routeFilePath)) {
    try {
      const moduleRoute = await import(`./modules/${toolSlug}/route.js`);

      // Main API Route
      app.use(`/api/${toolSlug}`, moduleRoute.default);

      // Legacy Route Support (e.g., /api/imagetopdf)
      const legacySlug = toolSlug.replace(/-/g, "");
      if (legacySlug !== toolSlug) {
        app.use(`/api/${legacySlug}`, moduleRoute.default);
      }

      console.log(`✅ Loaded Module : ${toolSlug}`);
    } catch (error) {
      console.error(`❌ Module '${toolSlug}' loading fail hua:`, error.message);
    }
  } else {
    // Handling non-migrated / under maintenance endpoints
    const unmigratedHandler = (req, res) => {
      return res.status(501).json({
        success: false,
        message: `'${toolSlug}' module filhaal maintenance me hai ya migrate nahi hua hai.`,
      });
    };

    app.use(`/api/${toolSlug}`, unmigratedHandler);
    app.use(`/api/${toolSlug.replace(/-/g, "")}`, unmigratedHandler);
  }
}

// ==========================================
// 9. HEALTH CHECK ROUTE
// ==========================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    status: "online",
    engine: "DocNexus Backend Engine",
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 10. GLOBAL 404 HANDLER FOR UNMATCHED ROUTES
// ==========================================
app.all("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route '${req.originalUrl}' nahi mila.`,
  });
});

// ==========================================
// 11. GLOBAL ERROR HANDLING MIDDLEWARE
// ==========================================
app.use(errorMiddleware);

export default app;