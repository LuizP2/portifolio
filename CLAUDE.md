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

**Language.** Body copy is written for someone who does not know what an API is.
Jargon goes in the mono `stack` tags, never in a sentence. Concretely:

| Never write | Write |
|---|---|
| "Implemented OAuth2 Resource Server" | "Built the login system — users stay signed in safely" |
| "Idempotent webhook handling" | "A customer never gets charged twice, even if the connection drops" |
| "Reduced p95 latency by 65%" | "Almost 3x faster — from 350 milliseconds to 120" |

English is the default. Never mix English and Portuguese on the same screen.

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
numbers and the availability status. Never add a second accent.

**No contact form.** The email address is the call to action.

## Architecture

```
src/
  content/work/*.md      one case study per file; frontmatter holds the
                         four fixed sections (schema in content.config.ts)
  data/site.ts           identity, links, specialties, metrics, "how I work"
  styles/global.css      @font-face, @theme tokens, typographic utilities
  scripts/motion.ts      GSAP + ScrollTrigger, the two primitives
  components/            one per section of the page
  layouts/Base.astro     head, SEO, JSON-LD, the .js motion gate
  pages/index.astro      section order
  pages/work/[...slug]   case study template
```

Metrics in `src/data/site.ts` each carry a `source` field naming the case study
they came from. Keep that link intact — it is what makes the numbers auditable.

## Before shipping a change

```bash
npm run build     # the content schema fails the build on a malformed case study
npm run preview
```

Then confirm: readable with JavaScript disabled, `prefers-reduced-motion`
collapses the animations, no horizontal scroll at 360px, and Lighthouse still
≥95 in all four categories.
