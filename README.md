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
filled in; they also feed the `sameAs` field of the JSON-LD `Person` block.

One value is still blank — `sourceRepo`, the repository of this site itself,
linked from the footer as "Source on GitHub". Set it once the repo is pushed:

```ts
export const sourceRepo = 'https://github.com/LuizP2/<repo>';
```

A profile with an empty `url` renders as plain muted text, never a dead link.

Also set the real domain in `astro.config.mjs` (`site:`) and in
`public/robots.txt` if it is not `luizmedeiros.dev`.

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

Connect the repo and use:

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 20 or newer

`public/_headers` already sets security headers and immutable caching for fonts
and hashed assets; Cloudflare Pages and Netlify both read it. Vercel detects
Astro on its own — the same build command and output directory apply.

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
