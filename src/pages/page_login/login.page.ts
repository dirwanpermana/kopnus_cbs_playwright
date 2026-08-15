import { Page, Locator, expect } from '@playwright/test';
import BasePage from './page.js';

export default class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    public get message_hal_login(): Locator {
        return this.page.getByRole('heading', { name: 'Selamat Datang di RCS, Masuk untuk Melanjutkan.', exact: true });
    }

    public get field_nik(): Locator {
        return this.page.locator('#nik');
    }

    public get field_password(): Locator {
        return this.page.locator('#password');
    }

    public get btn_submit(): Locator {
        return this.page.locator('button[type="submit"]');
    }

    public get error_nik(): Locator {
        return this.page.locator('//label[contains(.,"NIK")]/following-sibling::p');
    }

    public get error_password(): Locator {
        return this.page.locator('//label[contains(.,"Password")]/following-sibling::p');
    }

    public get password_salah_atau_user_inactive(): Locator {
        return this.page.locator('[role="heading"][data-dialog-title]');
    }

    public get nik_tidak_terdaftar(): Locator {
        return this.page.locator('[role="heading"][data-dialog-title]');
    }

    public get tutup_popup_error_login(): Locator {
        return this.page.getByRole('button', { name: 'Tutup' });
    }

    public get hal_dashboard(): Locator {
        return this.page.locator('h1', { hasText: 'Dashboard' });
    }

    async login(nik: string, password: string): Promise<void> {
        await this.field_nik.waitFor({ state: 'visible', timeout: 5000 });
        await this.field_nik.fill(nik);
        await this.field_password.fill(password);
        await this.btn_submit.click();
    }

    // Promise<void> karena tidak mengembalikan nilai apapun, hanya melakukan verifikasi
    async verify_kolom_nik_kosong(error_nik: string): Promise<void> {
        await this.error_nik.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.error_nik).toHaveText(error_nik);
    }

    async verify_kolom_password_kosong(error_password: string): Promise<void> {
        await this.error_password.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.error_password).toHaveText(error_password);
    }

    // untuk verify error password salah
    async verify_password_salah_atau_user_inactive(message: string): Promise<void> {
        await this.password_salah_atau_user_inactive.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.password_salah_atau_user_inactive).toHaveText(message);
    }

    // untuk verify error nik tidak terdaftar
    async verify_nik_tidak_terdaftar(message: string): Promise<void> {
        await this.nik_tidak_terdaftar.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.nik_tidak_terdaftar).toHaveText(message);
    }
}