# luizmedeiros.dev

Portfolio site for **Luiz Paulo Souza de Medeiros** — backend developer.
Built to the spec in [`portfolio-site-prompt.md`](./portfolio-site-prompt.md).

Two audiences on the same page: an Upwork client who is not technical, and a
Brazilian recruiter or tech lead. Plain language in the body, mono tags for the
stack — nobody loses.

## Stack

| Layer | Choice |
|---|---|
| Framework | Astro 5 (static, zero JS by default) |
| Styling | Tailwind CSS v4 — tokens in `@theme` |
| Motion | GSAP + ScrollTrigger, two primitives only |
| Content | Content Collections (Markdown) |
| Fonts | Space Grotesk / Inter / JetBrains Mono, self-hosted `woff2` |

## Commands

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # → dist/
npm run preview   # serve dist/
npm run check     # astro + TypeScript diagnostics
```

## Before going live

Identity and links live in `src/data/site.ts`. Upwork, LinkedIn and GitHub are
filled in; they also feed the `sameAs` field of the JSON-LD `Person` block. A
profile with an empty `url` renders as plain muted text, never a dead link.

The canonical origin defaults to `https://luizmedeiros.dev` and can be
overridden with a `SITE_URL` environment variable. It drives the canonical
link, the absolute Open Graph image URL and the sitemap — so while the custom
domain is not live, set `SITE_URL` to the deployed
`*.workers.dev` URL in the Cloudflare build environment variables, or the
Upwork link preview points at a domain that does not resolve. Remove it once
`luizmedeiros.dev` answers.

`public/robots.txt` hardcodes the sitemap URL; update it when the domain
changes.

## Languages

English (`/`), Portuguese (`/pt/`) and Spanish (`/es/`). Each locale is a set of
fully static pages — no client-side string swapping — so every language is
indexable, readable without JavaScript, and never mixed on one screen.

```
src/i18n/ui.ts        every interface string, per locale
src/i18n/content.ts   the specialty list and the metric band
src/i18n/work.ts      loads case studies for one locale, guards against drift
src/content/work/{en,pt,es}/*.md
```

`ui.ts` is typed: a key missing from one locale is a compile error, not a
silent fallback to English.

**Which language a visitor gets.** A saved choice wins; otherwise the browser's
own language decides; otherwise English. The inline script in `Base.astro` only
ever redirects *away from* the unprefixed English URLs — a URL that names its
language (`/pt/…`) was chosen deliberately and is left alone, which is also
what makes a redirect loop impossible. Clicking the switcher writes
`preferred-lang` to `localStorage`. With JavaScript off there is no redirect and
no persistence: visitors get English and the switcher still works, because it
is three ordinary links.

**Adding a language.** Add it to `locales` in `src/i18n/ui.ts`, add its block to
`ui` and to `src/i18n/content.ts`, add `src/content/work/<code>/*.md`, and add
it to `i18n.locales` in `astro.config.mjs`. Routes, hreflang, the sitemap and
the switcher all follow from those lists.

**The 404 page is English only.** A static host serves exactly one 404
document, so it stays in the default locale.

## Editing content

Each case study is one Markdown file per locale in
`src/content/work/<locale>/`. The four-part structure — problem / what I built
/ result / under the hood — lives in frontmatter, so no page can drift out of
shape:

```yaml
order: 1              # position in the Selected Work index
year: "2025"          # column in the index
period: "2025 → present"
title: "Speake"
summary: "Audio platform, built from zero"   # index row, one line
category: "Backend / API"
teaser: "…"           # revealed on hover in the index
problem: "…"          # plain language, no jargon
built: "…"            # plain language, no jargon
results: ["…"]        # measured numbers only
stack: ["Java 21"]    # mono tags — the jargon escape hatch
confidential: true    # adds the "architecture and results only" note
```

Adding a file adds a page at `/work/<filename>/` and a row in the index — do it
in every locale directory, or the build fails. `src/content.config.ts` catches a
missing field; `src/i18n/work.ts` catches a translation that is missing, extra,
or whose `order`/`year` disagrees with English. Stack tags may be translated
where they are descriptive ("software testing"), but product names are not, and
the number of tags has to match across locales.

Metrics in the "The Numbers" band live in `src/i18n/content.ts` and each carries
a `source` pointing at the case study it came from. Keep it that way.

## Regenerating the OG image

`public/og.png` is a 1200×630 screenshot of `scripts/og.template.html`, taken in
a real browser so the self-hosted fonts render. To redo it:

```bash
npm run build
cp scripts/og.template.html dist/__og.html
npm run preview
# open http://localhost:4321/__og.html at exactly 1200×630, screenshot the
# viewport, save as public/og.png, then delete dist/__og.html
```

## Deploy — Cloudflare Workers Builds

The project is connected to this GitHub repo through Workers Builds, so a push
to `main` builds and deploys on its own, and non-production branches get their
own preview URLs.

Dashboard settings:

| Setting | Value |
|---|---|
| Project name | `portifolio` — must match `name` in `wrangler.jsonc` |
| Build command | `npm ci && npm run build` |
| Deploy command | `npx wrangler deploy` |

`wrangler.jsonc` is what `wrangler deploy` reads. It serves `dist/` as static
assets with no Worker script, and points 404s at the generated `dist/404.html`.
`.node-version` pins Node 22 for the build. `public/_headers` is copied into
`dist/` and is honoured by Workers static assets — it sets the security headers
and immutable caching for fonts and hashed assets.

Validate the config without deploying:

```bash
npm run build
npx wrangler deploy --dry-run
```

Vercel and Netlify detect Astro on their own; build command `npm run build`,
output directory `dist`.

## Constraints this site is held to

- Lighthouse ≥ 95 in all four categories. Measured: **99 / 100 / 100 / 100**
  on `/` and on `/work/speake/`.
- Fully readable with JavaScript disabled — motion initial states are gated
  behind a `.js` class, plus a 2s watchdog that reveals everything if GSAP
  never boots.
- `prefers-reduced-motion` collapses every animation to a plain fade and stops
  the rotating badge.
- No third-party requests, no trackers, no analytics.
- One accent colour (`--color-signal`), used only for metric numbers and the
  availability status.

## What is not built yet

- **Phase 2** — the three live demos of section 7 of the spec (live REST API
  with a "Run this request" button, automation workflow, AI agent). The index
  carries a `[Demo projects]` row marked *in progress*; it links nowhere on
  purpose until the demos actually exist.
- **Phase 3, remaining** — PT-BR toggle, preloader with a `%` counter, custom
  cursor. The GSAP scroll reveals and the rotating badge are already in.
