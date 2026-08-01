import { parentPort } from "worker_threads";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

parentPort.on("message", async (data) => {
  const { jobId, task, payload } = data;

  try {
    const { binaryPath, outputDir, inputPath, targetFormat, outputFileName } = payload;

    // Build headless conversion command
    let filterSpec = targetFormat;
    if (task === "pdf-to-word") filterSpec = 'docx:"Writer with PDF Import"';
    if (task === "pdf-to-excel") filterSpec = 'xlsx:"Calc Office Open XML"';
    if (task === "pdf-to-ppt") filterSpec = 'pptx:"Impress MS PowerPoint 2007 XML"';

    const cmd = `${binaryPath} --headless --convert-to ${filterSpec} --outdir "${outputDir}" "${inputPath}"`;

    exec(cmd, { timeout: 120000 }, (err, stdout, stderr) => {
      if (err) {
        return parentPort.postMessage({
          success: false,
          jobId,
          error: `Office CLI error: ${err.message}`,
        });
      }

      parentPort.postMessage({
        success: true,
        jobId,
        result: { outputFileName },
      });
    });
  } catch (error) {
    parentPort.postMessage({
      success: false,
      jobId,
      error: error.message || "Office worker pipeline execution crashed.",
    });
  }
});