const LIGATURES: Record<string, string> = {
  "\u0153": "oe",
  "\u00e6": "ae",
  "\u00df": "ss",
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u0153\u00e6\u00df]/g, (ligature) => LIGATURES[ligature])
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['\u2018\u2019\u02bc]/g, "")
    .replace(/&/g, " et ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function productionSlug(artist: string, title: string): string {
  const artistSlug = slugify(artist);
  const titleSlug = slugify(title);
  const slug =
    artistSlug && titleSlug.startsWith(`${artistSlug}-`)
      ? titleSlug
      : [artistSlug, titleSlug].filter(Boolean).join("-");
  if (!slug) {
    throw new Error(
      `Impossible de créer une adresse pour "${artist} - ${title}" : ajoutez des lettres ou des chiffres au titre ou à l'artiste.`,
    );
  }
  return slug;
}
