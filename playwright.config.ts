import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './server/tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'dot',
  use: {
    baseURL: 'http://e08g08t01-prod.eastasia.cloudapp.azure.com:8069',
    trace: 'on-first-retry',
    screenshot: 'on-first-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
