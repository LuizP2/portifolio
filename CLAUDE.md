# CLAUDE.md — luizmedeiros.dev

Portfolio site for Luiz Paulo Souza de Medeiros. The full brief is in
`portfolio-site-prompt.md` — read it before changing anything structural.

## Hard rules

**Content — never invent.** Every claim, number, project and client on this
site must already exist in `portfolio-site-prompt.md`. No invented projects, no
invented clients, no invented metrics. If a URL or a fact is missing, leave the
field empty and say so — do not fill the gap with a plausible guess.

**Speake is the current employer.** Architecture and measured results only.
Never proprietary code, customer data, business secrets, or product screenshots.

**Language.** The site ships in English (`/`), Portuguese (`/pt/`) and Spanish
(`/es/`). English is the default and keeps the unprefixed URLs. Never mix two
languages on one screen — every string has an entry in each locale of
`src/i18n/ui.ts`, and a missing key is a compile error.

Body copy is written for someone who does not know what an API is. Jargon goes
in the mono `stack` tags, never in a sentence. Concretely:

| Never write | Write |
|---|---|
| "Implemented OAuth2 Resource Server" | "Built the login system — users stay signed in safely" |
| "Idempotent webhook handling" | "A customer never gets charged twice, even if the connection drops" |
| "Reduced p95 latency by 65%" | "Almost 3x faster — from 350 milliseconds to 120" |

These rules hold in all three languages. In the `stack` tags, product names
(Java, Docker, PostgreSQL) stay as they are everywhere; descriptive terms
("software testing") are translated like any other prose.

**Typography.**
1. Mono (`label`) never appears in a paragraph — labels, tags, numbering and
   metadata only.
2. Body copy is weight 400 at 18px, `line-height` 1.7, max 62ch.
3. No paragraph runs longer than three lines. If it does, split it or make it
   a list.

**Motion.** Two primitives, nothing else: text rises 24px and fades in
(staggered, 600ms, `power3.out`), and divider rules grow from 0 to full width.
No Three.js, no WebGL, no 3D. See `src/scripts/motion.ts`.

**Colour.** One accent — `--color-signal` (#C8FF3D) — used only on metric
numbers and the availability status. Never add a second accent. The hero
portrait is monochrome for the same reason: colour in the photograph would be a
second accent by the back door.

**The hero follows `reference/Hero.png`**, which departs from section 5.2 of the
brief: sentence-case headline at a lighter weight (`display-hero`) instead of
the giant uppercase `display`, a portrait on the right, specialty chips instead
of a right-aligned list, and no rotating badge. The rest of the site still uses
`display`. The hero also carries `positioning.headline`, so the section below it
prints only `positioning.body` — that sentence must never appear twice on one
page.

**No contact form.** The email address is the call to action.

## Architecture

```
src/
  content/work/{en,pt,es}/*.md   one case study per locale; frontmatter holds
                                 the four fixed sections
  i18n/ui.ts             every interface string, per locale (typed)
  i18n/content.ts        specialty list and metric band, per locale
  i18n/work.ts           loads case studies for a locale; guards drift
  data/site.ts           identity and links only — nothing translatable
  styles/global.css      @font-face, @theme tokens, typographic utilities
  scripts/motion.ts      GSAP + ScrollTrigger, the two primitives
  components/            one per section; each takes a `lang` prop
  layouts/Base.astro     head, SEO, hreflang, JSON-LD, language routing
  pages/index.astro      English home; [lang]/index.astro covers pt and es
  pages/work/[...slug]   English case study; [lang]/work/[...slug] the rest
```

Metrics in `src/i18n/content.ts` each carry a `source` field naming the case
study they came from. Keep that link intact — it is what makes the numbers
auditable.

## Before shipping a change

```bash
npm run build     # the content schema fails the build on a malformed case study
npm run preview
```

Then confirm: readable with JavaScript disabled, `prefers-reduced-motion`
collapses the animations, no horizontal scroll at 360px, Lighthouse still ≥95
in all four categories, and every locale renders — `/`, `/pt/`, `/es/`.
