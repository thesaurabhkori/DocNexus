import fs from "fs";
import path from "path";
import { jest } from "@jest/globals";

const TEST_FIXTURES_DIR = path.join(process.cwd(), "tests", "fixtures");

// Set Test Environment Node Flag
process.env.NODE_ENV = "test";
process.env.PORT = "5001";
process.env.UPLOAD_DIR = "tests/fixtures/uploads";
process.env.CONVERTED_DIR = "tests/fixtures/converted";
process.env.TEMP_DIR = "tests/fixtures/temp";

// Suppress console logs during test suite runs
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

beforeAll(() => {
  // Guarantee test fixtures directory structure exists
  const dirs = [
    TEST_FIXTURES_DIR,
    path.join(TEST_FIXTURES_DIR, "uploads"),
    path.join(TEST_FIXTURES_DIR, "converted"),
    path.join(TEST_FIXTURES_DIR, "temp"),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Create dummy test buffer assets
  fs.writeFileSync(path.join(TEST_FIXTURES_DIR, "sample.pdf"), "%PDF-1.4 sample test file content");
  fs.writeFileSync(path.join(TEST_FIXTURES_DIR, "sample.docx"), "Dummy Word Document Content");
  fs.writeFileSync(path.join(TEST_FIXTURES_DIR, "sample.xlsx"), "Dummy Excel Document Content");
  fs.writeFileSync(path.join(TEST_FIXTURES_DIR, "sample.pptx"), "Dummy PowerPoint Document Content");
  fs.writeFileSync(path.join(TEST_FIXTURES_DIR, "sample.html"), "<html><body><h1>Test</h1></body></html>");
  fs.writeFileSync(path.join(TEST_FIXTURES_DIR, "sample.jpg"), "FFD8FFE000104A464946"); // JPEG magic bytes header
  fs.writeFileSync(path.join(TEST_FIXTURES_DIR, "invalid.txt"), "Invalid plain text asset");
});

afterAll(() => {
  // Purge test fixtures after test completion
  if (fs.existsSync(TEST_FIXTURES_DIR)) {
    fs.rmSync(TEST_FIXTURES_DIR, { recursive: true, force: true });
  }
});