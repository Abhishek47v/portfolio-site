// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output only. No adapter, no SSR — see docs/06-architecture.md §1.
export default defineConfig({
  // Canonical URLs and the sitemap are built from this, so a placeholder here
  // would publish wrong URLs. Set SITE_URL in the deploy environment. The
  // localhost fallback is for local builds only, and `npm run deploy` refuses
  // to ship a build that still carries it (scripts/check-site-url.mjs).
  //
  // This used to also read CF_PAGES_URL. Workers Builds does not set it, so
  // the fallback could never fire and only suggested a safety net that was
  // not there — see D-064.
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  output: 'static',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'always' },
  /* Astro injects a floating dev toolbar into every page in `astro dev`. It is
     never in a production build, but it sits over the bottom of the design the
     whole time you are looking at it, which is exactly when it is in the way. */
  devToolbar: { enabled: false },
  compressHTML: true,
});
