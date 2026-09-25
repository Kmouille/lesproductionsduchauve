# ADR 001 - Static Astro site edited with Pages CMS

- Status: accepted
- Date: 2026-09-25

## Context

Les Productions du Chauve is the sound studio of Yves De Roeck (production, recording,
mixing, mastering, live sound), mostly punk, metal and rock bands. The site promotes the
studio and shows the portfolio as a grid of album covers.

Yves is a sound engineer, not a developer. He must be able to:

- publish a production (cover, platform link, short text) in under 5 minutes, without Git;
- edit the biography, studio, gear and services pages himself.

Other requirements: French only, free tooling, very fast pages (Lighthouse 95+ everywhere),
raw punk look but sober, and a broken content entry must never take the live site down.

Out of scope: contact form, blog, prices, multiple languages, analytics, custom domain.

## Decision

### Stack

| Concern   | Choice                                                                     |
| --------- | -------------------------------------------------------------------------- |
| Framework | Astro, static output, no adapter, no UI framework                          |
| Styling   | Plain CSS: custom properties in `src/styles/global.css` plus scoped styles |
| Fonts     | Astro Fonts API, Saira Extra Condensed (300, 700) self-hosted, `system-ui` |
| Images    | `astro:assets`, originals kept untouched in `src/assets/`                  |
| CMS       | Pages CMS (GitHub app), configured in `.pages.yml`                         |
| Hosting   | Netlify: `main` deploys to production, pull requests get Deploy Previews   |
| Quality   | Vitest, `astro check`, Prettier, GitHub Actions CI                         |
| Runtime   | Node 24 (`.nvmrc`), npm                                                    |

### Pages

| URL                   | Content                                                              |
| --------------------- | -------------------------------------------------------------------- |
| `/`                   | Hero with Yves's photo, intro, featured covers (up to 4), services   |
| `/productions/`       | Cover grid, newest first, role and genre filters, hover cards        |
| `/productions/[slug]` | Zoomable cover, tags, summary, text, listen button, other links, nav |
| `/services`           | 5 anchored sections, each with up to 4 productions for that role     |
| `/studio`             | Intro, photo gallery, gear sheet by category                         |
| `/qui-suis-je`        | Portrait and story                                                   |
| `#contact`            | Footer on every page: email and social links                         |
| `/404`                | Styled, `noindex`                                                    |

Generated: `sitemap-index.xml` and `robots.txt`.

### Content model

All content lives in `src/content/` and is validated by Zod schemas in `src/lib/schemas.ts`.

| Content     | File                               | Pages CMS  |
| ----------- | ---------------------------------- | ---------- |
| Productions | `src/content/productions/*.md`     | collection |
| Settings    | `src/content/pages/site.yml`       | file       |
| Home        | `src/content/pages/accueil.yml`    | file       |
| About       | `src/content/pages/qui-suis-je.md` | file       |
| Studio      | `src/content/pages/studio.yml`     | file       |
| Services    | `src/content/pages/services.yml`   | file       |

A production has: `title`, `artist`, `releaseDate` (only the year is shown), `cover`,
`roles` (at least one to publish), `genres` (fixed list), `summary` (200 characters max),
`link` (one listen URL on any platform), `links` (other buttons), `featured`, `draft` and a
rich-text body. The slug comes from artist and title, not from the filename, and duplicates
fail the build.

Roles and genres are defined once in `src/lib/taxonomy.ts` and repeated in `.pages.yml`; a
test keeps both lists identical.

Images uploaded from the CMS land in `src/assets/` so Astro optimizes them. Pages CMS writes
`/src/assets/...`; the schemas rewrite it to `../../assets/...`, the path relative to the
content file that Astro's `image()` helper expects. Images inside rich text go to
`public/media/` and are served as is.

### Error handling

- An invalid entry fails the build with a French message naming the field. Netlify keeps
  the previous deploy online.
- Drafts are excluded from production builds and shown with a "Brouillon" badge in dev.
- A cover under 1400 px on its shortest side prints a build warning, not an error.

### Visual design

Direction "Photocopie": pure black background (`#000`), warm cream text (`#ecead9`), muted
greys, no accent colour. Emphasis uses cream fills with black text. Bold uppercase Saira for
names and headings, light Saira for taglines. Single dark theme. The logo (face in a cream
circle) drives the favicon and the default share image through `npm run brand`.

### Behaviour

- Filters: two chip groups (role, genre), applied client side on data attributes. Every
  card is in the HTML, so the page works without JS and is fully indexed. The active filter
  is kept in the query string so a filtered view can be shared.
- Cover card: on hover or keyboard focus the cover turns greyscale and a dark overlay
  fades in with artist, summary, year and roles. A tap on touch devices opens the page.
- Cover viewer: native `<dialog>`, 2400 px image at quality 90 loaded on demand, closes on
  Escape, backdrop click or close button.
- Listen link: one button labelled after the platform ("Écouter sur Bandcamp"), generic
  "Écouter" for unknown hosts. The site loads nothing from third-party platforms.

### Performance and SEO

- Zero JS by default. Scripts only for the filters and the viewer.
- Responsive `srcset` (AVIF and WebP), explicit dimensions, lazy loading below the fold, hero
  image eager with `fetchpriority="high"`.
- `/_astro/*` is served with a one-year immutable cache.
- Per-page title and description, Open Graph tags (a production uses its cover),
  `MusicAlbum` JSON-LD on production pages.

### Code organisation

| Path                     | Role                                                         |
| ------------------------ | ------------------------------------------------------------ |
| `src/lib/*.ts`           | Pure logic, unit tested next to the code (`*.test.ts`)       |
| `src/lib/content.ts`     | The only bridge between `astro:content` and the pure modules |
| `src/content.config.ts`  | Collections wired to the schemas                             |
| `src/components/`        | Header, Footer, Seo, CoverCard, CoverViewer, GearSheet       |
| `src/layouts/Base.astro` | HTML shell, fonts, header, footer                            |
| `src/pages/`             | Routes                                                       |
| `scripts/`               | Maintenance scripts run by hand (`npm run brand`)            |

## Alternatives rejected

| Option                                         | Why not                                                                                                               |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Keep the AstroPaper blog theme                 | Blog-shaped, heavy (React, Tailwind, search), fights the design                                                       |
| Tailwind or a UI framework                     | A few hundred lines of CSS do the job with zero runtime                                                               |
| Embedded Bandcamp, SoundCloud, YouTube players | Third-party weight and trackers, fragile IDs, see `docs/backlog/`                                                     |
| 3D flip cards                                  | More CSS and browser quirks than a hover overlay, hides the artwork                                                   |
| Build-time import from Bandcamp                | Network at build time, scraping; the one-off import was done once                                                     |
| Netlify Lighthouse plugin                      | Heavy dev dependencies with known advisories, ran on every deploy. Scores are checked by hand with PageSpeed Insights |

## Consequences

- Yves edits everything from Pages CMS; each save is a commit on `main` and a deploy.
- Adding a field means changing `.pages.yml`, `src/lib/schemas.ts` and the page that shows
  it, together.
- Adding a role or a genre means changing `src/lib/taxonomy.ts` and `.pages.yml`; the test
  fails until both match.
- No server, no database, no runtime cost. Everything in production is a static file.
- Richer platform integrations stay possible later without changing the content model: the
  `link` field already holds the URL.
