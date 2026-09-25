# Backlog - YouTube videos

Status: idea. Yves films live sessions and posts them on https://www.youtube.com/@YvesDeRoeck.
Today a YouTube URL can go in `link` or `links` and shows as a button.

## Goal

Show a video on a production page (and maybe a "Sessions live" block on the home page)
without paying YouTube's weight until the visitor presses play.

## Constraints

- A plain YouTube iframe loads 1 to 2 MB of JS on page load and sets cookies.
- Lighthouse 95+ must hold on every page.
- Yves only pastes a URL; the site derives everything else.

## Proposed approach

1. Add an optional `video` field (string URL) to productions in `.pages.yml` and
   `src/lib/schemas.ts`.
2. A pure `youtubeId(url)` in `src/lib/` that accepts `watch?v=`, `youtu.be/`, `shorts/`,
   `live/` and `embed/` forms and returns the 11-character ID or `undefined`. Tested with
   real URLs.
3. A `Video.astro` component: poster image and play button, and the
   `youtube-nocookie.com/embed/<id>?autoplay=1` iframe built only on click.
4. Poster: `https://i.ytimg.com/vi/<id>/hqdefault.jpg`, or the production cover to stay
   fully offline.

Options for step 3:

| Option                    | Pros                                     | Cons                         |
| ------------------------- | ---------------------------------------- | ---------------------------- |
| Own component (20 lines)  | No dependency, full control of the style | We maintain it               |
| `lite-youtube-embed`      | Battle tested, tiny                      | One more dependency, its CSS |
| `astro-embed` `<YouTube>` | Ready-made for Astro                     | Pulls a package family       |

The first option fits CLAUDE.md best.

## Resources

- lite-youtube-embed: https://github.com/paulirish/lite-youtube-embed
- Astro Embed YouTube component: https://astro-embed.netlify.app/components/youtube/
- Click-to-load pattern in Astro: https://www.luckymedia.dev/blog/building-a-high-performance-youtube-embed-in-astro
