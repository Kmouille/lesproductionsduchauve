import { describe, expect, it } from "vitest";
import { musicAlbumJsonLd, serializeJsonLd } from "./jsonld";

describe("musicAlbumJsonLd", () => {
  it("describes the album", () => {
    expect(
      musicAlbumJsonLd({
        title: "Poetry",
        artist: "CHAUVE",
        releaseDate: new Date("2014-02-08"),
        imageUrl: "https://site/cover.jpg",
        pageUrl: "https://site/productions/chauve-poetry/",
      }),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "MusicAlbum",
      name: "Poetry",
      byArtist: { "@type": "MusicGroup", name: "CHAUVE" },
      datePublished: "2014-02-08",
      image: "https://site/cover.jpg",
      url: "https://site/productions/chauve-poetry/",
    });
  });
});

describe("serializeJsonLd", () => {
  it("cannot close the surrounding script tag", () => {
    const output = serializeJsonLd({
      name: "</script><script>alert(1)</script>",
    });
    expect(output).not.toContain("</script>");
    expect(JSON.parse(output)).toEqual({
      name: "</script><script>alert(1)</script>",
    });
  });
});
