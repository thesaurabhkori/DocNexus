import { Job, JOB_STATUS } from "./job.manager.js";
import { logger } from "../config/index.js";

class QueueManager {
  constructor() {
    this.pendingQueue = [];
    this.jobsMap = new Map();
  }

  /**
   * Enqueues a new conversion request into the in-memory queue.
   * @param {string} type - Worker domain ('pdf' | 'office' | 'image').
   * @param {string} task - Task identifier.
   * @param {Object} payload - Input metadata and path details.
   * @returns {Job} Created job instance.
   */
  enqueue(type, task, payload) {
    const job = new Job(type, task, payload);
    this.jobsMap.set(job.id, job);
    this.pendingQueue.push(job);

    logger.info(`[QUEUE] Enqueued Job [${job.id}] (${type}:${task}). Queue Length: ${this.pendingQueue.length}`);
    return job;
  }

  /**
   * Fetches the next pending job matching available worker capability.
   * @param {string} workerType - Available worker type.
   * @returns {Job|null}
   */
  getNextJob(workerType) {
    const index = this.pendingQueue.findIndex((job) => job.type === workerType);
    if (index === -1) return null;

    const [job] = this.pendingQueue.splice(index, 1);
    return job;
  }

  /**
   * Re-enqueues a job for retry execution.
   * @param {Job} job 
   */
  requeue(job) {
    job.incrementRetry();
    this.pendingQueue.unshift(job); // Prioritize retry jobs
    logger.warn(`[QUEUE] Requeued Job [${job.id}] for retry attempt ${job.retryCount}/${job.maxRetries}`);
  }

  /**
   * Retrieves structured job state by ID.
   * @param {string} jobId 
   * @returns {Object|null}
   */
  getJobStatus(jobId) {
    const job = this.jobsMap.get(jobId);
    return job ? job.toJSON() : null;
  }

  /**
   * Cleanup completed/failed jobs older than maxAge to prevent memory leaks.
   * @param {number} maxAgeMs (Default: 30 minutes)
   */
  purgeStaleJobs(maxAgeMs = 30 * 60 * 1000) {
    const now = Date.now();
    let purgedCount = 0;

    for (const [id, job] of this.jobsMap.entries()) {
      if (
        (job.status === JOB_STATUS.COMPLETED || job.status === JOB_STATUS.FAILED) &&
        now - new Date(job.updatedAt).getTime() > maxAgeMs
      ) {
        this.jobsMap.delete(id);
        purgedCount++;
      }
    }

    if (purgedCount > 0) {
      logger.info(`[QUEUE] Purged ${purgedCount} expired jobs from memory map.`);
    }
  }
}

export default new QueueManager();