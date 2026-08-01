import dotenv from "dotenv";
dotenv.config();

/**
 * Centralized configuration for LibreOffice binary execution.
 */
export const LIBREOFFICE_CONFIG = {
  binaryPath: process.env.LIBREOFFICE_PATH || "libreoffice",
  timeoutMs: parseInt(process.env.LIBREOFFICE_TIMEOUT_MS, 10) || 60000,
};