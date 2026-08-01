import { parentPort } from "worker_threads";

parentPort.on("message", async (data) => {
  const { jobId, task, payload } = data;

  try {
    let result = null;

    switch (task) {
      case "image-to-pdf":
      case "pdf-to-jpg":
        result = { outputFileName: payload.outputFileName };
        break;

      default:
        throw new Error(`Unsupported Image worker task action: '${task}'`);
    }

    parentPort.postMessage({ success: true, jobId, result });
  } catch (error) {
    parentPort.postMessage({
      success: false,
      jobId,
      error: error.message || "Image worker process execution failed.",
    });
  }
});