import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSnake } from './snake';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Two motion primitives, nothing else.
 * (a) text rises 24px + fades in, staggered by line
 * (b) divider rules grow from 0 to full width
 * Under prefers-reduced-motion both collapse to a plain fade.
 */
function init() {
  document.documentElement.dataset.motion = 'ready';

  // (a) reveal
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((group) => {
    const children = Array.from(group.children) as HTMLElement[];
    if (!children.length) return;

    gsap.to(children, {
      y: 0,
      opacity: 1,
      duration: reduced ? 0.3 : 0.6,
      ease: 'power3.out',
      stagger: reduced ? 0 : 0.08,
      scrollTrigger: {
        trigger: group,
        start: 'top 88%',
        once: true,
      },
    });
  });

  // (b) rules
  document.querySelectorAll<HTMLElement>('[data-rule]').forEach((rule) => {
    gsap.to(rule, {
      scaleX: 1,
      duration: reduced ? 0.3 : 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: rule,
        start: 'top 95%',
        once: true,
      },
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

/** The nav takes a backdrop as soon as content can pass under it. */
function initNav() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  const sync = () => {
    if (window.scrollY > 24) nav.setAttribute('data-scrolled', '');
    else nav.removeAttribute('data-scrolled');
  };

  sync();
  window.addEventListener('scroll', sync, { passive: true });
}

initNav();
initSnake();

// Fonts and images settle after first paint — recompute trigger positions once.
window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
