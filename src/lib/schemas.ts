import { z } from "astro/zod";
import type { SchemaContext } from "astro:content";
import { toContentRelative } from "./media";
import { GENRES, ROLES } from "./taxonomy";
import { isHttpUrl } from "./urls";

type ImageHelper = SchemaContext["image"];

const isBlank = (value: unknown) =>
  value === "" || value === null || value === undefined;
const blankToUndefined = (value: unknown) =>
  isBlank(value) ? undefined : value;
const blankToEmptyList = (value: unknown) => (isBlank(value) ? [] : value);
const blankToFalse = (value: unknown) => (isBlank(value) ? false : value);

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} : champ obligatoire`);

const httpUrl = (label: string) =>
  z.string().trim().refine(isHttpUrl, `${label} : adresse web invalide`);

const optionalHttpUrl = (label: string) =>
  z.preprocess(blankToUndefined, httpUrl(label).optional());

const cmsImage = (image: ImageHelper) =>
  z.preprocess(toContentRelative, image());

const link = z.object({
  label: requiredText("Nom du lien"),
  url: httpUrl("Adresse du lien"),
});

export const productionSchema = (image: ImageHelper) =>
  z
    .object({
      title: requiredText("Titre"),
      artist: requiredText("Artiste"),
      releaseDate: z.preprocess(
        blankToUndefined,
        z.coerce.date({ error: "Date de sortie : date invalide" }),
      ),
      cover: cmsImage(image),
      roles: z.preprocess(
        blankToEmptyList,
        z.array(z.enum(ROLES, { error: "Mon rôle : valeur inconnue" })),
      ),
      genres: z.preprocess(
        blankToEmptyList,
        z.array(z.enum(GENRES, { error: "Genres : valeur inconnue" })),
      ),
      summary: requiredText("Résumé").max(
        200,
        "Résumé : 200 caractères maximum",
      ),
      link: optionalHttpUrl("Lien d'écoute"),
      links: z.preprocess(blankToEmptyList, z.array(link)),
      featured: z.preprocess(blankToFalse, z.boolean()),
      draft: z.preprocess(blankToFalse, z.boolean()),
    })
    .refine((data) => data.draft || data.roles.length > 0, {
      message: "Mon rôle : cochez au moins un rôle avant de publier",
      path: ["roles"],
    });

export const siteSchema = z.object({
  description: requiredText("Description"),
  email: z
    .string()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email de contact invalide"),
  socials: z.preprocess(
    blankToEmptyList,
    z.array(
      z.object({
        name: requiredText("Nom du réseau"),
        url: httpUrl("Adresse du réseau"),
      }),
    ),
  ),
});

export const accueilSchema = (image: ImageHelper) =>
  z.object({
    heroImage: cmsImage(image),
    heroGenres: requiredText("Ligne des genres"),
    heroServices: requiredText("Ligne des services"),
    heroFormats: requiredText("Ligne des formats"),
    intro: requiredText("Introduction"),
  });

export const aboutSchema = (image: ImageHelper) =>
  z.object({
    title: requiredText("Titre"),
    portrait: cmsImage(image),
  });

const studioSection = (image: ImageHelper, name: string) =>
  z.object({
    text: requiredText(`Texte ${name}`),
    photos: z.preprocess(
      blankToEmptyList,
      z.array(cmsImage(image)).max(12, `Photos ${name} : 12 photos maximum`),
    ),
  });

export const studioSchema = (image: ImageHelper) =>
  z.object({
    studio: studioSection(image, "du studio"),
    gear: studioSection(image, "du matériel"),
  });

export const servicesSchema = z.object({
  services: z
    .array(
      z.object({
        id: z.enum(ROLES, { error: "Service : identifiant inconnu" }),
        title: requiredText("Titre du service"),
        pitch: requiredText("Accroche"),
        description: requiredText("Description"),
      }),
    )
    .length(ROLES.length, "Services : il doit y en avoir exactement 5")
    .refine(
      (services) =>
        new Set(services.map((service) => service.id)).size === services.length,
      "Services : chaque service doit apparaître une seule fois",
    ),
});
