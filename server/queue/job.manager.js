import crypto from "crypto";

export const JOB_STATUS = Object.freeze({
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
});

export class Job {
  /**
   * Creates a structured Job instance.
   * @param {string} type - Worker type domain ('pdf', 'office', 'image').
   * @param {string} task - Target action name (e.g., 'word-to-pdf', 'merge-pdf').
   * @param {Object} payload - Task parameters (file paths, options).
   */
  constructor(type, task, payload) {
    this.id = `job_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    this.type = type;
    this.task = task;
    this.payload = payload;
    this.status = JOB_STATUS.PENDING;
    this.result = null;
    this.error = null;
    this.retryCount = 0;
    this.maxRetries = 1; // Retry failed jobs once
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  markProcessing() {
    this.status = JOB_STATUS.PROCESSING;
    this.updatedAt = new Date().toISOString();
  }

  markCompleted(result) {
    this.status = JOB_STATUS.COMPLETED;
    this.result = result;
    this.updatedAt = new Date().toISOString();
  }

  markFailed(error) {
    this.status = JOB_STATUS.FAILED;
    this.error = typeof error === "string" ? error : error?.message || "Unknown execution error";
    this.updatedAt = new Date().toISOString();
  }

  canRetry() {
    return this.retryCount < this.maxRetries;
  }

  incrementRetry() {
    this.retryCount += 1;
    this.status = JOB_STATUS.PENDING;
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      task: this.task,
      status: this.status,
      result: this.result,
      error: this.error,
      retryCount: this.retryCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}