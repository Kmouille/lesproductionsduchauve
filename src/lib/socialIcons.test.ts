import { describe, expect, it } from "vitest";
import { matchSocialIcon } from "./socialIcons";

describe("matchSocialIcon", () => {
  it.each([
    ["https://www.facebook.com/Yoorwell/", "facebook"],
    ["https://www.instagram.com/lesprodchauve/", "instagram"],
    ["https://soundcloud.com/openightmare", "soundcloud"],
    ["https://lesprodchauve.bandcamp.com", "bandcamp"],
    ["https://www.youtube.com/@YvesDeRoeck", "youtube"],
    ["https://youtu.be/dQw4w9WgXcQ", "youtube"],
  ])("matches the icon for %s", (url, icon) => {
    expect(matchSocialIcon(url)).toBe(icon);
  });

  it("falls back to a generic icon for other sites", () => {
    expect(matchSocialIcon("https://example.com/lesprodchauve")).toBe(
      "generic",
    );
    expect(matchSocialIcon("pas une adresse")).toBe("generic");
  });
});
