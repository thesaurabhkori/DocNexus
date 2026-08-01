import express from "express";
import path from "path";
import fs from "fs";

// Centralized Config & Security Imports
import { security, envConfig, logger } from "./config/index.js";
import { outputManager } from "./managers/index.js";

// Middlewares
import loggerMiddleware from "./middlewares/logger.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

// Monitoring Router
import healthRouter from "./monitoring/health.route.js";

// Job Status Polling Router (Worker Thread Architecture)
import jobRouter from "./routes/job.route.js";

const app = express();

// Trust reverse proxy (Nginx, Cloudflare, Render, Vercel)
app.set("trust proxy", 1);

// ==========================================
// 1. HEALTH CHECK & MONITORING ENDPOINTS
// (Mounted early so load balancers / monitoring tools can access without rate limiting)
// ==========================================
app.use("/", healthRouter);

// ==========================================
// 2. EARLY SECURITY LAYER (Rate Limiter & Dynamic CORS)
// ==========================================
app.use(security.rateLimiter);
app.use(security.corsMiddleware);

// ==========================================
// 3. HTTP HEADER SECURITY (HELMET)
// ==========================================
app.use(security.helmetMiddleware);

// ==========================================
// 4. LOGGER MIDDLEWARE
// ==========================================
app.use(loggerMiddleware);

// ==========================================
// 5. BODY PARSERS
// ==========================================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ==========================================
// 6. HTTP PARAMETER POLLUTION (HPP)
// ==========================================
app.use(security.hppMiddleware);

// ==========================================
// 7. RESPONSE COMPRESSION
// ==========================================
app.use(security.compressionMiddleware);

// ==========================================
// 8. SERVE CONVERTED FILES (STATIC FILES)
// ==========================================
const convertedDir = outputManager.convertedDir || path.join(process.cwd(), "converted");

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
// 9. JOB QUEUE POLLING ROUTE
// ==========================================
app.use("/api/jobs", jobRouter);

// ==========================================
// 10. MASTER MODULE AUTO-LOADER
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

      logger.info(`✅ Loaded Module : ${toolSlug}`);
    } catch (error) {
      logger.error(`❌ Module '${toolSlug}' loading fail hua: ${error.message}`);
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
// 11. ROOT HEARTBEAT ROUTE
// ==========================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    status: "online",
    engine: "DocNexus Backend Engine",
    environment: envConfig.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 12. GLOBAL 404 HANDLER FOR UNMATCHED ROUTES
// ==========================================
app.all("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route '${req.originalUrl}' nahi mila.`,
  });
});

// ==========================================
// 13. GLOBAL ERROR HANDLING MIDDLEWARE
// ==========================================
app.use(errorMiddleware);

export default app;