// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

/**
 * Canonical origin. It drives the canonical link, the absolute Open Graph
 * image URL and the sitemap — a stale value here shows up as a broken preview
 * when the link is pasted into an Upwork proposal.
 *
 * Set SITE_URL in the Cloudflare Pages environment variables while the custom
 * domain is not live yet (use the *.pages.dev URL), then remove it once
 * luizmedeiros.dev resolves.
 */
const site = process.env.SITE_URL || 'https://luizmedeiros.dev';

export default defineConfig({
  site,
  integrations: [sitemap()],
  build: { inlineStylesheets: 'always' },
  vite: {
    plugins: [tailwindcss()],
  },
});
