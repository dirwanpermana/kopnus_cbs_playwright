import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'test/features/**/*.feature',
  steps: ['test/src/step-definitions/**/*.ts', 'src/support/**/*.ts'],
});
  
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir, // <- WAJIB pakai return value dari defineBddConfig, bukan 'src/features'
  // testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  workers: process.env.CI ? 2 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'html',
  reporter: [
    ['list'],
    ['allure-playwright', { resultsDir: 'reports/allure-results', detail: true, suiteTitle: true }],
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
  ],


  timeout: 60_000,
  expect: { timeout: 10_000 },
  
  use: {
    baseURL: process.env.RCS_URL_LOGIN || process.env.CBS_URL,
    headless: process.env.HEADLESS !== 'false',
    // screenshot: 'only-on-failure',
    screenshot: 'off',  // off karena di handle manual per step Gherkin
    // video: 'retain-on-failure',
    // trace: 'retain-on-failure',
    // trace: 'on-first-retry',
    trace: 'on',
    actionTimeout: 15_000
  },


  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1900, height: 1080 },
        // launchOptions: {
        //   args: ['--start-maximized'],
        // },
      },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
