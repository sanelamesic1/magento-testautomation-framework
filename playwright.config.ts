import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  timeout: 120_000,
  testDir: './tests',
  reporter: 'html',
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    headless: true,
    baseURL: 'https://magento.softwaretestingboard.com/',
    viewport: { width: 1280, height: 1000 },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    }
  ],
});
