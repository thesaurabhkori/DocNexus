import app from "./app.js";
import { envConfig, logger } from "./config/index.js";
import { workerManager } from "./workers/index.js";
import { cleanupManager } from "./managers/index.js";

// 1. Initialize file cleanup background daemon
cleanupManager.initScheduledCleanup();

// 2. Initialize Worker Thread Pools
workerManager.initWorkerPools();

app.listen(envConfig.port, () => {
  logger.info(`Server running in [${envConfig.nodeEnv}] on port ${envConfig.port}`);
});