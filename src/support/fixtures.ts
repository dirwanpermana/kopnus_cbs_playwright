// fixtures untuk jembatan antara test dan page object
import { test as base } from 'playwright-bdd';
import LoginPage from '../pages/page_login/login.page.js';
import MenuPage from '../pages/page_login/menu.page.js';
import TipeDokumenPage from '../pages/tipe_dokumen/menu_tipe_dokumen.page.js';
import SearchMenu from '../pages/page_login/search_menu.page.js';

// tipe data untuk fixtures, yang akan digunakan di test
type Fixtures = {
    loginPage: LoginPage;
    menuPage: MenuPage;
    tipeDokumenPage: TipeDokumenPage;
    searchMenu: SearchMenu;
};

export const test = base.extend<Fixtures>({
    loginPage: async ({ page }, use) => {await use(new LoginPage(page));},
    menuPage: async ({ page }, use) => { await use(new MenuPage(page)); },
    tipeDokumenPage: async ({ page }, use) => { await use(new TipeDokumenPage(page)); },
    searchMenu: async ({ page }, use) => { await use(new SearchMenu(page)); },
});

export { expect } from '@playwright/test';