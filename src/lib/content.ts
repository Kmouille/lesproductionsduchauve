import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { findDuplicateSlugs, published, smallCovers } from "./productions";
import { productionSlug } from "./slug";

export type ProductionEntry = CollectionEntry<"productions"> & { slug: string };

let cachedProductions: Promise<ProductionEntry[]> | undefined;

async function buildProductions(): Promise<ProductionEntry[]> {
  const entries = await getCollection("productions");
  const withSlugs = entries.map((entry) =>
    Object.assign({}, entry, {
      slug: productionSlug(entry.data.artist, entry.data.title),
    }),
  );
  const duplicates = findDuplicateSlugs(withSlugs);
  if (duplicates.length > 0) {
    const titles = withSlugs
      .filter((entry) => duplicates.includes(entry.slug))
      .map((entry) => `"${entry.data.artist} - ${entry.data.title}"`);
    throw new Error(
      `Plusieurs productions partagent la même adresse (${titles.join(", ")}) : changez le titre ou l'artiste de l'une d'elles.`,
    );
  }
  const visible = published(withSlugs, { includeDrafts: import.meta.env.DEV });
  for (const production of smallCovers(visible)) {
    const { title, cover } = production.data;
    console.warn(
      `[pochette] "${title}" fait ${cover.width}x${cover.height} px : demandez un fichier d'au moins 1400 px de côté.`,
    );
  }
  return visible;
}

// Built once per build so warnings print once, rebuilt per request in dev.
export function loadProductions(): Promise<ProductionEntry[]> {
  if (import.meta.env.DEV) {
    return buildProductions();
  }
  cachedProductions ??= buildProductions();
  return cachedProductions;
}

function required<T>(entry: T | undefined, file: string): T {
  if (!entry) {
    throw new Error(`Contenu manquant : ${file}`);
  }
  return entry;
}

export const loadSite = async () =>
  required(await getEntry("site", "site"), "src/content/pages/site.yml");
export const loadAccueil = async () =>
  required(
    await getEntry("accueil", "accueil"),
    "src/content/pages/accueil.yml",
  );
export const loadAbout = async () =>
  required(
    await getEntry("about", "qui-suis-je"),
    "src/content/pages/qui-suis-je.md",
  );
export const loadStudio = async () =>
  required(await getEntry("studio", "studio"), "src/content/pages/studio.yml");
export const loadServices = async () =>
  required(
    await getEntry("services", "services"),
    "src/content/pages/services.yml",
  );
