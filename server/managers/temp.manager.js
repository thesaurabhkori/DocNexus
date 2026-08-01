import fs from "fs";
import path from "path";
import crypto from "crypto";
import { envConfig, logger } from "../config/index.js";

class TempManager {
  constructor() {
    this.tempDir = path.resolve(envConfig.tempDir);
    this.ensureDirectoryExists();
  }

  /**
   * Guarantees that the temporary processing directory exists.
   */
  ensureDirectoryExists() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  /**
   * Generates a temporary absolute path for transient workspace files.
   * @param {string} [extension='.tmp'] - Extension for the temporary file.
   * @returns {string} Absolute path inside temp workspace.
   */
  getTempPath(extension = ".tmp") {
    const ext = extension.startsWith(".") ? extension : `.${extension}`;
    const tempName = `temp_${Date.now()}_${crypto.randomBytes(6).toString("hex")}${ext}`;
    return path.join(this.tempDir, tempName);
  }

  /**
   * Purges expired temporary files older than specified maxAge.
   * @param {number} maxAgeMs - Maximum permitted age in milliseconds (default: 1 hour).
   */
  async purgeExpiredTempFiles(maxAgeMs = 60 * 60 * 1000) {
    try {
      if (!fs.existsSync(this.tempDir)) return;

      const files = fs.readdirSync(this.tempDir);
      const now = Date.now();

      for (const file of files) {
        const filePath = path.join(this.tempDir, file);
        try {
          const stats = fs.statSync(filePath);
          if (now - stats.mtimeMs > maxAgeMs) {
            fs.unlinkSync(filePath);
            logger.info(`[TEMP MANAGER] Purged stale temporary asset: ${file}`);
          }
        } catch (fileErr) {
          logger.warn(`[TEMP MANAGER] Failed evaluating temp asset '${file}': ${fileErr.message}`);
        }
      }
    } catch (err) {
      logger.error(`[TEMP MANAGER] Error during temp purge cycle: ${err.message}`);
    }
  }
}

export default new TempManager();