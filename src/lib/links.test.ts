import { describe, expect, it } from "vitest";
import { listenLabel } from "./links";

describe("listenLabel", () => {
  it.each([
    ["https://lesprodchauve.bandcamp.com/album/robert", "Écouter sur Bandcamp"],
    ["https://soundcloud.com/openightmare", "Écouter sur SoundCloud"],
    ["https://youtu.be/dQw4w9WgXcQ", "Écouter sur YouTube"],
    ["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "Écouter sur YouTube"],
    ["https://open.spotify.com/album/1", "Écouter sur Spotify"],
    ["https://www.deezer.com/album/1", "Écouter sur Deezer"],
    ["https://music.apple.com/fr/album/1", "Écouter sur Apple Music"],
  ])("names the platform of %s", (url, label) => {
    expect(listenLabel(url)).toBe(label);
  });

  it("falls back to a generic label for other sites", () => {
    expect(listenLabel("https://example.com/album")).toBe("Écouter");
    expect(listenLabel("pas une adresse")).toBe("Écouter");
  });
});
