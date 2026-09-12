import { PDFDocument } from "pdf-lib";
import request from "supertest";
import app from "../app.js";

const tinyPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL1NwAAAABJRU5ErkJggg==",
  "base64"
);

const createPdf = async () => {
  const document = await PDFDocument.create();
  document.addPage([300, 300]);
  document.addPage([300, 300]);
  return Buffer.from(await document.save());
};

const attachPdf = (requestBuilder, pdf) =>
  requestBuilder.attach("files", pdf, {
    filename: "source.pdf",
    contentType: "application/pdf",
  });

describe("PDF-native tool conversions", () => {
  it("converts an image to PDF", async () => {
    const response = await request(app)
      .post("/api/image-to-pdf")
      .attach("files", tinyPng, { filename: "image.png", contentType: "image/png" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.pdfUrl).toMatch(/\/converted\//);
  });

  it.each([
    ["merge-pdf", {}],
    ["split-pdf", { pages: "1" }],
    ["extract-pages", { pages: "1" }],
    ["remove-pages", { pages: "2" }],
    ["rotate-pdf", { degrees: "90" }],
    ["crop-pdf", { top: "10", bottom: "10" }],
    ["watermark-pdf", { text: "TEST" }],
    ["sign-pdf", {}],
    ["unlock-pdf", {}],
  ])("processes %s", async (toolSlug, fields) => {
    let conversion = request(app).post(`/api/${toolSlug}`);
    Object.entries(fields).forEach(([key, value]) => {
      conversion = conversion.field(key, value);
    });

    const response = await attachPdf(conversion, await createPdf());

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.fileName).toMatch(/\.pdf$/);
    expect(response.body.pdfUrl).toMatch(/\/converted\//);
  });
});
