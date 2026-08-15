import { Page } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * MIGRATION NOTE — perubahan arsitektural paling penting di seluruh migrasi ini:
 *
 * WDIO (asli):
 *   export default class Page {
 *     open() { return browser.url(`${process.env.CBS_URL}`); }
 *   }
 *   export default new LoginPage();   // <-- SINGLETON, pakai `browser` global
 *
 * Playwright:
 *   Page Object BUKAN singleton lagi. `browser` global WDIO diganti `page` instance
 *   yang di-inject lewat constructor, dan `page` itu sendiri datang dari Playwright
 *   fixture (unik per test, auto-dibersihkan di akhir test).
 *   Ini WAJIB karena Playwright page adalah objek per-test-context, tidak bisa
 *   di-share sebagai module-level singleton seperti WDIO's `browser`.
 *
 * Konsekuensi ke `page.map.ts`: registry sekarang berisi FACTORY (function),
 * bukan instance langsung — lihat page.map.ts.
 */
export default abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(): Promise<void> {
    await this.page.goto(`${process.env.CBS_URL}`, { waitUntil: 'domcontentloaded' });
  }
}
