import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.resolve(serverRoot, "..", ".env") });

/**
 * Validates required environment variables and builds a typed, frozen configuration object.
 */
const validateAndLoadEnv = () => {
  const errors = [];

  const defaults = {
    PORT: "5000",
    NODE_ENV: "development",
    LIBREOFFICE_PATH:
    process.env.LIBREOFFICE_PATH ||
    "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
    MAX_FILE_SIZE: String(100 * 1024 * 1024),
    UPLOAD_DIR: "uploads",
    CONVERTED_DIR: "converted",
    TEMP_DIR: "temp",
    LOG_LEVEL: "info",
  };

  for (const [key, value] of Object.entries(defaults)) {
    process.env[key] ||= value;
  }

  const requiredVars = Object.keys(defaults);

  // Verify presence of required variables
  for (const envVar of requiredVars) {
    if (!process.env[envVar] || process.env[envVar].trim() === "") {
      errors.push(`Missing required environment variable: [${envVar}]`);
    }
  }

  // Type & Value Validations
  const port = parseInt(process.env.PORT, 10);
  if (isNaN(port) || port <= 0 || port > 65535) {
    errors.push(`Invalid environment variable [PORT]: Must be a valid port number (1-65535). Got '${process.env.PORT}'`);
  }

  const validEnvs = ["development", "production", "test"];
  if (process.env.NODE_ENV && !validEnvs.includes(process.env.NODE_ENV.toLowerCase())) {
    errors.push(`Invalid environment variable [NODE_ENV]: Must be one of [${validEnvs.join(", ")}]. Got '${process.env.NODE_ENV}'`);
  }

  const maxFileSize = parseInt(process.env.MAX_FILE_SIZE, 10);
  if (isNaN(maxFileSize) || maxFileSize <= 0) {
    errors.push(`Invalid environment variable [MAX_FILE_SIZE]: Must be a positive number in bytes. Got '${process.env.MAX_FILE_SIZE}'`);
  }

  const validLogLevels = ["error", "warn", "info", "http", "verbose", "debug", "silly"];
  if (process.env.LOG_LEVEL && !validLogLevels.includes(process.env.LOG_LEVEL.toLowerCase())) {
    errors.push(`Invalid environment variable [LOG_LEVEL]: Must be one of [${validLogLevels.join(", ")}]. Got '${process.env.LOG_LEVEL}'`);
  }

  // Fail fast if validation errors exist
  if (errors.length > 0) {
    console.error("\n==================================================");
    console.error(" ❌ CRITICAL ENVIRONMENT CONFIGURATION ERROR(S)");
    console.error("==================================================");
    errors.forEach((err) => console.error(`  - ${err}`));
    console.error("==================================================\n");
    process.exit(1);
  }

  // Ensure upload and conversion directories exist on storage layer
  const rootDir = serverRoot;
  const uploadDir = path.resolve(rootDir, process.env.UPLOAD_DIR);
  const convertedDir = path.resolve(rootDir, process.env.CONVERTED_DIR);
  const tempDir = path.resolve(rootDir, process.env.TEMP_DIR);

  [uploadDir, convertedDir, tempDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const parsedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : ["http://localhost:3000", "http://localhost:5173"];

  const envConfig = {
    port,
    nodeEnv: process.env.NODE_ENV.toLowerCase(),
    isProduction: process.env.NODE_ENV.toLowerCase() === "production",
    isDevelopment: process.env.NODE_ENV.toLowerCase() === "development",
    libreOfficePath: process.env.LIBREOFFICE_PATH,
    maxFileSize,
    uploadDir,
    convertedDir,
    tempDir,
    logLevel: process.env.LOG_LEVEL.toLowerCase(),
    allowedOrigins: parsedOrigins,
  };

  // Freeze object to prevent accidental mutation during runtime
  return Object.freeze(envConfig);
};

export const envConfig = validateAndLoadEnv();
