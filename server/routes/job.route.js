import express from "express";
import { queueManager } from "../workers/index.js";
import { outputManager } from "../managers/index.js";

const router = express.Router();

router.get("/:jobId", (req, res) => {
  const { jobId } = req.params;
  const jobStatus = queueManager.getJobStatus(jobId);

  if (!jobStatus) {
    return res.status(404).json({ success: false, message: "Job not found or expired." });
  }

  if (jobStatus.status === "COMPLETED") {
    jobStatus.downloadUrl = outputManager.buildDownloadUrl(req, jobStatus.result.outputFileName);
  }

  return res.status(200).json({
    success: true,
    job: jobStatus,
  });
});

export default router;