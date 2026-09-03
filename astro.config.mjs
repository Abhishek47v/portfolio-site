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
  /* Astro injects a floating dev toolbar into every page in `astro dev`. It is
     never in a production build, but it sits over the bottom of the design the
     whole time you are looking at it, which is exactly when it is in the way. */
  devToolbar: { enabled: false },
  compressHTML: true,
});
