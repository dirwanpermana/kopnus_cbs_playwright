import { Page, Locator, expect } from '@playwright/test';
import BasePage from './page';

/**
 * MIGRATION NOTE: `browser.pause(500)` dan `browser.pause(1000)` di antara klik
 * username -> klik "Keluar" -> assert halaman login DIHAPUS. `.click()` Playwright
 * auto-wait sampai target actionable, dan assertion `toBeVisible()`/`toHaveText()`
 * di akhir auto-retry sampai timeout — kombinasi ini sudah cukup andal tanpa delay statis.
 */
export default class LogoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get usernameLogout(): Locator {
    return this.page.locator('#cbs-user-name');
  }

  get pilihLogout(): Locator {
    return this.page.getByRole('link', { name: 'Keluar' });
  }

  get halLogin(): Locator {
    return this.page.locator('h3').filter({ hasText: /^Sign in to your Account$/ });
  }

  async logout(): Promise<void> {
    await this.usernameLogout.click();
    await this.pilihLogout.click();
    await expect(this.halLogin).toBeVisible({ timeout: 10_000 });
    await expect(this.halLogin).toContainText('Sign in to your Account');
  }
}
