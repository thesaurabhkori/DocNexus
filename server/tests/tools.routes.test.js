import request from "supertest";
import app from "../app.js";

const TOOL_SLUGS = [
  "image-to-pdf",
  "word-to-pdf",
  "excel-to-pdf",
  "powerpoint-to-pdf",
  "html-to-pdf",
  "pdf-to-word",
  "pdf-to-excel",
  "pdf-to-ppt",
  "pdf-to-jpg",
  "pdf-to-pdfa",
  "merge-pdf",
  "split-pdf",
  "extract-pages",
  "remove-pages",
  "rotate-pdf",
  "compress-pdf",
  "crop-pdf",
  "protect-pdf",
  "unlock-pdf",
  "watermark-pdf",
  "sign-pdf",
];

describe("Tool route registration", () => {
  it.each(TOOL_SLUGS)("registers POST /api/%s", async (toolSlug) => {
    const response = await request(app).post(`/api/${toolSlug}`);

    // No upload is deliberately invalid. A validation failure proves the
    // route, Multer middleware, validator, and controller pipeline loaded.
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/files?/i);
  });
});
