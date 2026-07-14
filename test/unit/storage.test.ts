import { describe, test, expect } from "vitest";
import { detectImage } from "@/lib/storage";

const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
function webp() {
  const b = Buffer.alloc(16);
  b.write("RIFF", 0, "ascii");
  b.write("WEBP", 8, "ascii");
  return b;
}

describe("image magic-byte detection", () => {
  test("recognizes JPEG / PNG / WebP by content", () => {
    expect(detectImage(JPEG)).toEqual({ ext: "jpg", mime: "image/jpeg" });
    expect(detectImage(PNG)).toEqual({ ext: "png", mime: "image/png" });
    expect(detectImage(webp())).toEqual({ ext: "webp", mime: "image/webp" });
  });

  test("rejects non-images (a renamed .jpg that is really text/PDF)", () => {
    expect(detectImage(Buffer.from("not an image"))).toBeNull();
    expect(detectImage(Buffer.from([0x25, 0x50, 0x44, 0x46]))).toBeNull(); // %PDF
    expect(detectImage(Buffer.alloc(0))).toBeNull();
  });
});
