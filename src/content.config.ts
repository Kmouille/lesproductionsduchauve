import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import {
  aboutSchema,
  accueilSchema,
  productionSchema,
  servicesSchema,
  siteSchema,
  studioSchema,
} from "./lib/schemas";

const page = (pattern: string) =>
  glob({ base: "./src/content/pages", pattern });

export const collections = {
  productions: defineCollection({
    loader: glob({ base: "./src/content/productions", pattern: "**/*.md" }),
    schema: ({ image }) => productionSchema(image),
  }),
  site: defineCollection({ loader: page("site.yml"), schema: siteSchema }),
  accueil: defineCollection({
    loader: page("accueil.yml"),
    schema: ({ image }) => accueilSchema(image),
  }),
  about: defineCollection({
    loader: page("qui-suis-je.md"),
    schema: ({ image }) => aboutSchema(image),
  }),
  studio: defineCollection({
    loader: page("studio.yml"),
    schema: ({ image }) => studioSchema(image),
  }),
  services: defineCollection({
    loader: page("services.yml"),
    schema: servicesSchema,
  }),
};
