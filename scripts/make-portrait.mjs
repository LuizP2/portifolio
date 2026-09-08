/**
 * Bakes the hero portrait's look: monochrome, contrast up, exposure down, so it
 * sits inside the site's palette instead of fighting it.
 *
 * Done at author time rather than with CSS filters so the browser never pays to
 * repaint a full-height image, and so the committed asset is the asset that
 * ships. Re-run after replacing portrait-source.jpg:
 *
 *   node scripts/make-portrait.mjs
 */
import sharp from 'sharp';

const SOURCE = 'src/assets/portrait-source.jpg';
const OUT = 'src/assets/portrait.jpg';

await sharp(SOURCE)
  .grayscale()
  // contrast up, black point down — the colourful mural behind him falls away,
  // his face stays the brightest thing in the frame
  .linear(1.3, -96)
  .gamma(1.06)
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(OUT);

const { width, height, size } = await sharp(OUT).metadata();
console.log(`${OUT} — ${width}x${height}, ${(size / 1024).toFixed(0)} KB`);
