/**
 * The snake that eats the contribution graph.
 *
 * It leaves from a fixed square, walks a route that reaches every lit day, and
 * comes home — then the year is handed back and it sets off again. The route is
 * planned once, when the page loads, which is what keeps the snake continuous:
 * an earlier version hunted square by square and restarted at a random cell
 * whenever it boxed itself in, which read on screen as teleporting.
 *
 * The plan is a greedy nearest-first tour, so the order changes with the data
 * rather than sweeping column by column, and each leg picks its corner at
 * random — it turns and doubles back the way the game does, without ever
 * jumping.
 *
 * Drawn by lighting up the cells it occupies rather than by moving a separate
 * element, so there is nothing to keep in sync with the grid and nothing to
 * reposition on resize.
 *
 * Silent by default: without JavaScript, or under prefers-reduced-motion, the
 * graph is simply a graph.
 */
const STEP_MS = 48;
const START_LENGTH = 4;
const MAX_LENGTH = 16;

type Cell = { col: number; row: number };

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

  const original = cells.map((el) => el.dataset.level ?? '0');

  /** Enters from the left edge, halfway down. */
  const START: Cell = { col: 0, row: Math.floor(rows / 2) };

  /**
   * One continuous walk from START, over every lit day, back to START.
   * Squares swallowed on the way to a target are struck off, so the tour never
   * doubles back for something it already ate.
   */
  function planRoute(): Cell[] {
    const remaining = new Set<number>();
    original.forEach((level, i) => {
      if (level !== '0') remaining.add(i);
    });

    const route: Cell[] = [START];
    let at = START;

    /** Walk one leg, turning the corner in a random order so legs differ. */
    const walkTo = (goal: Cell) => {
      const horizontalFirst = Math.random() < 0.5;
      const legs: Array<'col' | 'row'> = horizontalFirst ? ['col', 'row'] : ['row', 'col'];
      for (const axis of legs) {
        while (at[axis] !== goal[axis]) {
          at = { ...at, [axis]: at[axis] + Math.sign(goal[axis] - at[axis]) };
          route.push(at);
          remaining.delete(index(at));
        }
      }
    };

    let guard = remaining.size + 8;
    while (remaining.size && guard-- > 0) {
      let nearest: Cell | null = null;
      let best = Infinity;
      for (const i of remaining) {
        const cell = { col: Math.floor(i / rows), row: i % rows };
        const d = Math.abs(cell.col - at.col) + Math.abs(cell.row - at.row);
        if (d < best) {
          best = d;
          nearest = cell;
        }
      }
      if (!nearest) break;
      walkTo(nearest);
    }

    walkTo(START);
    return route;
  }

  const route = planRoute();
  if (route.length < 2) return;

  let cursor = 0;
  /** Where the snake has been, head first — this is what gets drawn. */
  let trail: Cell[] = Array.from({ length: START_LENGTH }, () => START);
  let length = START_LENGTH;

  function paint() {
    // Tail first, so a head crossing its own trail still shows as the head.
    for (let i = trail.length - 1; i >= 0; i--) {
      const el = cells[index(trail[i]!)];
      if (!el) continue;
      if (i === 0) {
        el.dataset.snake = 'head';
        el.style.removeProperty('--seg');
      } else {
        el.dataset.snake = 'body';
        el.style.setProperty('--seg', String(Math.max(0.16, 0.78 - i * 0.05)));
      }
    }
  }

  function unpaint() {
    for (const c of trail) {
      const el = cells[index(c)];
      if (!el) continue;
      delete el.dataset.snake;
      el.style.removeProperty('--seg');
    }
  }

  function restore() {
    cells.forEach((el, i) => {
      delete el.dataset.eaten;
      el.dataset.level = original[i]!;
    });
  }

  function step() {
    unpaint();

    cursor += 1;
    if (cursor >= route.length) {
      // Home again: hand the year back and set off from the same square.
      cursor = 0;
      restore();
    }

    const head = route[cursor]!;
    trail.unshift(head);

    const el = cells[index(head)];
    if (el && el.dataset.level !== '0') {
      el.dataset.eaten = '';
      el.dataset.level = '0';
      if (length < MAX_LENGTH) length += 1;
    }

    while (trail.length > length) trail.pop();
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

  paint();

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
        }
      }
    },
    { rootMargin: '80px' }
  );
  observer.observe(grid);
}
