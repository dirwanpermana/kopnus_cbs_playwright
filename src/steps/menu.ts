import { createBdd, DataTable } from 'playwright-bdd';
import { test, expect } from '../support/fixtures.js';

const { Then, When } = createBdd(test);

Then(/^Terdapat menu (.+)$/, async ({ menuPage }, menuListRaw: string) => {
    const menuList = menuListRaw.split(',').map((item) => item.replace(/"/g, '').trim());
    const missingMenus = await menuPage.validateMenusExist(menuList);
    expect(missingMenus).toEqual([]);
});

Then(/^Menu "([^"]+)" memiliki submenu berikut:$/, async ({ menuPage }, parentMenu: string, dataTable: DataTable) => {
    const submenuList = dataTable.raw().map((row) => row[0].trim());
    const missingSubmenus = await menuPage.validateSubmenusExist(parentMenu, submenuList);
    expect(missingSubmenus).toEqual([]);
});

When('User logout dari aplikasi rcs', async ({ menuPage }) => {
    await menuPage.logout();
});

Then('Berhasil logout dan direct ke halaman login rcs', async ({ loginPage }) => {
    await loginPage.message_hal_login.waitFor({ state: 'visible', timeout: 5000 });
    await expect(loginPage.message_hal_login).toBeVisible();
});

Then(/^Berhasil login sebagai "([^"]+)"$/, async ({ menuPage }, role: string) => {
    await menuPage.verify_role_login(role);
});