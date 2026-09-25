import { describe, expect, it } from "vitest";
import { productionSlug, slugify } from "./slug";

describe("slugify", () => {
  it("lowercases, strips accents and apostrophes", () => {
    expect(slugify("C'est mort pour la gloire")).toBe(
      "cest-mort-pour-la-gloire",
    );
    expect(slugify("Été Brûlé")).toBe("ete-brule");
    expect(slugify("L\u2019Été")).toBe("lete");
  });

  it("expands French ligatures and strips every apostrophe variant", () => {
    expect(slugify("Cœur de Sœurs")).toBe("coeur-de-soeurs");
    expect(slugify("Æther Straße")).toBe("aether-strasse");
    expect(slugify("L\u2018Été l\u02bcamour")).toBe("lete-lamour");
  });

  it("turns & into et and collapses symbols", () => {
    expect(slugify("Ben & Fist")).toBe("ben-et-fist");
    expect(slugify("TRHOLZ [live @ la Cave à Rock]")).toBe(
      "trholz-live-la-cave-a-rock",
    );
    expect(slugify("  --All the fatswines-- ")).toBe("all-the-fatswines");
  });

  it("returns an empty string when nothing is left", () => {
    expect(slugify("!!! ???")).toBe("");
  });
});

describe("productionSlug", () => {
  it("joins artist and title", () => {
    expect(productionSlug("Molly McHarrel", "C'est mort pour la gloire")).toBe(
      "molly-mcharrel-cest-mort-pour-la-gloire",
    );
  });

  it("does not repeat the artist when the title already starts with it", () => {
    expect(
      productionSlug(
        "Molly McHarrel",
        "Molly McHarrel - C'est mort pour la gloire",
      ),
    ).toBe("molly-mcharrel-cest-mort-pour-la-gloire");
  });

  it("falls back to whichever part is not empty", () => {
    expect(productionSlug("???", "Poetry")).toBe("poetry");
  });

  it("throws a French message when both parts are empty", () => {
    expect(() => productionSlug("???", "!!!")).toThrow(/adresse/);
  });
});
