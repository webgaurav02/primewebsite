import { describe, test, expect } from "vitest";
import { detectDocument, detectImage } from "@/lib/storage";

/**
 * Content-based file-type detection is a security control (never trust the
 * client's content-type). Documents additionally accept PDF.
 */

const PDF = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]); // %PDF-1.4
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
const GIF = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]); // unsupported

describe("detectDocument", () => {
  test("accepts PDF by magic bytes", () => {
    expect(detectDocument(PDF)).toEqual({ ext: "pdf", mime: "application/pdf" });
  });
  test("accepts images too", () => {
    expect(detectDocument(PNG)?.mime).toBe("image/png");
    expect(detectDocument(JPEG)?.mime).toBe("image/jpeg");
  });
  test("rejects an unsupported type (GIF)", () => {
    expect(detectDocument(GIF)).toBeNull();
  });
});

describe("detectImage does NOT accept PDF", () => {
  test("PDF is not an image", () => {
    expect(detectImage(PDF)).toBeNull();
  });
});
