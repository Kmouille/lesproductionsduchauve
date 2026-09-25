import { isUrlOnHost } from "./urls";

const PLATFORMS: readonly { name: string; hosts: readonly string[] }[] = [
  { name: "Bandcamp", hosts: ["bandcamp.com"] },
  { name: "SoundCloud", hosts: ["soundcloud.com"] },
  { name: "YouTube", hosts: ["youtube.com", "youtu.be"] },
  { name: "Spotify", hosts: ["spotify.com"] },
  { name: "Deezer", hosts: ["deezer.com"] },
  { name: "Apple Music", hosts: ["music.apple.com"] },
];

export function listenLabel(url: string): string {
  const platform = PLATFORMS.find(({ hosts }) => isUrlOnHost(url, hosts));
  return platform ? `Écouter sur ${platform.name}` : "Écouter";
}
