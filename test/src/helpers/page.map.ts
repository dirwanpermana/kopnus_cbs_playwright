import { Page } from '@playwright/test';
import BasePage from '../pageobjects/page_login_dashboard/page';
import LoginPage from '../pageobjects/page_login_dashboard/login.page';
// import MenuMutasiPerkiraanExistingPage from '../pageobjects/page_ajp_dan_laporan/menuMutasiPerkiraanExisting.page';

/**
 * MIGRATION NOTE:
 * WDIO asli:  Record<string, Page>              — value = INSTANCE singleton
 * Playwright: Record<string, (page) => BasePage> — value = FACTORY, karena page object
 *             baru boleh dibuat setelah ada `page` fixture dari test yang sedang berjalan.
 *
 * Dipanggil dari step-definitions seperti:
 *   const pageObj = pages[pageName](page);
 *   await pageObj.open();
 */
export const pages: Record<string, (page: Page) => BasePage> = {
  login: (page) => new LoginPage(page),
  // mutasiPerkiraan: (page) => new MenuMutasiPerkiraanExistingPage(page),
};

export type PageName = keyof typeof pages;
