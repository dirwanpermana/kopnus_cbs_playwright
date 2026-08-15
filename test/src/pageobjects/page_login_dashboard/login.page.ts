import { Page, Locator } from '@playwright/test';
import BasePage from './page';

/**
 * MIGRATION NOTE (locator mapping WDIO -> Playwright):
 *   $('#user_id')                              -> page.locator('#user_id')
 *   $('button[type="submit"]')                 -> page.locator('button[type="submit"]')
 *   $('h3=Sign in to your Account')  (WDIO exact-text shorthand on a tag)
 *                                               -> page.locator('h3').filter({ hasText: /^Sign in to your Account$/ })
 *   $('h2=Selamat Datang di Aplikasi CBS')      -> same pattern, exact match via anchored regex
 *
 * Locators are getters returning Locator (lazy, auto-waiting/auto-retrying) — same mental
 * model as WDIO's `$()`, so this part of the API translates almost 1:1.
 */
export default class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get inputUsername(): Locator {
    return this.page.locator('#user_id');
  }

  get inputPassword(): Locator {
    return this.page.locator('#password');
  }

  get btnSubmit(): Locator {
    return this.page.locator('button[type="submit"]');
  }

  get halamanLogin(): Locator {
    return this.page.locator('h3').filter({ hasText: /^Sign in to your Account$/ });
  }

  get welcomeMessage(): Locator {
    return this.page.locator('h2').filter({ hasText: /^Selamat Datang di Aplikasi CBS$/ });
  }

  async login(username: string, password: string): Promise<void> {
    await this.inputUsername.fill(username);
    await this.inputPassword.fill(password);
    await this.btnSubmit.click();
  }
}
