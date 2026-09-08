/**
 * Pulls the real GitHub contribution calendar and writes it to
 * src/data/contributions.json.
 *
 * The graph on the site claims to show a year of commits, so it shows a year of
 * commits — nothing on this site is invented, and a decorative grid pretending
 * to be activity would be exactly that. The result is committed so a build never
 * depends on the network, and on GitHub being up.
 *
 *   node scripts/fetch-contributions.mjs
 */
import { writeFileSync } from 'node:fs';

const LOGIN = process.env.GITHUB_LOGIN || 'LuizP2';
const OUT = 'src/data/contributions.json';

const res = await fetch(`https://github.com/users/${LOGIN}/contributions`, {
  headers: { Accept: 'text/html', 'User-Agent': 'luizmedeiros.dev build' },
});
if (!res.ok) throw new Error(`GitHub returned ${res.status}`);
const html = await res.text();

/** Each day is a <td> carrying its weekday row, week column, date and level. */
const days = [];
const cell = /id="contribution-day-component-(\d+)-(\d+)"[^>]*data-level="(\d)"/g;
const dated = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="contribution-day-component-(\d+)-(\d+)"/g;

const dates = new Map();
for (const m of html.matchAll(dated)) dates.set(`${m[2]}-${m[3]}`, m[1]);
for (const m of html.matchAll(cell)) {
  const [row, col, level] = [Number(m[1]), Number(m[2]), Number(m[3])];
  days.push({ row, col, level, date: dates.get(`${row}-${col}`) ?? null });
}
if (!days.length) throw new Error('No contribution cells found — GitHub markup changed.');

const cols = Math.max(...days.map((d) => d.col)) + 1;
const rows = 7;

// weeks[col][row] — the shape the calendar is drawn in.
const weeks = Array.from({ length: cols }, () => Array(rows).fill(0));
for (const d of days) if (d.row < rows) weeks[d.col][d.row] = d.level;

const withDate = days.filter((d) => d.date).map((d) => d.date).sort();
const activeDays = days.filter((d) => d.level > 0).length;

writeFileSync(
  OUT,
  JSON.stringify(
    {
      login: LOGIN,
      fetchedAt: new Date().toISOString().slice(0, 10),
      from: withDate[0] ?? null,
      to: withDate[withDate.length - 1] ?? null,
      activeDays,
      weeks,
    },
    null,
    2
  ) + '\n'
);

console.log(`${OUT} — ${cols} weeks, ${days.length} days, ${activeDays} with activity`);
