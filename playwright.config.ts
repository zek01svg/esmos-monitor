import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export default defineConfig({
  testDir: './server/tests/e2e',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  workers: 4,
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
