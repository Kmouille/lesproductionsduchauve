import { existsSync, readFileSync } from "node:fs";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import { GENRES, ROLES } from "./taxonomy";

type Field = { name: string; options?: { values?: { name: string }[] } };
type Content = { name: string; type: string; path: string; fields: Field[] };
type Config = { media: { name: string; output: string }[]; content: Content[] };

const config = parse(readFileSync(".pages.yml", "utf8")) as Config;
const productionFields = config.content.find(
  (entry) => entry.name === "productions",
)!.fields;
const selectValues = (name: string) =>
  productionFields
    .find((field) => field.name === name)
    ?.options?.values?.map((value) => value.name);

describe(".pages.yml", () => {
  it("offers exactly the roles and genres the schema accepts", () => {
    expect(selectValues("roles")).toEqual([...ROLES]);
    expect(selectValues("genres")).toEqual([...GENRES]);
  });

  it("writes image paths the schemas know how to resolve", () => {
    for (const media of config.media) {
      expect(
        media.output === "/media" || media.output.startsWith("/src/assets/"),
      ).toBe(true);
    }
  });

  it("points every single-file entry to a file that exists", () => {
    for (const entry of config.content.filter((item) => item.type === "file")) {
      expect(existsSync(entry.path), entry.path).toBe(true);
    }
  });
});
