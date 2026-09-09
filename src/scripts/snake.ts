/**
 * The snake that eats the contribution graph.
 *
 * It plays the game rather than tracing a route: it picks a lit square, hunts
 * it, turns when it has to, changes its mind on the way, and grows with every
 * square it swallows. A serpentine sweep covers the board faster but reads as
 * a wipe effect, not as a snake.
 *
 * Drawn by lighting up the cells it occupies rather than by moving a separate
 * element, so there is nothing to keep in sync with the grid and nothing to
 * reposition on resize.
 *
 * Silent by default: without JavaScript, or under prefers-reduced-motion, the
 * graph is simply a graph.
 */
const STEP_MS = 58;
const START_LENGTH = 4;
const MAX_LENGTH = 14;

/** How often it takes a legal turn that is not the best one. */
const WANDER = 0.3;
/** How often it abandons the square it was hunting and picks another. */
const DISTRACTION = 0.02;
/** Nearest candidates it will consider as the next target. */
const SHORTLIST = 6;

type Cell = { col: number; row: number };

const DIRS: ReadonlyArray<Cell> = [
  { col: 1, row: 0 },
  { col: -1, row: 0 },
  { col: 0, row: 1 },
  { col: 0, row: -1 },
];

const pick = <T>(list: T[]): T | undefined => list[Math.floor(Math.random() * list.length)];

export function initSnake(): void {
  const grid = document.querySelector<HTMLElement>('[data-commit-grid]');
  if (!grid) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const rows = Number(grid.dataset.rows ?? 7);
  const cols = Number(grid.dataset.cols ?? 0);
  const cells = Array.from(grid.querySelectorAll<HTMLElement>('.commit-cell'));
  if (!cells.length || !cols) return;

  /** Cells are laid out column by column, so this is the index arithmetic. */
  const index = (c: Cell) => c.col * rows + c.row;
  const elementAt = (c: Cell) => cells[index(c)];
  const inside = (c: Cell) => c.col >= 0 && c.col < cols && c.row >= 0 && c.row < rows;

  const original = cells.map((el) => el.dataset.level ?? '0');

  /**
   * Indices of squares still standing. Kept as a set rather than rescanned,
   * because the snake picks a fresh target on nearly every bite and a full
   * sweep of the year per bite is work the main thread does not need to do.
   */
  let lit = new Set<number>();
  const resetLit = () => {
    lit = new Set(original.flatMap((l, i) => (l === '0' ? [] : [i])));
  };
  resetLit();

  let body: Cell[] = [];
  let target: Cell | null = null;
  let growth = 0;

  const toCell = (i: number): Cell => ({ col: Math.floor(i / rows), row: i % rows });

  function distance(a: Cell, b: Cell) {
    return Math.abs(a.col - b.col) + Math.abs(a.row - b.row);
  }

  function randomLit(): Cell | null {
    if (!lit.size) return null;
    let n = Math.floor(Math.random() * lit.size);
    for (const i of lit) if (n-- === 0) return toCell(i);
    return null;
  }

  /** Usually one of the nearest squares, but not always — a perfect hunter looks scripted. */
  function chooseTarget(): Cell | null {
    if (!lit.size) return null;
    const head = body[0];
    if (!head) return randomLit();
    if (Math.random() < 0.25) return randomLit();

    // Keep the closest few in one pass, no sort and no array of the whole year.
    const best: Array<{ cell: Cell; d: number }> = [];
    for (const i of lit) {
      const cell = toCell(i);
      const d = distance(head, cell);
      if (best.length < SHORTLIST) {
        best.push({ cell, d });
        continue;
      }
      let worst = 0;
      for (let k = 1; k < best.length; k++) if (best[k]!.d > best[worst]!.d) worst = k;
      if (d < best[worst]!.d) best[worst] = { cell, d };
    }
    return pick(best)?.cell ?? null;
  }

  function occupied(): Set<number> {
    // The tail vacates its cell on the same tick, unless the snake is growing.
    const upto = growth > 0 ? body.length : body.length - 1;
    const set = new Set<number>();
    for (let i = 0; i < upto; i++) set.add(index(body[i]!));
    return set;
  }

  function spawn() {
    const col = Math.floor(Math.random() * cols);
    const row = Math.floor(Math.random() * rows);
    body = Array.from({ length: START_LENGTH }, () => ({ col, row }));
    growth = 0;
    target = chooseTarget();
  }

  function restore() {
    resetLit();
    cells.forEach((el, i) => {
      delete el.dataset.eaten;
      el.dataset.level = original[i]!;
    });
  }

  function nextHead(): Cell | null {
    const head = body[0]!;
    const neck = body[1];
    const blocked = occupied();

    const legal = DIRS.map((d) => ({ col: head.col + d.col, row: head.row + d.row }))
      .filter(inside)
      .filter((c) => !(neck && c.col === neck.col && c.row === neck.row))
      .filter((c) => !blocked.has(index(c)));

    if (!legal.length) return null;
    if (!target) return pick(legal) ?? null;

    if (Math.random() < WANDER) return pick(legal) ?? null;

    const best = legal.sort((a, b) => distance(a, target!) - distance(b, target!));
    return best[0] ?? null;
  }

  function paint() {
    for (let i = 0; i < body.length; i++) {
      const el = elementAt(body[i]!);
      if (!el) continue;
      if (i === 0) {
        el.dataset.snake = 'head';
      } else {
        el.dataset.snake = 'body';
        el.style.setProperty('--seg', String(Math.max(0.16, 0.78 - i * 0.06)));
      }
    }
  }

  function unpaint() {
    for (const c of body) {
      const el = elementAt(c);
      if (!el) continue;
      delete el.dataset.snake;
      el.style.removeProperty('--seg');
    }
  }

  function step() {
    unpaint();

    if (Math.random() < DISTRACTION) target = chooseTarget();

    const head = nextHead();
    if (!head) {
      // Boxed in by its own body — start over without disturbing the board.
      spawn();
      paint();
      return;
    }

    body.unshift(head);

    const i = index(head);
    if (lit.has(i)) {
      lit.delete(i);
      const el = cells[i];
      if (el) {
        el.dataset.eaten = '';
        el.dataset.level = '0';
      }
      if (body.length < MAX_LENGTH) growth += 1;
      target = chooseTarget();
      if (!target) {
        // The whole year is eaten — hand it back and keep playing.
        restore();
        target = chooseTarget();
      }
    }

    if (growth > 0) growth -= 1;
    else body.pop();

    paint();
  }

  let running = false;
  let frame = 0;
  let last = 0;

  function loop(now: number) {
    if (!running) return;
    if (now - last >= STEP_MS) {
      last = now;
      step();
    }
    frame = requestAnimationFrame(loop);
  }

  spawn();

  // Only run while the graph is actually on screen.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !running) {
          running = true;
          last = 0;
          frame = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(frame);
          unpaint();
        }
      }
    },
    { rootMargin: '80px' }
  );
  observer.observe(grid);
}
