# Backlog - Music platform players (Bandcamp, SoundCloud)

Status: parked. Today a production has one `link` shown as an "Écouter sur ..." button
(ADR 001). This note keeps what we learned so the next attempt starts from facts.

## Goal

Let a visitor hear a track on the production page without leaving the site, while keeping
the page fast, private by default and editable by Yves with a single pasted URL.

## Flaws met during the first attempt

### Bandcamp

| Problem                          | Detail                                                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| No ID in the URL                 | The player needs a numeric album or track ID that the public URL does not contain                                                          |
| No official API or oEmbed        | The ID must be scraped from the release page HTML                                                                                          |
| Build depends on Bandcamp        | Scraping at build time makes every deploy fail or slow down if Bandcamp is down                                                            |
| Network blocked locally          | Sandboxed tools could not fetch the pages; a saved HTML fixture was needed                                                                 |
| Exclusive embeds                 | Some releases only allow the player on domains the artist whitelisted                                                                      |
| Artwork served with a wrong type | Some originals are PNG files behind a `.jpg` URL                                                                                           |
| Messy metadata                   | JSON-LD descriptions can be a bare URL; the artist is sometimes the label account ("Les Productions du Chauve") or a mix of band and title |

### SoundCloud

| Problem              | Detail                                                                        |
| -------------------- | ----------------------------------------------------------------------------- |
| Accounts per band    | No single studio account; each band posts on its own profile, or not at all   |
| Needs a network call | oEmbed returns the iframe code, so either a build-time fetch or a runtime one |
| Heavy widget         | The iframe pulls its own JS and cookies before the visitor presses play       |

### Both

- Third-party iframes set cookies, which brings a consent banner question (GDPR).
- Each player adds weight that works against the Lighthouse 95+ goal.
- Two platforms means two code paths, two parsers and two sets of fixtures, for a benefit
  the plain link already covers.

## Directions to explore

1. **Click to load.** Render the cover and a play button; build the iframe only on click.
   Nothing third-party loads before consent. Same pattern as the YouTube note.
2. **ID pasted by Yves.** Bandcamp shows the embed code under "Share / Embed". An optional
   field "Code du lecteur Bandcamp" avoids scraping. Cost: one more step for Yves.
3. **Scrape once, store the ID.** A script (not the build) reads `bc-page-properties` and
   writes the ID into the production file. The build stays offline.
4. **SoundCloud oEmbed at edit time**, same idea: resolve once, store the result.

Whichever path, keep the parsing in a pure module in `src/lib/` with saved HTML fixtures.

## Resources

- Bandcamp help, creating an embedded player: https://get.bandcamp.help/hc/en-us/articles/23020711574423-How-do-I-create-a-Bandcamp-embedded-player
- `bandcamp-player` web component, with notes on finding the ID (`bc-page-properties`): https://github.com/jgarber623/bandcamp-player
- Iframely Bandcamp embeds (a third-party oEmbed stand-in): https://iframely.com/domains/bandcamp
- SoundCloud oEmbed: https://developers.soundcloud.com/docs/oembed
- SoundCloud Widget API: https://developers.soundcloud.com/docs/api/html5-widget
