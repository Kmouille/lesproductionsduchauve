#!/usr/bin/env bash
# Usage: scripts/fetch-production-data.sh <slug> <url> [<slug> <url> ...]
# Reads Bandcamp and YouTube pages and prints title, date and cover URL per entry.
# Covers land in tmp/covers/<slug>.jpg (git-ignored), the report in tmp/report.txt.
set -euo pipefail
cd "$(dirname "$0")/.."

out=tmp
mkdir -p "$out/covers"
report="$out/report.txt"
: > "$report"

meta() { grep -o "$1" | head -1 || true; }

bandcamp() {
  local slug=$1 url=$2 html image
  html=$(curl -sL "$url")
  image=$(echo "$html" | meta '<meta property="og:image" content="[^"]*"' | sed 's/.*content="//;s/"$//')
  # _10 is the full-size variant of the cover
  image=${image//_5.jpg/_10.jpg}
  curl -sL "$image" -o "$out/covers/$slug.jpg"
  {
    echo "$slug"
    echo "  url:   $url"
    echo "  title: $(echo "$html" | meta '<meta property="og:title" content="[^"]*"')"
    echo "  date:  $(echo "$html" | meta '"datePublished":"[^"]*"')"
    echo "  cover: $image"
    echo
  } >> "$report"
}

youtube() {
  local slug=$1 url=$2 html id
  html=$(curl -sL "$url")
  id=$(echo "$url" | sed -E 's#.*(v=|youtu\.be/)([A-Za-z0-9_-]{11}).*#\2#')
  curl -sL "https://i.ytimg.com/vi/$id/maxresdefault.jpg" -o "$out/covers/$slug.jpg"
  {
    echo "$slug"
    echo "  url:   $url"
    echo "  title: $(echo "$html" | meta '<meta name="title" content="[^"]*"')"
    echo "  date:  $(echo "$html" | meta 'itemprop="uploadDate" content="[^"]*"')"
    echo
  } >> "$report"
}

while [ $# -ge 2 ]; do
  case $2 in
    *bandcamp.com*) bandcamp "$1" "$2" ;;
    *youtube.com* | *youtu.be*) youtube "$1" "$2" ;;
    *) echo "skipped $1: unsupported host $2" >&2 ;;
  esac
  shift 2
done

echo "done: $out/report.txt"
