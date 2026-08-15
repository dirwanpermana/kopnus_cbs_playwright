import { expect } from '@playwright/test';
import { Given, When, Then } from '../../../src/support/fixtures';
import { withStepScreenshot } from '../../../src/support/stepScreenshot';
import { loadTestData } from '../helpers/dataLoader';
import { pages, PageName } from '../helpers/page.map';
import LoginPage from '../pageobjects/page_login_dashboard/login.page';

/**
 * MIGRATION NOTE — diff vs original test/src/step-definitions/login.ts:
 *   - Regex pattern SAMA PERSIS (^Pengguna berada di halaman (\w+)$, dst.) — tidak ada
 *     perubahan behavior dari sisi Gherkin, feature file existing tidak perlu diubah.
 *   - `import { Given, When, Then } from '@wdio/cucumber-framework'`
 *       -> `from '../../../src/support/fixtures'` (re-export tipis dari playwright-bdd's
 *          createBdd — TIDAK dibungkus, supaya static analysis playwright-bdd tetap jalan;
 *          lihat komentar di fixtures.ts).
 *   - Setiap step body dibungkus `withStepScreenshot(page, async () => { ... })` untuk
 *     screenshot detail per step (pass maupun fail), sesuai keputusan Anda.
 *   - `pages[pageName]` dulu langsung instance -> sekarang factory `pages[pageName](page)`,
 *     karena `page` baru tersedia lewat fixture Playwright, bukan `browser` global WDIO.
 *   - `LoginPage.login(...)` (singleton import) -> `new LoginPage(page).login(...)`.
 *   - `await expect(...).toHaveText(expect.stringContaining(...))` (expect-webdriverio)
 *       -> `await expect(locator).toContainText(...)` (Playwright's built-in `expect`, auto-retry).
 */
const loginData: Record<string, any> = loadTestData('loginData');

Given(/^Pengguna berada di halaman (\w+)$/, async ({ page }, pageName: PageName) => {
  await withStepScreenshot(page, async () => {
    const pageFactory = pages[pageName];
    if (!pageFactory) {
      throw new Error(`Page "${pageName}" tidak terdefinisi di page.map.ts.`);
    }
    await pageFactory(page).open();
  });
});

When(/^Pengguna login dengan "(.+)"$/, async ({ page }, dataTestName: string) => {
  await withStepScreenshot(page, async () => {
    const testData: any = loginData[dataTestName];
    if (!testData) {
      throw new Error(`Test data '${dataTestName}' tidak ditemukan di loginData.json`);
    }

    const credentials: { username: string; password: string } = Array.isArray(testData)
      ? testData[0]
      : testData;

    const loginPage = new LoginPage(page);
    await loginPage.login(credentials.username, credentials.password);
  });
});

Then(/^Sistem menampilkan pesan sukses$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    const loginPage = new LoginPage(page);
    await expect(loginPage.welcomeMessage).toBeVisible({ timeout: 10_000 });
    await expect(loginPage.welcomeMessage).toContainText('Selamat Datang');
  });
});
