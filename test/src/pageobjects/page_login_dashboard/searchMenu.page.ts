import { Page, Locator } from '@playwright/test';
import BasePage from './page';

/**
 * MIGRATION NOTE — perubahan dari versi asli:
 *   - `browser.execute((text) => {...})` untuk klik span by text tetap dipertahankan
 *     (menu framework ini pakai overlapping/absolutely-positioned spans yang kadang
 *     bikin native click WDIO gagal) — di-translate ke `page.evaluate`.
 *   - `browser.pause(300)` di akhir tiap iterasi loop -> DIHAPUS. Tidak ada kegunaan:
 *     iterasi berikutnya sudah nunggu submenu visible lewat `waitForDisplayed`
 *     (di-translate ke `locator.waitFor({state:'visible'})`), jadi pause tambahan
 *     di akhir loop murni membuang waktu tanpa menambah keandalan.
 *   - Return value `boolean` dari evaluate untuk logging "✓/⚠" dipertahankan sama persis.
 */
export default class SearchMenuCbs extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * menuPath - format: "ParentMenu > ChildMenu > SubMenu"
   * contoh: navigateMenu("Lending > Komite Kredit Pensiun > Verifikasi Komite Kredit Layer 3")
   */
  async navigateMenu(menuPath: string): Promise<void> {
    const menuItems = menuPath.split('>').map((item) => item.trim());

    for (let i = 0; i < menuItems.length; i++) {
      const menu = menuItems[i];
      const isLast = i === menuItems.length - 1;

      const menuLocator: Locator = this.page.locator('span', { hasText: menu });
      await menuLocator.first().waitFor({ state: 'attached', timeout: 10_000 });

      const clicked = await this.page.evaluate((text: string) => {
        const spans = Array.from(document.querySelectorAll('span'));
        const target = spans.find((s) => s.textContent?.trim() === text);
        if (!target) return false;
        const rect = target.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        (target as HTMLElement).click();
        return true;
      }, menu);

      console.log(`   ${clicked ? '✓' : '⚠'} Klik menu "${menu}"`);

      if (!isLast) {
        const nextMenu = menuItems[i + 1];
        await this.page
          .locator('span', { hasText: nextMenu })
          .first()
          .waitFor({ state: 'visible', timeout: 5000 })
          .catch(() => {
            console.log(`   Submenu "${nextMenu}" belum visible, lanjut...`);
          });
      }
    }

    console.log(`   navigateMenu selesai untuk: ${menuPath}`);
  }
}
