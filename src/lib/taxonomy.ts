export const ROLES = [
  "production",
  "enregistrement",
  "mixage",
  "mastering",
  "sonorisation",
] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  production: "Production",
  enregistrement: "Enregistrement",
  mixage: "Mixage",
  mastering: "Mastering",
  sonorisation: "Sonorisation live",
};

export const GENRES = [
  "metal",
  "punk",
  "doom",
  "sludge",
  "pop",
  "folk",
  "rock",
  "garage",
  "hardcore",
  "stoner",
  "noise",
  "chanson",
  "autre",
] as const;
export type Genre = (typeof GENRES)[number];

export const GENRE_LABELS: Record<Genre, string> = {
  metal: "Metal",
  punk: "Punk",
  doom: "Doom",
  sludge: "Sludge",
  pop: "Pop",
  folk: "Folk",
  rock: "Rock",
  garage: "Garage",
  hardcore: "Hardcore",
  stoner: "Stoner",
  noise: "Noise",
  chanson: "Chanson",
  autre: "Autre",
};
