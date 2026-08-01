/**
 * Utility to parse page range strings (e.g., "1-3, 5, 7-9") into 0-indexed page number arrays.
 * 
 * @param {string} rangeStr - Range string from client payload (e.g., "1-3, 5" or "2").
 * @param {number} totalPages - Total number of pages in the original PDF document.
 * @returns {number[]} Array of unique, sorted, 0-based page indices.
 */
export const parsePageRanges = (rangeStr, totalPages) => {
  if (!rangeStr || typeof rangeStr !== "string") {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const indicesSet = new Set();
  const parts = rangeStr.split(",").map((p) => p.trim());

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      let start = parseInt(startStr, 10);
      let end = parseInt(endStr, 10);

      if (isNaN(start)) start = 1;
      if (isNaN(end)) end = totalPages;

      // Bound checks (1-indexed user input to 0-indexed internal logic)
      start = Math.max(1, Math.min(start, totalPages));
      end = Math.max(1, Math.min(end, totalPages));

      const min = Math.min(start, end);
      const max = Math.max(start, end);

      for (let i = min; i <= max; i++) {
        indicesSet.add(i - 1);
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        indicesSet.add(pageNum - 1);
      }
    }
  }

  return Array.from(indicesSet).sort((a, b) => a - b);
};