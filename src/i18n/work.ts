import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLocale, locales, type Locale } from './ui';

export type WorkEntry = CollectionEntry<'work'>;

/** "en/speake" → "speake". The slug is shared by every locale. */
export function slugOf(entry: WorkEntry): string {
  return entry.id.split('/').slice(1).join('/');
}

function localeOf(entry: WorkEntry): string {
  return entry.id.split('/')[0]!;
}

/**
 * Case studies for one locale, in index order.
 *
 * Splitting each project across three Markdown files makes the prose easy to
 * edit but lets the locale-invariant fields drift apart — a stack listed in
 * English and not in Spanish, an `order` that disagrees. This asserts they
 * cannot: the build fails loudly instead of shipping a site whose Spanish
 * index is in a different order than its English one.
 */
export async function getWork(locale: Locale): Promise<WorkEntry[]> {
  const all = await getCollection('work');

  const byLocale = new Map<string, WorkEntry[]>();
  for (const entry of all) {
    const loc = localeOf(entry);
    byLocale.set(loc, [...(byLocale.get(loc) ?? []), entry]);
  }

  const reference = (byLocale.get(defaultLocale) ?? []).sort(
    (a, b) => a.data.order - b.data.order
  );
  const referenceSlugs = reference.map(slugOf);

  for (const other of locales) {
    const entries = byLocale.get(other) ?? [];
    const slugs = entries.map(slugOf).sort();

    const missing = referenceSlugs.filter((s) => !slugs.includes(s));
    const extra = slugs.filter((s) => !referenceSlugs.includes(s));
    if (missing.length || extra.length) {
      throw new Error(
        `[work] locale "${other}" is out of sync with "${defaultLocale}".` +
          (missing.length ? ` Missing: ${missing.join(', ')}.` : '') +
          (extra.length ? ` Unexpected: ${extra.join(', ')}.` : '')
      );
    }

    for (const entry of entries) {
      const ref = reference.find((r) => slugOf(r) === slugOf(entry))!;
      for (const field of ['order', 'year'] as const) {
        if (entry.data[field] !== ref.data[field]) {
          throw new Error(
            `[work] ${entry.id}: "${field}" is ${JSON.stringify(entry.data[field])} but ` +
              `${ref.id} has ${JSON.stringify(ref.data[field])}. These must match across locales.`
          );
        }
      }
      // The tags themselves may differ: product names (Java, Docker,
      // PostgreSQL) stay as they are in every locale, while descriptive terms
      // ("software testing") get translated like any other prose. What must
      // not differ is how many there are — that only ever means a dropped tag.
      if (entry.data.stack.length !== ref.data.stack.length) {
        throw new Error(
          `[work] ${entry.id}: ${entry.data.stack.length} stack tags, but ${ref.id} has ` +
            `${ref.data.stack.length}. A tag was dropped in translation.`
        );
      }
    }
  }

  return (byLocale.get(locale) ?? []).sort((a, b) => a.data.order - b.data.order);
}
