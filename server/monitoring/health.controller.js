import systemService from "./system.service.js";
import metricsService from "./metrics.service.js";

/**
 * Controller handling GET /health checks.
 */
export const getHealth = async (req, res) => {
  try {
    const healthData = systemService.getHealthStatus();
    return res.status(200).json({
      success: true,
      data: healthData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Health check evaluation failed.",
      error: error.message,
    });
  }
};

/**
 * Controller handling GET /metrics diagnostic monitoring.
 */
export const getMetrics = async (req, res) => {
  try {
    const metricsData = metricsService.getMetrics();
    return res.status(200).json({
      success: true,
      data: metricsData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Metrics compilation failed.",
      error: error.message,
    });
  }
};