import fs from "fs";
import path from "path";
import { envConfig, logger } from "../config/index.js";
import uploadManager from "./upload.manager.js";
import outputManager from "./output.manager.js";
import tempManager from "./temp.manager.js";

class CleanupManager {
  /**
   * Asynchronously and safely unlinks a single file without crashing the application.
   * @param {string} filePath - Absolute path to target file.
   * @returns {Promise<boolean>} True if unlinked successfully or already absent.
   */
  async safeUnlink(filePath) {
    if (!filePath) return false;

    return new Promise((resolve) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          if (err.code !== "ENOENT") {
            logger.warn(`[CLEANUP MANAGER] Could not unlink asset '${filePath}': ${err.message}`);
          }
          return resolve(false);
        }
        logger.debug(`[CLEANUP MANAGER] Unlinked asset: ${filePath}`);
        return resolve(true);
      });
    });
  }

  /**
   * Cleans up uploaded staging files immediately after service execution finishes.
   * @param {Array<Express.Multer.File>|Express.Multer.File} files - Single file or array of Multer files.
   */
  async cleanupUploads(files) {
    if (!files) return;
    const fileList = Array.isArray(files) ? files : [files];

    for (const file of fileList) {
      if (file && file.path) {
        await this.safeUnlink(file.path);
      }
    }
  }

  /**
   * Emergency cleanup trigger on pipeline/conversion failure.
   * @param {Array<Express.Multer.File>|Express.Multer.File} files - Staging files to purge.
   * @param {Array<string>} [additionalPaths=[]] - Extra temporary paths created during conversion.
   */
  async handleEmergencyCleanup(files, additionalPaths = []) {
    logger.warn(`[CLEANUP MANAGER] Executing emergency pipeline cleanup...`);
    await this.cleanupUploads(files);

    if (Array.isArray(additionalPaths)) {
      for (const p of additionalPaths) {
        await this.safeUnlink(p);
      }
    }
  }

  /**
   * Schedules delayed deletion of converted output files to allow client download before purge.
   * @param {string} filePath - Absolute path to converted output file.
   * @param {number} [delayMs=1800000] - Delay before unlinking (Default: 30 minutes).
   */
  scheduleOutputCleanup(filePath, delayMs = 30 * 60 * 1000) {
    if (!filePath) return;

    setTimeout(async () => {
      if (fs.existsSync(filePath)) {
        await this.safeUnlink(filePath);
        logger.info(`[CLEANUP MANAGER] Purged scheduled output asset: ${path.basename(filePath)}`);
      }
    }, delayMs);
  }

  /**
   * Comprehensive sweep for orphaned/stale files across all system folders (`uploads`, `converted`, `temp`).
   * @param {number} maxAgeMs - Maximum allowed file age (Default: 1 hour).
   */
  async sweepOrphanedFiles(maxAgeMs = 60 * 60 * 1000) {
    const targetDirs = [uploadManager.uploadDir, outputManager.convertedDir, tempManager.tempDir];
    const now = Date.now();

    for (const dir of targetDirs) {
      try {
        if (!fs.existsSync(dir)) continue;

        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          try {
            const stats = fs.statSync(filePath);
            if (stats.isFile() && now - stats.mtimeMs > maxAgeMs) {
              await this.safeUnlink(filePath);
              logger.info(`[CLEANUP SWEEP] Purged orphaned asset in [${path.basename(dir)}]: ${file}`);
            }
          } catch (fileErr) {
            logger.warn(`[CLEANUP SWEEP] Skipped '${file}': ${fileErr.message}`);
          }
        }
      } catch (dirErr) {
        logger.error(`[CLEANUP SWEEP] Failed directory sweep for '${dir}': ${dirErr.message}`);
      }
    }
  }

  /**
   * Initializes background cron/interval job to automatically execute orphan sweeps.
   * @param {number} intervalMs - Execution frequency (Default: Every 15 minutes).
   */
  initScheduledCleanup(intervalMs = 15 * 60 * 1000) {
    logger.info(`[CLEANUP MANAGER] Scheduled background cleanup task initialized (Interval: ${intervalMs / 1000}s).`);

    // Initial sweep on application boot
    this.sweepOrphanedFiles();

    // Recurring interval execution
    setInterval(() => {
      this.sweepOrphanedFiles();
    }, intervalMs);
  }
}

export default new CleanupManager();