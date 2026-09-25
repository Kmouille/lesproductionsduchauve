import { GENRES, ROLES, type Genre, type Role } from "./taxonomy";

export interface FilterState {
  role: Role | null;
  genre: Genre | null;
}

export type FilterKey = keyof FilterState;

const isRole = (value: unknown): value is Role =>
  (ROLES as readonly unknown[]).includes(value);
const isGenre = (value: unknown): value is Genre =>
  (GENRES as readonly unknown[]).includes(value);

export function parseFilterState(search: string): FilterState {
  const params = new URLSearchParams(search);
  const role = params.get("role");
  const genre = params.get("genre");
  return {
    role: isRole(role) ? role : null,
    genre: isGenre(genre) ? genre : null,
  };
}

export function withFilter(
  state: FilterState,
  key: FilterKey,
  value: string | undefined,
): FilterState {
  if (key === "role") {
    return { ...state, role: isRole(value) ? value : null };
  }
  return { ...state, genre: isGenre(value) ? value : null };
}

export function serializeFilterState(state: FilterState): string {
  const params = new URLSearchParams();
  if (state.role) {
    params.set("role", state.role);
  }
  if (state.genre) {
    params.set("genre", state.genre);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function matches(
  item: { roles: readonly string[]; genres: readonly string[] },
  state: FilterState,
): boolean {
  const roleOk = !state.role || item.roles.includes(state.role);
  const genreOk = !state.genre || item.genres.includes(state.genre);
  return roleOk && genreOk;
}

export function keepAvailable(
  state: FilterState,
  available: { roles: readonly string[]; genres: readonly string[] },
): FilterState {
  return {
    role:
      state.role && available.roles.includes(state.role) ? state.role : null,
    genre:
      state.genre && available.genres.includes(state.genre)
        ? state.genre
        : null,
  };
}
