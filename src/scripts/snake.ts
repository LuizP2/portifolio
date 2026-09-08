/**
 * The snake that eats the contribution graph.
 *
 * It walks the calendar column by column, alternating direction, and clears
 * every cell it swallows. Drawn by lighting up the cells it occupies rather
 * than by moving a separate element, so there is nothing to keep in sync with
 * the grid and nothing to reposition on resize.
 *
 * Silent by default: without JavaScript, or under prefers-reduced-motion, the
 * graph is simply a graph.
 */
const STEP_MS = 46;
const BODY = 5;

export function initSnake(): void {
  const grid = document.querySelector<HTMLElement>('[data-commit-grid]');
  if (!grid) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const rows = Number(grid.dataset.rows ?? 7);
  const cols = Number(grid.dataset.cols ?? 0);
  const cells = Array.from(grid.querySelectorAll<HTMLElement>('.commit-cell'));
  if (!cells.length || !cols) return;

  /** Cells are laid out column by column, so this is the index arithmetic. */
  const at = (col: number, row: number) => cells[col * rows + row];

  // Serpentine: down the first column, up the next, and so on.
  const path: Array<[number, number]> = [];
  for (let col = 0; col < cols; col++) {
    for (let i = 0; i < rows; i++) {
      path.push([col, col % 2 === 0 ? i : rows - 1 - i]);
    }
  }

  const levels = cells.map((c) => c.dataset.level ?? '0');
  let step = 0;
  let last = 0;
  let running = false;
  let frame = 0;

  function paint() {
    for (let i = 0; i < BODY; i++) {
      const p = path[(step - i + path.length) % path.length];
      if (!p) continue;
      const el = at(p[0], p[1]);
      if (el) el.dataset.snake = i === 0 ? 'head' : String(i + 1);
    }
  }

  function clear() {
    for (let i = 0; i < BODY; i++) {
      const p = path[(step - i + path.length) % path.length];
      if (!p) continue;
      const el = at(p[0], p[1]);
      if (el) delete el.dataset.snake;
    }
  }

  function tick(now: number) {
    if (!running) return;
    if (now - last >= STEP_MS) {
      last = now;
      clear();
      step++;

      if (step >= path.length) {
        // A full lap: hand the year back and start again.
        step = 0;
        cells.forEach((c, i) => {
          delete c.dataset.eaten;
          c.dataset.level = levels[i]!;
        });
      }

      const head = path[step];
      if (head) {
        const el = at(head[0], head[1]);
        if (el && el.dataset.level !== '0') {
          el.dataset.eaten = '';
          el.dataset.level = '0';
        }
      }
      paint();
    }
    frame = requestAnimationFrame(tick);
  }

  // Only run while the graph is actually on screen.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !running) {
          running = true;
          last = 0;
          frame = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(frame);
          clear();
        }
      }
    },
    { rootMargin: '80px' }
  );
  observer.observe(grid);
}
