import fs from "fs";
import path from "path";
import crypto from "crypto";
import { envConfig } from "../config/index.js";

class OutputManager {
  constructor() {
    this.convertedDir = path.resolve(envConfig.convertedDir);
    this.ensureDirectoryExists();
  }

  /**
   * Guarantees that the converted output directory exists.
   */
  ensureDirectoryExists() {
    if (!fs.existsSync(this.convertedDir)) {
      fs.mkdirSync(this.convertedDir, { recursive: true });
    }
  }

  /**
   * Generates a unique output filename with an optional prefix while preserving extensions.
   * @param {string} prefix - Descriptive action prefix (e.g., 'WordConverted', 'Merged').
   * @param {string} targetExtension - Target format extension (e.g., '.pdf', '.docx').
   * @param {string} [originalName] - Optional original name to preserve branding token.
   * @returns {string} Unique output file name.
   */
  generateOutputName(prefix = "Converted", targetExtension = ".pdf", originalName = "") {
    const ext = targetExtension.startsWith(".") ? targetExtension : `.${targetExtension}`;
    const timestamp = Date.now();
    const hash = crypto.randomBytes(4).toString("hex");

    let stem = "";
    if (originalName) {
      stem = `_${path
        .basename(originalName, path.extname(originalName))
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "_")
        .substring(0, 30)}`;
    }

    return `${prefix}-${timestamp}_${hash}${stem}${ext}`;
  }

  /**
   * Constructs absolute system path for a converted file.
   * @param {string} filename - Target output filename.
   * @returns {string} Absolute path.
   */
  getOutputPath(filename) {
    const safeName = path.basename(filename);
    return path.join(this.convertedDir, safeName);
  }

  /**
   * Constructs standardized dynamic public download URL for frontend client consumption.
   * @param {Object} req - Express request object.
   * @param {string} filename - Converted output filename.
   * @returns {string} Fully-qualified HTTP URL.
   */
  buildDownloadUrl(req, filename) {
    const protocol = req.protocol;
    const host = req.get("host");
    return `${protocol}://${host}/${path.basename(envConfig.convertedDir)}/${filename}`;
  }
}

export default new OutputManager();