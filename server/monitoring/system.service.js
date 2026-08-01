import os from "os";
import { envConfig } from "../config/index.js";

class SystemService {
  /**
   * Generates lightweight health status metadata.
   * @returns {Object} System health status overview.
   */
  getHealthStatus() {
    return {
      status: "UP",
      timestamp: new Date().toISOString(),
      environment: envConfig.nodeEnv,
      uptime: {
        processSeconds: Math.floor(process.uptime()),
        systemSeconds: Math.floor(os.uptime()),
      },
    };
  }

  /**
   * Retrieves operational system details and hardware status.
   * @returns {Object} Host system specs.
   */
  getSystemInfo() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    return {
      platform: process.platform,
      arch: os.arch(),
      hostname: os.hostname(),
      cpuCores: os.cpus().length,
      loadAverage: os.loadavg(), // Returns [1 min, 5 min, 15 min] load averages
      systemMemory: {
        totalMB: Math.round(totalMem / (1024 * 1024)),
        freeMB: Math.round(freeMem / (1024 * 1024)),
        usedMB: Math.round(usedMem / (1024 * 1024)),
        usagePercentage: Number(((usedMem / totalMem) * 100).toFixed(2)),
      },
    };
  }
}

export default new SystemService();