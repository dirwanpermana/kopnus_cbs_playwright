import { type Page as PlaywrightPage, type Locator, expect } from '@playwright/test';
import Page from './page.js';

class LoginPage extends Page {
  constructor(protected readonly page: PlaywrightPage) {
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
    return this.page.locator('h3:text-is("Sign in to your Account")');
  }

  get welcomeMessage(): Locator {
    return this.page.locator('h2:text-is("Selamat Datang di Aplikasi CBS")');
  }

  async login(username: string, password: string): Promise<void> {
    await this.inputUsername.fill(username);
    await this.inputPassword.fill(password);
    await this.btnSubmit.click();
  }

  async open(): Promise<void> {
    // return super.open(/5000/);
    await super.open();
  }
}

export default LoginPage;