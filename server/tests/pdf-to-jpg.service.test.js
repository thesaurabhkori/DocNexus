import { describe, it, expect } from '@jest/globals';
import { normalizePdfToJpgFormat, resolvePdfToJpgOutputName } from '../modules/pdf-to-jpg/service.js';

describe('PDF to JPG conversion format handling', () => {
  it('normalizes a png request to the correct output format', () => {
    expect(normalizePdfToJpgFormat('png')).toBe('png');
    expect(normalizePdfToJpgFormat('PNG')).toBe('png');
    expect(normalizePdfToJpgFormat('jpg')).toBe('jpg');
  });

  it('creates the correct output filename for the selected format', () => {
    expect(resolvePdfToJpgOutputName('report.pdf', 'png')).toBe('report.png');
    expect(resolvePdfToJpgOutputName('report.pdf', 'jpeg')).toBe('report.jpeg');
    expect(resolvePdfToJpgOutputName('report.pdf', 'gif')).toBe('report.jpg');
  });

  it('returns a zip archive name only when multiple converted image files exist', () => {
    expect(resolvePdfToJpgOutputName('report.pdf', 'png', [1, 2, 3], 2)).toBe('report.zip');
    expect(resolvePdfToJpgOutputName('report.pdf', 'png', [1, 2, 3], 1)).toBe('report.png');
    expect(resolvePdfToJpgOutputName('report.pdf', 'jpeg', [1], 1)).toBe('report.jpeg');
  });
});
