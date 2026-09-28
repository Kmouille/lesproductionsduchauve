import { isUrlOnHost } from "./urls";

export type SocialIconKey =
  "facebook" | "instagram" | "soundcloud" | "bandcamp" | "youtube" | "generic";

const ICONS: readonly { key: SocialIconKey; hosts: readonly string[] }[] = [
  { key: "facebook", hosts: ["facebook.com"] },
  { key: "instagram", hosts: ["instagram.com"] },
  { key: "soundcloud", hosts: ["soundcloud.com"] },
  { key: "bandcamp", hosts: ["bandcamp.com"] },
  { key: "youtube", hosts: ["youtube.com", "youtu.be"] },
];

export function matchSocialIcon(url: string): SocialIconKey {
  const icon = ICONS.find(({ hosts }) => isUrlOnHost(url, hosts));
  return icon ? icon.key : "generic";
}
