export interface AlbumJsonLdInput {
  title: string;
  artist: string;
  releaseDate: Date;
  imageUrl: string;
  pageUrl: string;
}

export function musicAlbumJsonLd(
  input: AlbumJsonLdInput,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: input.title,
    byArtist: { "@type": "MusicGroup", name: input.artist },
    datePublished: input.releaseDate.toISOString().slice(0, 10),
    image: input.imageUrl,
    url: input.pageUrl,
  };
}

export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
