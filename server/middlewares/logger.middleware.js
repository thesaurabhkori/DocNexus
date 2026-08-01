import pinoHttp from "pino-http";
import logger from "../config/logger.js";

const loggerMiddleware = pinoHttp({
  logger,

  customSuccessMessage(req, res) {
    return `${req.method} ${req.url} completed (${res.statusCode})`;
  },

  customErrorMessage(req, res, error) {
    return `${req.method} ${req.url} failed : ${error.message}`;
  },

  customLogLevel(req, res, error) {
    if (error || res.statusCode >= 500) return "error";

    if (res.statusCode >= 400) return "warn";

    return "info";
  },
});

export default loggerMiddleware;