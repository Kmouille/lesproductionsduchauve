import type { Genre, Role } from "./taxonomy";

export interface ProductionLike {
  slug: string;
  data: {
    title: string;
    artist: string;
    releaseDate: Date;
    roles: readonly Role[];
    genres: readonly Genre[];
    featured: boolean;
    draft: boolean;
    cover: { width: number; height: number };
  };
}

const byNewest = (a: ProductionLike, b: ProductionLike) =>
  b.data.releaseDate.getTime() - a.data.releaseDate.getTime() ||
  a.data.title.localeCompare(b.data.title, "fr");

export function published<P extends ProductionLike>(
  items: readonly P[],
  options: { includeDrafts?: boolean } = {},
): P[] {
  return items
    .filter((item) => options.includeDrafts || !item.data.draft)
    .sort(byNewest);
}

export function featured<P extends ProductionLike>(
  items: readonly P[],
  limit = 4,
): P[] {
  return items.filter((item) => item.data.featured).slice(0, limit);
}

export function byRole<P extends ProductionLike>(
  items: readonly P[],
  role: Role,
): P[] {
  return items.filter((item) => item.data.roles.includes(role));
}

export function neighbours<P extends ProductionLike>(
  items: readonly P[],
  slug: string,
): { previous: P | null; next: P | null } {
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1) {
    return { previous: null, next: null };
  }
  return { previous: items[index - 1] ?? null, next: items[index + 1] ?? null };
}

export function findDuplicateSlugs(
  items: readonly { slug: string }[],
): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const { slug } of items) {
    if (seen.has(slug)) {
      duplicates.add(slug);
    }
    seen.add(slug);
  }
  return [...duplicates].sort();
}

export function smallCovers<P extends ProductionLike>(
  items: readonly P[],
  minSide = 1400,
): P[] {
  return items.filter(
    (item) => Math.min(item.data.cover.width, item.data.cover.height) < minSide,
  );
}
