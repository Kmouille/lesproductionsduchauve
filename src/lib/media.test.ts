import { describe, expect, it } from "vitest";
import { toContentRelative } from "./media";

describe("toContentRelative", () => {
  it("rewrites the Pages CMS output path to a path relative to content files", () => {
    expect(toContentRelative("/src/assets/productions/poetry.jpg")).toBe(
      "../../assets/productions/poetry.jpg",
    );
  });

  it("leaves relative paths and other values untouched", () => {
    expect(toContentRelative("../../assets/pages/a.jpg")).toBe(
      "../../assets/pages/a.jpg",
    );
    expect(toContentRelative(undefined)).toBeUndefined();
    expect(toContentRelative(42)).toBe(42);
  });
});
