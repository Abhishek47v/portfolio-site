import { defineConfig, devices } from '@playwright/test';

/* The suite must test the built artifact in dist/, never a dev server.
   It used to default to 4321 with reuseExistingServer, which meant a stray
   `astro dev` on that port answered the tests instead — green against code
   that was never built. So: a port dev never uses, and no reuse (D-045). */
const PORT = Number(process.env.PORT ?? 4331);
const origin = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: origin,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `PORT=${PORT} npm run serve`,
    url: origin,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
