import systemService from "./system.service.js";

class MetricsService {
  /**
   * Calculates CPU usage percentages for the current Node.js process.
   * @returns {Object} User and System CPU execution time in milliseconds.
   */
  getCpuMetrics() {
    const usage = process.cpuUsage();
    return {
      userMs: Math.round(usage.user / 1000),
      systemMs: Math.round(usage.system / 1000),
    };
  }

  /**
   * Compiles comprehensive application process and runtime metrics.
   * @returns {Object} Detailed process performance metrics.
   */
  getMetrics() {
    const memoryUsage = process.memoryUsage();

    return {
      process: {
        pid: process.pid,
        nodeVersion: process.version,
        uptimeSeconds: Math.floor(process.uptime()),
        cpuUsage: this.getCpuMetrics(),
      },
      memory: {
        rssMB: Math.round(memoryUsage.rss / (1024 * 1024)), // Resident Set Size
        heapTotalMB: Math.round(memoryUsage.heapTotal / (1024 * 1024)), // V8 allocated heap
        heapUsedMB: Math.round(memoryUsage.heapUsed / (1024 * 1024)), // V8 used heap
        externalMB: Math.round(memoryUsage.external / (1024 * 1024)), // C++ objects bound to JS
        arrayBuffersMB: Math.round((memoryUsage.arrayBuffers || 0) / (1024 * 1024)),
      },
      system: systemService.getSystemInfo(),
      timestamp: new Date().toISOString(),
    };
  }
}

export default new MetricsService();