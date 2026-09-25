const CMS_ASSETS_PREFIX = "/src/assets/";

// Every content file sits two folders below src/, so ../../assets/ always lands in src/assets/.
export function toContentRelative(value: unknown): unknown {
  if (typeof value === "string" && value.startsWith(CMS_ASSETS_PREFIX)) {
    return `../../assets/${value.slice(CMS_ASSETS_PREFIX.length)}`;
  }
  return value;
}
