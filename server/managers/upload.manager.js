import fs from "fs";
import path from "path";
import crypto from "crypto";
import { envConfig } from "../config/index.js";

class UploadManager {
  constructor() {
    this.uploadDir = path.resolve(envConfig.uploadDir);
    this.ensureDirectoryExists();
  }

  /**
   * Guarantees that the upload directory exists.
   */
  ensureDirectoryExists() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Generates a collision-proof file name using timestamp and cryptographic entropy.
   * @param {string} originalName - Original uploaded file name.
   * @returns {string} Unique sanitized file name.
   */
  generateUniqueName(originalName = "file") {
    const sanitizeName = path
      .basename(originalName, path.extname(originalName))
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "_");
    const ext = path.extname(originalName).toLowerCase();
    const uniqueHash = crypto.randomBytes(8).toString("hex");

    return `upload_${Date.now()}_${uniqueHash}_${sanitizeName}${ext}`;
  }

  /**
   * Validates if a target path resides within the authorized uploads directory (Prevents Directory Traversal attacks).
   * @param {string} filePath - Path to check.
   * @returns {boolean} True if within uploads root.
   */
  isValidUploadPath(filePath) {
    if (!filePath) return false;
    const resolvedPath = path.resolve(filePath);
    return resolvedPath.startsWith(this.uploadDir);
  }

  /**
   * Gets the absolute path for an upload filename.
   * @param {string} filename - Filename inside upload directory.
   * @returns {string} Absolute file system path.
   */
  getFilePath(filename) {
    const safeName = path.basename(filename);
    return path.join(this.uploadDir, safeName);
  }
}

export default new UploadManager();