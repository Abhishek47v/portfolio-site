// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output only. No adapter, no SSR — see docs/06-architecture.md §1.
export default defineConfig({
  // Canonical URLs and the sitemap are built from this, so a placeholder here
  // would publish wrong URLs. Set SITE_URL in the deploy environment;
  // Cloudflare Pages exposes CF_PAGES_URL for preview branches.
  site: process.env.SITE_URL ?? process.env.CF_PAGES_URL ?? 'http://localhost:4321',
  output: 'static',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'always' },
  compressHTML: true,
});
