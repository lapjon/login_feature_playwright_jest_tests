const { defineConfig } = require('@playwright/test');

// Define whether we are running in a CI environment
const isCI = !!process.env.CI;

module.exports = defineConfig({
  testDir: './tests/playwright', // Specify the directory where Playwright should look for tests
  timeout: 60000, // Set a global timeout for each test (60 seconds)
  retries: 2, // Retries for failed tests, good for flaky tests
  use: {
    headless: isCI, // Set to run headless in CI, otherwise headful
    viewport: { width: 1280, height: 720 }, // Browser viewport size
    ignoreHTTPSErrors: true, // Ignore HTTPS errors (useful for local testing)
    video: 'retain-on-failure', // Record videos of test runs (helps debug failed tests)
    baseURL: 'http://localhost:5000', // Set the base URL for all page and API requests
  },
  projects: [
    {
      name: 'Chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'Chrome',
      use: { browserName: 'chromium', channel: 'chrome'},
    },
    {
      name: 'Firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'WebKit',
      use: { browserName: 'webkit' },
    },
  ],
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
  ],
});
