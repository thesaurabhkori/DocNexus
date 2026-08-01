import { Worker } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";
import queueManager from "../queue/queue.manager.js";
import { cleanupManager } from "../managers/index.js";
import { logger } from "../config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WorkerManager {
  constructor() {
    this.workers = new Map(); // workerId -> { worker, type, isBusy, currentJob }
    this.workerPoolLimits = {
      pdf: 2,
      office: 2,
      image: 2,
    };
    this.workerPaths = {
      pdf: path.join(__dirname, "pdf.worker.js"),
      office: path.join(__dirname, "office.worker.js"),
      image: path.join(__dirname, "image.worker.js"),
    };
  }

  /**
   * Boots worker thread pools.
   */
  initWorkerPools() {
    for (const [type, limit] of Object.entries(this.workerPoolLimits)) {
      for (let i = 0; i < limit; i++) {
        this.spawnWorker(type, i);
      }
    }
    logger.info("[WORKER MANAGER] Worker thread pools successfully initialized.");

    // Start background job map cleaner
    setInterval(() => queueManager.purgeStaleJobs(), 15 * 60 * 1000);
  }

  /**
   * Spawns an individual worker thread and binds event listeners.
   */
  spawnWorker(type, index) {
    const workerId = `${type}_worker_${index}`;
    const workerPath = this.workerPaths[type];

    const worker = new Worker(workerPath);

    const workerEntry = {
      id: workerId,
      worker,
      type,
      isBusy: false,
      currentJob: null,
    };

    worker.on("message", (message) => this.handleWorkerMessage(workerEntry, message));

    worker.on("error", (error) => {
      logger.error(`[WORKER CRASH] Worker '${workerId}' threw error: ${error.message}`);
      this.handleWorkerFailure(workerEntry, error.message);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        logger.warn(`[WORKER EXIT] Worker '${workerId}' exited with code ${code}. Respawning...`);
        this.handleWorkerFailure(workerEntry, `Worker exited with code ${code}`);
        this.spawnWorker(type, index); // Auto-respawn crashed worker
      }
    });

    this.workers.set(workerId, workerEntry);
  }

  /**
   * Dispatches queued jobs to free worker threads.
   */
  dispatch() {
    for (const [workerId, workerEntry] of this.workers.entries()) {
      if (!workerEntry.isBusy) {
        const nextJob = queueManager.getNextJob(workerEntry.type);
        if (nextJob) {
          this.executeJob(workerEntry, nextJob);
        }
      }
    }
  }

  /**
   * Submits job payload to worker thread.
   */
  executeJob(workerEntry, job) {
    workerEntry.isBusy = true;
    workerEntry.currentJob = job;
    job.markProcessing();

    logger.info(`[WORKER DISPATCH] Assigning Job [${job.id}] to Worker '${workerEntry.id}'`);
    workerEntry.worker.postMessage({
      jobId: job.id,
      task: job.task,
      payload: job.payload,
    });
  }

  /**
   * Handles successful or failed worker responses.
   */
  async handleWorkerMessage(workerEntry, message) {
    const { success, jobId, result, error } = message;
    const job = workerEntry.currentJob;

    if (job && job.id === jobId) {
      if (success) {
        job.markCompleted(result);
        logger.info(`[WORKER SUCCESS] Job [${job.id}] completed successfully.`);
      } else {
        await this.processJobFailure(job, error);
      }

      // Cleanup input staging uploads after completion or final failure
      if (job.payload && job.payload.files) {
        await cleanupManager.cleanupUploads(job.payload.files);
      }

      // Release worker and check queue for next assignment
      workerEntry.isBusy = false;
      workerEntry.currentJob = null;
      this.dispatch();
    }
  }

  /**
   * Handles thread crashes/unhandled rejections.
   */
  async handleWorkerFailure(workerEntry, errorMsg) {
    const job = workerEntry.currentJob;
    if (job) {
      await this.processJobFailure(job, errorMsg);
      workerEntry.isBusy = false;
      workerEntry.currentJob = null;
    }
    this.dispatch();
  }

  /**
   * Evaluates job retry logic or marks as permanently failed.
   */
  async processJobFailure(job, errorMsg) {
    if (job.canRetry()) {
      queueManager.requeue(job);
    } else {
      job.markFailed(errorMsg);
      logger.error(`[WORKER FAILED] Job [${job.id}] failed permanently: ${job.error}`);
    }
  }
}

export default new WorkerManager();