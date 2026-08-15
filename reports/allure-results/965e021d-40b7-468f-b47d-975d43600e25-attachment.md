# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test/features/fitur_login/login.feature.spec.js >> Login CBS Konvensional Website >> Pengguna login pada CBS Konvensional
- Location: .features-gen/test/features/fitur_login/login.feature.spec.js:6:7

# Error details

```
Error: Test data 'userCabang' tidak ditemukan di loginData.json
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e5]:
    - heading "CITRA BANKING SYSTEM" [level=2] [ref=e6]
    - heading "Sign in to your Account" [level=3] [ref=e7]
    - generic [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e11]: User ID
        - textbox "User ID" [ref=e12]:
          - /placeholder: Masukkan User ID
        - img [ref=e14]
      - generic [ref=e16]:
        - generic [ref=e17]: Password
        - textbox "Password" [ref=e18]:
          - /placeholder: Masukkan Password
        - img [ref=e20]
      - link "Lupa Password?" [ref=e23] [cursor=pointer]:
        - /url: https://dev-cbs.kopnus.com/lupa-password
      - button "LOGIN" [ref=e25] [cursor=pointer]
  - generic [ref=e26]:
    - generic [ref=e27]:
      - paragraph [ref=e28]: All in One Place, Transactio
      - img "illustration" [ref=e31]
    - paragraph [ref=e32]:
      - generic [ref=e33]: "2026"
      - text: © CBS. Created with
      - img [ref=e34]
      - text: by Core Team
```

# Test source

```ts
  1  | import { expect } from '@playwright/test';
  2  | import { Given, When, Then } from '../../../src/support/fixtures';
  3  | import { withStepScreenshot } from '../../../src/support/stepScreenshot';
  4  | import { loadTestData } from '../helpers/dataLoader';
  5  | import { pages, PageName } from '../helpers/page.map';
  6  | import LoginPage from '../pageobjects/page_login_dashboard/login.page';
  7  | 
  8  | /**
  9  |  * MIGRATION NOTE — diff vs original test/src/step-definitions/login.ts:
  10 |  *   - Regex pattern SAMA PERSIS (^Pengguna berada di halaman (\w+)$, dst.) — tidak ada
  11 |  *     perubahan behavior dari sisi Gherkin, feature file existing tidak perlu diubah.
  12 |  *   - `import { Given, When, Then } from '@wdio/cucumber-framework'`
  13 |  *       -> `from '../../../src/support/fixtures'` (re-export tipis dari playwright-bdd's
  14 |  *          createBdd — TIDAK dibungkus, supaya static analysis playwright-bdd tetap jalan;
  15 |  *          lihat komentar di fixtures.ts).
  16 |  *   - Setiap step body dibungkus `withStepScreenshot(page, async () => { ... })` untuk
  17 |  *     screenshot detail per step (pass maupun fail), sesuai keputusan Anda.
  18 |  *   - `pages[pageName]` dulu langsung instance -> sekarang factory `pages[pageName](page)`,
  19 |  *     karena `page` baru tersedia lewat fixture Playwright, bukan `browser` global WDIO.
  20 |  *   - `LoginPage.login(...)` (singleton import) -> `new LoginPage(page).login(...)`.
  21 |  *   - `await expect(...).toHaveText(expect.stringContaining(...))` (expect-webdriverio)
  22 |  *       -> `await expect(locator).toContainText(...)` (Playwright's built-in `expect`, auto-retry).
  23 |  */
  24 | const loginData: Record<string, any> = loadTestData('loginData');
  25 | 
  26 | Given(/^Pengguna berada di halaman (\w+)$/, async ({ page }, pageName: PageName) => {
  27 |   await withStepScreenshot(page, async () => {
  28 |     const pageFactory = pages[pageName];
  29 |     if (!pageFactory) {
  30 |       throw new Error(`Page "${pageName}" tidak terdefinisi di page.map.ts.`);
  31 |     }
  32 |     await pageFactory(page).open();
  33 |   });
  34 | });
  35 | 
  36 | When(/^Pengguna login dengan "(.+)"$/, async ({ page }, dataTestName: string) => {
  37 |   await withStepScreenshot(page, async () => {
  38 |     const testData: any = loginData[dataTestName];
  39 |     if (!testData) {
> 40 |       throw new Error(`Test data '${dataTestName}' tidak ditemukan di loginData.json`);
     |             ^ Error: Test data 'userCabang' tidak ditemukan di loginData.json
  41 |     }
  42 | 
  43 |     const credentials: { username: string; password: string } = Array.isArray(testData)
  44 |       ? testData[0]
  45 |       : testData;
  46 | 
  47 |     const loginPage = new LoginPage(page);
  48 |     await loginPage.login(credentials.username, credentials.password);
  49 |   });
  50 | });
  51 | 
  52 | Then(/^Sistem menampilkan pesan sukses$/, async ({ page }) => {
  53 |   await withStepScreenshot(page, async () => {
  54 |     const loginPage = new LoginPage(page);
  55 |     await expect(loginPage.welcomeMessage).toBeVisible({ timeout: 10_000 });
  56 |     await expect(loginPage.welcomeMessage).toContainText('Selamat Datang');
  57 |   });
  58 | });
  59 | 
```