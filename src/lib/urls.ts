function parseHttpUrl(value: string): URL | null {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return null;
  }
  return url;
}

export function isHttpUrl(value: string): boolean {
  return parseHttpUrl(value) !== null;
}

export function isUrlOnHost(value: string, hosts: readonly string[]): boolean {
  const url = parseHttpUrl(value);
  if (!url) {
    return false;
  }
  const hostname = url.hostname.toLowerCase();
  return hosts.some(
    (host) => hostname === host || hostname.endsWith(`.${host}`),
  );
}
