import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import hpp from "hpp";

/**
 * 1. HELMET MIDDLEWARE
 * Secures HTTP headers to defend against XSS, clickjacking, MIME-sniffing, etc.
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

/**
 * 2. CORS MIDDLEWARE
 * Restricts Cross-Origin Requests to allowed client domains.
 */
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000", "http://localhost:5173"];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow server-to-server or non-browser requests (e.g., Postman, Curl) with no origin
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(
      new Error(`CORS policy violation: Access denied for origin '${origin}'.`)
    );
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Disposition"],
  credentials: true,
  maxAge: 86400, // Cache preflight checks for 24 hours
});

/**
 * 3. COMPRESSION MIDDLEWARE
 * Compresses HTTP response bodies (Gzip/Brotli) to improve latency and reduce payload size.
 */
export const compressionMiddleware = compression({
  level: 6, // Optimal balance between compression ratio and CPU usage
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) {
      return false;
    }
    return compression.filter(req, res);
  },
});

/**
 * 4. RATE LIMITER MIDDLEWARE
 * Mitigates Brute-Force and DDoS attacks by capping requests per client IP.
 */
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  },
});

/**
 * 5. HPP MIDDLEWARE
 * Protects against HTTP Parameter Pollution by converting duplicate query keys to clean single values.
 */
export const hppMiddleware = hpp({
  // Whitelist specific query parameters that are allowed to have multiple values (e.g., arrays)
  whitelist: ["files", "page", "limit", "sort", "filter"],
});