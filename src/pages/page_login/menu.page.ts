import { Page, Locator, expect } from '@playwright/test';
import BasePage from './page.js';

const VALID_ROLES: string[] = ['Staff Admin', 'Requester', 'Head Requester', 'Superadmin', 'Admin'];

export default class MenuPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    public get title_Dashboard(): Locator { return this.exactHeading('Dashboard'); }
    public get title_Pengajuan_Dokumen_Saya(): Locator { return this.exactHeading('Pengajuan Dokumen Saya'); }
    public get title_Approval_Dokumen(): Locator { return this.exactHeading('Approval Dokumen'); }
    public get title_Inventaris_Dokumen(): Locator { return this.exactHeading('Inventaris Dokumen'); }
    public get title_Tipe_Dokumen(): Locator { return this.exactHeading('Tipe Dokumen'); }
    public get title_User_Management(): Locator { return this.exactHeading('User Management'); }
    public get title_Kode_Inisial_Unit_Kerja(): Locator { return this.exactHeading('Kode Inisial Unit Kerja'); }

    public get logout_icon(): Locator {
        // Target the account icon in the sidebar header - use first to avoid strict mode
        return this.page.locator('xpath=//div/button[2]/button').first();
    }

    public get btn_logout(): Locator {
        return this.page.locator('div', { hasText: new RegExp(`^${this.escapeRegExp('Logout')}$`) }).last();
    }

    public get verify_role(): Locator {
        return this.page.locator('h1').nth(1);
    }

    private exactHeading(text: string): Locator {
        return this.page.locator('h1', { hasText: new RegExp(`^${this.escapeRegExp(text)}$`) });
    }

    async verify_role_login(role: string): Promise<void> {
        if (!VALID_ROLES.includes(role)) {
            throw new Error(`Login sebagai "${role}" seharusnya role: ${VALID_ROLES.join(', ')}`);
        }
        await this.verify_role.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.verify_role).toHaveText(role);
    }

    async logout(): Promise<void> {
        // Click the account icon button (first occurrence to avoid strict mode)
        await this.logout_icon.click({ force: true, timeout: 8000 });
        await this.page.waitForTimeout(800);
        
        // Find and click the logout button in the dropdown menu
        const logoutOptions = await this.page.locator('text=/logout/i').all();
        console.log(`   Found ${logoutOptions.length} logout options`);
        
        if (logoutOptions.length === 0) {
            throw new Error('Logout button tidak ditemukan setelah klik account icon');
        }
        
        const logoutBtn = logoutOptions[0];
        await logoutBtn.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    public async isMenuVisible(menuText: string): Promise<boolean> {
        const menuElement = this.page.locator('span', { hasText: new RegExp(`^${this.escapeRegExp(menuText)}$`) });
        const count = await menuElement.count();
        if (count === 0) return false;
        return await menuElement.first().isVisible();
    }

    public async validateMenusExist(menuList: string[]): Promise<string[]> {
        const missingMenus: string[] = [];
        for (const menu of menuList) {
            const visible = await this.isMenuVisible(menu.trim());
            console.log(`   ${visible ? '✓' : '✗'} Menu "${menu}" ${visible ? 'ditemukan' : 'TIDAK ditemukan'}`);
            if (!visible) missingMenus.push(menu.trim());
        }
        return missingMenus;
    }

    private async clickParentMenu(parentMenu: string): Promise<boolean> {
        const normalizedParentMenu = parentMenu.trim();
        const parentElement = this.page.getByText(normalizedParentMenu, { exact: true }).first();

        try {
            await parentElement.scrollIntoViewIfNeeded();
            await parentElement.click({ timeout: 5_000, force: true });
            await this.page.waitForTimeout(500);
            return true;
        } catch {
            return false;
        }
    }

    public async validateSubmenusExist(parentMenu: string, submenuList: string[]): Promise<string[]> {
        let clicked = await this.clickParentMenu(parentMenu);
        console.log(`   ${clicked ? '✓' : '⚠'} Klik parent menu "${parentMenu}" untuk expand submenu`);

        if (!clicked) {
            await this.page.waitForTimeout(500);
            clicked = await this.clickParentMenu(parentMenu);
            console.log(`   ${clicked ? '✓ (retry)' : '✗ (retry gagal)'} Klik ulang parent menu "${parentMenu}"`);
        }

        if (!clicked) {
            console.log(`   ✗ Parent menu "${parentMenu}" tidak ditemukan/tidak bisa diklik, submenu otomatis dianggap tidak ditemukan`);
            return submenuList.map((s) => s.trim());
        }

        await this.page.waitForTimeout(800);

        const missingSubmenus: string[] = [];
        const submenuContainer = this.page.locator('.submenu').last();
        const submenuLinks = submenuContainer.locator('a.submenu-link');
        const submenuCount = await submenuLinks.count();

        for (const submenu of submenuList) {
            const trimmedSubmenu = submenu.trim();
            let found = false;
            let matchedText = '';

            for (let i = 0; i < submenuCount; i++) {
                const submenuLink = submenuLinks.nth(i);
                const visible = await submenuLink.isVisible().catch(() => false);
                if (!visible) continue;

                const text = await submenuLink.textContent().catch(() => '');
                const normalizedText = text?.replace(/\s+/g, ' ').trim() ?? '';
                if (normalizedText.toLowerCase().includes(trimmedSubmenu.toLowerCase())) {
                    found = true;
                    matchedText = normalizedText;
                    break;
                }
            }

            console.log(`      ${found ? '✓' : '✗'} Submenu "${submenu}" ${found ? 'ditemukan' : 'TIDAK ditemukan'}${matchedText ? ` [${matchedText}]` : ''}`);
            if (!found) missingSubmenus.push(trimmedSubmenu);
        }

        return missingSubmenus;
    }
}