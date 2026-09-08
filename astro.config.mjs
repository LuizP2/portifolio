// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

/**
 * Canonical origin. It drives the canonical link, the absolute Open Graph
 * image URL and the sitemap — a stale value here shows up as a broken preview
 * when the link is pasted into an Upwork proposal.
 *
 * Set SITE_URL in the Cloudflare build environment while the custom domain is
 * not live yet, then remove it once luizmedeiros.dev resolves.
 */
const site = process.env.SITE_URL || 'https://luizmedeiros.dev';

export default defineConfig({
  site,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt', 'es'],
    // English keeps the bare URLs it already had; pt and es get a prefix.
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', pt: 'pt-BR', es: 'es' },
      },
    }),
  ],
  build: { inlineStylesheets: 'always' },
  vite: {
    plugins: [tailwindcss()],
  },
});
