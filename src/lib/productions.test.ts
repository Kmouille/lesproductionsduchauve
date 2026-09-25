import { describe, expect, it } from "vitest";
import {
  byRole,
  featured,
  findDuplicateSlugs,
  neighbours,
  published,
  smallCovers,
  type ProductionLike,
} from "./productions";

const make = (
  slug: string,
  overrides: Partial<ProductionLike["data"]> = {},
): ProductionLike => ({
  slug,
  data: {
    title: slug,
    artist: "Band",
    releaseDate: new Date("2020-01-01"),
    roles: ["mixage"],
    genres: ["punk"],
    featured: false,
    draft: false,
    cover: { width: 3000, height: 3000 },
    ...overrides,
  },
});

describe("published", () => {
  const old = make("old", { releaseDate: new Date("2014-02-08") });
  const recent = make("recent", { releaseDate: new Date("2023-05-01") });
  const draft = make("draft", {
    releaseDate: new Date("2025-01-01"),
    draft: true,
  });

  it("drops drafts and sorts newest first", () => {
    expect(published([old, draft, recent]).map((p) => p.slug)).toEqual([
      "recent",
      "old",
    ]);
  });

  it("keeps drafts when asked", () => {
    expect(
      published([old, draft, recent], { includeDrafts: true }).map(
        (p) => p.slug,
      ),
    ).toEqual(["draft", "recent", "old"]);
  });

  it("breaks date ties by title", () => {
    const b = make("b", { title: "Été" });
    const a = make("a", { title: "Azur" });
    expect(published([b, a]).map((p) => p.slug)).toEqual(["a", "b"]);
  });

  it("does not mutate its input", () => {
    const input = [old, recent];
    published(input);
    expect(input.map((p) => p.slug)).toEqual(["old", "recent"]);
  });
});

describe("featured", () => {
  it("keeps featured entries in order, up to the limit", () => {
    const items = ["a", "b", "c", "d", "e", "f"].map((slug, i) =>
      make(slug, { featured: i !== 1 }),
    );
    expect(featured(items).map((p) => p.slug)).toEqual(["a", "c", "d", "e"]);
    expect(featured(items, 2).map((p) => p.slug)).toEqual(["a", "c"]);
  });
});

describe("byRole", () => {
  it("keeps productions with that role", () => {
    const items = [
      make("a", { roles: ["mixage", "mastering"] }),
      make("b", { roles: ["enregistrement"] }),
    ];
    expect(byRole(items, "mastering").map((p) => p.slug)).toEqual(["a"]);
    expect(byRole(items, "sonorisation")).toEqual([]);
  });
});

describe("neighbours", () => {
  const items = [make("newest"), make("middle"), make("oldest")];

  it("returns the newer and older entries", () => {
    expect(neighbours(items, "middle")).toEqual({
      previous: items[0],
      next: items[2],
    });
  });

  it("returns null at both ends and for unknown slugs", () => {
    expect(neighbours(items, "newest").previous).toBeNull();
    expect(neighbours(items, "oldest").next).toBeNull();
    expect(neighbours(items, "nope")).toEqual({ previous: null, next: null });
  });
});

describe("findDuplicateSlugs", () => {
  it("lists each duplicated slug once", () => {
    expect(
      findDuplicateSlugs([
        { slug: "b" },
        { slug: "a" },
        { slug: "b" },
        { slug: "b" },
        { slug: "a" },
      ]),
    ).toEqual(["a", "b"]);
    expect(findDuplicateSlugs([{ slug: "a" }, { slug: "b" }])).toEqual([]);
  });
});

describe("smallCovers", () => {
  it("flags covers whose shortest side is under the minimum", () => {
    const items = [
      make("ok", { cover: { width: 1400, height: 1400 } }),
      make("narrow", { cover: { width: 3000, height: 1200 } }),
      make("tiny", { cover: { width: 528, height: 528 } }),
    ];
    expect(smallCovers(items).map((p) => p.slug)).toEqual(["narrow", "tiny"]);
  });
});
