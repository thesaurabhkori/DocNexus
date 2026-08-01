import fs from "fs";
import fsPromises from "fs/promises";

/**
 * Safely unlinks a file without throwing if it doesn't exist.
 * @param {string} filePath - Path to file to delete.
 */
export const safeUnlink = async (filePath) => {
  if (!filePath) return;
  try {
    if (fs.existsSync(filePath)) {
      await fsPromises.unlink(filePath);
    }
  } catch (error) {
    console.error(`[CLEANUP ERROR] Failed to safely unlink path (${filePath}):`, error.message);
  }
};

/**
 * Schedules cleanup of output/converted files after a given delay.
 * @param {string} filePath - Path to converted file.
 * @param {string} fileName - File identifier string (for logging context).
 * @param {number} [delayMs=900000] - Delay in ms (defaults to 15 minutes).
 */
export const scheduleCleanUp = (filePath, fileName, delayMs = 15 * 60 * 1000) => {
  setTimeout(async () => {
    try {
      await safeUnlink(filePath);
      console.log(`[SCHEDULED CLEANUP] Successfully removed expired asset: ${fileName || filePath}`);
    } catch (err) {
      console.error(`[SCHEDULED CLEANUP FAULT] Failed to delete expired asset: ${filePath}`, err);
    }
  }, delayMs);
};