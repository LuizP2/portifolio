import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Every case study renders through the same fixed four-part structure:
 * problem → what I built → result → under the hood.
 * Keeping those parts in frontmatter is what guarantees no page drifts.
 */
const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
  schema: z.object({
    order: z.number(),
    year: z.string(),
    period: z.string(),
    title: z.string(),
    /** Shown in the index row — one line, no jargon. */
    summary: z.string(),
    category: z.string(),
    /** Revealed on hover in the index. */
    teaser: z.string(),
    problem: z.string(),
    built: z.string(),
    results: z.array(z.string()).min(1),
    stack: z.array(z.string()).min(1),
    confidential: z.boolean().default(false),
  }),
});

export const collections = { work };
