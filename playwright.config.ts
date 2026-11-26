import { defineConfig, devices } from '@playwright/test';
import { selectedApp } from './config/apps.config';

const uiProject = {
  name: 'ui',
  testMatch: selectedApp.kind === 'ui' ? [...selectedApp.testMatch] : [],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: selectedApp.baseUrl,
    testIdAttribute: selectedApp.testIdAttribute,
  },
};

const apiProject = {
  name: 'api',
  testMatch: selectedApp.kind === 'api' ? [...selectedApp.testMatch] : [],
  use: {
    baseURL: selectedApp.baseUrl,
  },
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],
  outputDir: 'test-results',
  use: {
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [uiProject, apiProject],
});
