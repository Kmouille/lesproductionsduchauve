import { z } from "astro/zod";
import type { SchemaContext } from "astro:content";
import { describe, expect, it } from "vitest";
import {
  productionSchema,
  servicesSchema,
  siteSchema,
  studioSchema,
} from "./schemas";

// Stands in for Astro's image() helper: a plain string is enough to check the path handling.
const fakeImage = (() => z.string()) as unknown as SchemaContext["image"];
const production = productionSchema(fakeImage);

const valid = {
  title: "Poetry",
  artist: "CHAUVE",
  releaseDate: "2014-02-08",
  cover: "/src/assets/productions/poetry.jpg",
  roles: ["mixage"],
  summary: "Un disque brut.",
};

const messages = (result: {
  success: boolean;
  error?: { issues: { message: string }[] };
}) => result.error?.issues.map((issue) => issue.message) ?? [];

describe("productionSchema", () => {
  it("accepts a minimal published production and fills defaults", () => {
    const data = production.parse(valid);
    expect(data.cover).toBe("../../assets/productions/poetry.jpg");
    expect(data.releaseDate).toEqual(new Date("2014-02-08"));
    expect(data.genres).toEqual([]);
    expect(data.links).toEqual([]);
    expect(data.featured).toBe(false);
    expect(data.draft).toBe(false);
  });

  it("treats blank and null optional fields written by the CMS as absent", () => {
    const data = production.parse({
      ...valid,
      link: "",
      genres: null,
      links: null,
      featured: null,
      draft: "",
    });
    expect(data.link).toBeUndefined();
    expect(data.genres).toEqual([]);
    expect(data.links).toEqual([]);
    expect(data.draft).toBe(false);
  });

  it("requires a role to publish but not for a draft", () => {
    const published = production.safeParse({ ...valid, roles: [] });
    expect(published.success).toBe(false);
    expect(messages(published)).toContain(
      "Mon rôle : cochez au moins un rôle avant de publier",
    );
    expect(
      production.safeParse({ ...valid, roles: [], draft: true }).success,
    ).toBe(true);
  });

  it("limits the summary to 200 characters", () => {
    const result = production.safeParse({ ...valid, summary: "a".repeat(201) });
    expect(messages(result)).toContain("Résumé : 200 caractères maximum");
  });

  it("accepts a listen link on any platform, rejects non web links and unknown genres", () => {
    expect(
      production.parse({ ...valid, link: " https://open.spotify.com/album/1 " })
        .link,
    ).toBe("https://open.spotify.com/album/1");
    expect(
      messages(production.safeParse({ ...valid, link: "bandcamp" })),
    ).toContain("Lien d'écoute : adresse web invalide");
    expect(production.safeParse({ ...valid, genres: ["polka"] }).success).toBe(
      false,
    );
  });

  it("rejects a blank release date instead of defaulting to 1970", () => {
    expect(
      messages(production.safeParse({ ...valid, releaseDate: null })),
    ).toContain("Date de sortie : date invalide");
  });

  it("reports invalid release dates and unknown genres in French", () => {
    expect(
      messages(production.safeParse({ ...valid, releaseDate: "pas une date" })),
    ).toContain("Date de sortie : date invalide");
    expect(
      messages(production.safeParse({ ...valid, genres: ["polka"] })),
    ).toContain("Genres : valeur inconnue");
  });

  it("validates other links", () => {
    const ok = production.parse({
      ...valid,
      links: [{ label: "Spotify", url: " https://open.spotify.com/a " }],
    });
    expect(ok.links[0].url).toBe("https://open.spotify.com/a");
    expect(
      production.safeParse({
        ...valid,
        links: [{ label: "Spotify", url: "spotify" }],
      }).success,
    ).toBe(false);
  });
});

describe("siteSchema", () => {
  it("validates the contact email", () => {
    const base = { description: "Studio", socials: [] };
    expect(
      siteSchema.safeParse({
        ...base,
        email: "lesproductionsduchauve@gmail.com",
      }).success,
    ).toBe(true);
    expect(
      siteSchema.safeParse({ ...base, email: "pas-un-email" }).success,
    ).toBe(false);
  });
});

describe("studioSchema", () => {
  const studio = studioSchema(fakeImage);

  it("coerces gear quantities and drops blank notes", () => {
    const data = studio.parse({
      intro: "<p>Studio</p>",
      gallery: null,
      gear: [
        {
          name: "Micros",
          items: [
            { name: "SM57", quantity: "4", note: "" },
            { name: "U87", quantity: "" },
          ],
        },
      ],
    });
    expect(data.gallery).toEqual([]);
    expect(data.gear[0].items).toEqual([
      { name: "SM57", quantity: 4 },
      { name: "U87" },
    ]);
  });

  it("caps the gallery at 12 photos", () => {
    const gallery = Array.from(
      { length: 13 },
      (_, i) => `/src/assets/pages/${i}.jpg`,
    );
    expect(studio.safeParse({ intro: "x", gallery, gear: [] }).success).toBe(
      false,
    );
  });

  it("reports an invalid gear quantity in French", () => {
    const result = studio.safeParse({
      intro: "x",
      gallery: [],
      gear: [
        {
          name: "Micros",
          items: [{ name: "SM57", quantity: "-2" }],
        },
      ],
    });
    expect(messages(result)).toContain(
      "Quantité : nombre entier positif attendu",
    );
  });
});

describe("servicesSchema", () => {
  const service = (id: string) => ({
    id,
    title: id,
    pitch: "p",
    description: "<p>d</p>",
  });
  const all = [
    "production",
    "enregistrement",
    "mixage",
    "mastering",
    "sonorisation",
  ].map(service);

  it("accepts exactly the five services", () => {
    expect(servicesSchema.safeParse({ services: all }).success).toBe(true);
  });

  it("rejects a missing or duplicated service", () => {
    expect(
      servicesSchema.safeParse({ services: all.slice(0, 4) }).success,
    ).toBe(false);
    expect(
      servicesSchema.safeParse({
        services: [...all.slice(0, 4), service("mixage")],
      }).success,
    ).toBe(false);
  });
});
