# CLAUDE.md

Architecture, content model and the reasons behind them: `docs/adr/001-site-architecture.md`.
Read it before changing anything structural. Local commands: `README.md`.

## Before you say it is done

Run all four, all green:

```bash
npm run format:check && npm test && npm run check && npm run build
```

## Coding rules

- KISS. The simplest code that works wins; no abstraction before the second use.
- No new dependency without a real need. No UI framework, no CSS framework.
- Logic goes in a pure function in `src/lib/`, with its test in the same folder. `.astro`
  files only fetch data and render markup.
- Only `src/lib/content.ts` imports from `astro:content` for reading entries.
- TypeScript strict. No `any`, no non-null `!` outside tests.
- Braces on every `if`, even one-liners.
- Names say what things are; a function that needs a comment to be understood needs a
  better name.
- Comments only for a non-obvious why. One line. Never restate the code.
- Errors and warnings shown to Yves are in French and name the field to fix.
- Every CSS colour, font and spacing goes through the custom properties in
  `src/styles/global.css`.
- Images go through `astro:assets` with `widths` and `sizes`. Never a raw `<img>` on a
  file from `src/assets/`.
- Client JS stays a small `<script>` in the component that needs it, calling tested
  helpers from `src/lib/`.
- Tests use real inputs; no mocks unless there is no other way.

## Content and CMS

- Every field exists in three places that change together: `.pages.yml`,
  `src/lib/schemas.ts` and the page that renders it.
- Each field in `.pages.yml` has a French label and, if it is not obvious, a short
  `description` written for Yves, not for a developer.
- Never edit `src/content/` by hand to fix a code problem; the content belongs to Yves.

## Writing style

- No emojis, no em or en dashes, no curly quotes. Straight `'` and `"` only.
- Markdown tables have aligned pipes.
- Commits: `[type] lowercase title` (types: feat, fix, test, docs, refacto, build, style,
  ci). Never push or open a pull request without asking.
