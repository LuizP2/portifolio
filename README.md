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
domain is not live, set `SITE_URL` to the `*.pages.dev` URL in the Cloudflare
Pages environment variables, or the Upwork link preview points at a domain that
does not resolve. Remove it once `luizmedeiros.dev` answers.

`public/robots.txt` hardcodes the sitemap URL; update it when the domain
changes.

## Editing content

Each case study is one Markdown file in `src/content/work/`. The four-part
structure — problem / what I built / result / under the hood — lives in
frontmatter, so no page can drift out of shape:

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

Adding a file adds a page at `/work/<filename>/` and a row in the index. The
schema in `src/content.config.ts` fails the build if a field is missing.

Metrics in the "The Numbers" band live in `src/data/site.ts` and each carries a
`source` pointing at the case study it came from. Keep it that way.

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

## Deploy — Cloudflare Pages

The project is connected to this GitHub repo, so a push to `main` builds and
deploys on its own, and every pull request gets a preview URL.

Build settings:

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(empty)* |

`.node-version` pins Node 22 for the build. `public/_headers` sets the security
headers and immutable caching for fonts and hashed assets — Cloudflare Pages
and Netlify both read it. Vercel detects Astro on its own; the same build
command and output directory apply.

There is deliberately no `wrangler.toml`: on a Git-connected Pages project its
`name` must match the project name in the dashboard, and a mismatch fails the
build. Add one only if you switch to direct uploads
(`npx wrangler pages deploy dist`).

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
