import { envConfig } from "./env.config.js";

/**
 * Centralized configuration for LibreOffice binary execution.
 * Inherits validated values from centralized envConfig.
 */
export const LIBREOFFICE_CONFIG = Object.freeze({
  binaryPath: envConfig.libreOfficePath,
  timeoutMs: envConfig.libreOfficeTimeoutMs || 60000,
});

export const libreOfficeConfig = LIBREOFFICE_CONFIG;