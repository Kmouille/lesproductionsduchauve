import { describe, expect, it } from "vitest";
import {
  keepAvailable,
  matches,
  parseFilterState,
  serializeFilterState,
  withFilter,
} from "./filters";

describe("parseFilterState", () => {
  it("reads known values", () => {
    expect(parseFilterState("?role=mastering&genre=punk")).toEqual({
      role: "mastering",
      genre: "punk",
    });
  });

  it("ignores unknown or empty values from shared links", () => {
    expect(parseFilterState("?role=guitare&genre=")).toEqual({
      role: null,
      genre: null,
    });
    expect(parseFilterState("")).toEqual({ role: null, genre: null });
  });
});

describe("withFilter", () => {
  const empty = { role: null, genre: null };

  it("sets and clears one key without touching the other", () => {
    const state = withFilter({ role: null, genre: "punk" }, "role", "mixage");
    expect(state).toEqual({ role: "mixage", genre: "punk" });
    expect(withFilter(state, "role", "")).toEqual({
      role: null,
      genre: "punk",
    });
  });

  it("rejects values outside the taxonomy", () => {
    expect(withFilter(empty, "genre", "polka")).toEqual(empty);
    expect(withFilter(empty, "role", undefined)).toEqual(empty);
  });
});

describe("serializeFilterState", () => {
  it("writes a query string or nothing", () => {
    expect(serializeFilterState({ role: "mixage", genre: "punk" })).toBe(
      "?role=mixage&genre=punk",
    );
    expect(serializeFilterState({ role: null, genre: null })).toBe("");
  });

  it("round-trips through parseFilterState", () => {
    const state = { role: "sonorisation", genre: null } as const;
    expect(parseFilterState(serializeFilterState(state))).toEqual(state);
  });
});

describe("matches", () => {
  const item = { roles: ["mixage", "mastering"], genres: ["punk"] };

  it("accepts everything with no filter", () => {
    expect(matches(item, { role: null, genre: null })).toBe(true);
  });

  it("requires both filters when both are set", () => {
    expect(matches(item, { role: "mastering", genre: "punk" })).toBe(true);
    expect(matches(item, { role: "mastering", genre: "doom" })).toBe(false);
    expect(matches(item, { role: "enregistrement", genre: null })).toBe(false);
  });

  it("handles cards with no genre", () => {
    expect(
      matches(
        { roles: ["mixage"], genres: [""] },
        { role: null, genre: "punk" },
      ),
    ).toBe(false);
  });
});

describe("keepAvailable", () => {
  it("drops values that have no chip on the page", () => {
    expect(
      keepAvailable(
        { role: "mixage", genre: "doom" },
        { roles: ["mixage"], genres: ["punk"] },
      ),
    ).toEqual({ role: "mixage", genre: null });
  });
});
