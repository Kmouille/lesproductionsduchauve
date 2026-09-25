import { describe, expect, it } from "vitest";
import { isHttpUrl, isUrlOnHost } from "./urls";

describe("isHttpUrl", () => {
  it("accepts http and https URLs", () => {
    expect(isHttpUrl("https://example.com/a")).toBe(true);
    expect(isHttpUrl("http://example.com")).toBe(true);
  });

  it("rejects other protocols and garbage", () => {
    expect(isHttpUrl("ftp://example.com")).toBe(false);
    expect(isHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isHttpUrl("pas une adresse")).toBe(false);
    expect(isHttpUrl("")).toBe(false);
  });

  it("tolerates surrounding whitespace pasted from a browser", () => {
    expect(isHttpUrl("  https://example.com  ")).toBe(true);
  });
});

describe("isUrlOnHost", () => {
  const bandcamp = ["bandcamp.com"];

  it("accepts the host and its subdomains", () => {
    expect(isUrlOnHost("https://bandcamp.com/x", bandcamp)).toBe(true);
    expect(
      isUrlOnHost("https://lesprodchauve.bandcamp.com/album/x", bandcamp),
    ).toBe(true);
    expect(
      isUrlOnHost("https://LesProdChauve.Bandcamp.com/album/x", bandcamp),
    ).toBe(true);
  });

  it("rejects look-alike hosts", () => {
    expect(isUrlOnHost("https://notbandcamp.com/x", bandcamp)).toBe(false);
    expect(isUrlOnHost("https://bandcamp.com.evil.io/x", bandcamp)).toBe(false);
  });

  it("accepts any host of the list", () => {
    expect(
      isUrlOnHost("https://youtu.be/abc", ["youtube.com", "youtu.be"]),
    ).toBe(true);
  });

  it("rejects non http URLs", () => {
    expect(isUrlOnHost("ftp://bandcamp.com/x", bandcamp)).toBe(false);
  });
});
