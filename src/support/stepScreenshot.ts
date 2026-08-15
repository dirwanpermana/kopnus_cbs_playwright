import { Page, test } from '@playwright/test';

/**
 * Screenshot SETIAP step, pass maupun fail (sesuai keputusan Anda: mode "Detail").
 *
 * Cara pakai — bungkus body step, BUKAN Given/When/Then itu sendiri:
 *
 *   Given(/^some step$/, async ({ page }) => {
 *     await withStepScreenshot(page, async () => {
 *       // ... isi step asli ...
 *     });
 *   });
 *
 * Kenapa begini (bukan pakai config `screenshot: 'on'` bawaan Playwright):
 * config bawaan hanya screenshot di akhir TEST, bukan per STEP. Attachment diberi nama
 * berurutan (`step-screenshot-<n>-<passed|failed>`) supaya src/reporters/pdf-step-reporter.ts
 * bisa memasangkan urutan attachment dengan urutan step di PDF.
 */
let stepCounter = 0;

export async function withStepScreenshot<T>(page: Page, fn: () => Promise<T>): Promise<T> {
  try {
    const result = await fn();
    await capture(page, 'passed');
    return result;
  } catch (err) {
    await capture(page, 'failed');
    throw err;
  }
}

async function capture(page: Page, status: 'passed' | 'failed'): Promise<void> {
  if (!page || page.isClosed()) return;
  try {
    stepCounter += 1;
    const buffer = await page.screenshot({ fullPage: true });
    await test.info().attach(`step-screenshot-${stepCounter}-${status}`, {
      body: buffer,
      contentType: 'image/png',
    });
  } catch {
    // Screenshot gagal (misal page baru saja navigate/close) tidak boleh menggagalkan step itu sendiri.
  }
}
