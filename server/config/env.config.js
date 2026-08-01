import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables from .env file
dotenv.config();

/**
 * Validates required environment variables and builds a typed, frozen configuration object.
 */
const validateAndLoadEnv = () => {
  const errors = [];

  // Required variables checklist
  const requiredVars = [
    "PORT",
    "NODE_ENV",
    "LIBREOFFICE_PATH",
    "MAX_FILE_SIZE",
    "UPLOAD_DIR",
    "CONVERTED_DIR",
    "TEMP_DIR",
    "LOG_LEVEL",
  ];

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
  const rootDir = process.cwd();
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