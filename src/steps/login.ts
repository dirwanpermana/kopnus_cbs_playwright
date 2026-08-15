// src/steps/login/login.ts
import { createBdd } from 'playwright-bdd';
import { test, expect } from '../support/fixtures.js';
import { ensureUserState } from '../helpers/db/userState.js';    //cek user di db

const { Given, When, Then } = createBdd(test);

Given('User berada di halaman login rcs', async ({ loginPage }) => {
    await loginPage.open();
});

When('User login dengan akun {string}', async ({ loginPage }, akun: string) => {
    await ensureUserState(akun); // pastikan user di DB sesuai expected state

    const suffix = akun.trim().toUpperCase();
    const nikEnvKey = `NIK_${suffix}`;
    const passwordEnvKey = `PASSWORD_${suffix}`;

    const nik = process.env[nikEnvKey];
    const password = process.env[passwordEnvKey];

    if (!nik || !password) {
        throw new Error(
            `Kredensial untuk akun "${akun}" tidak ditemukan. ` +
            `Pastikan "${nikEnvKey}" dan "${passwordEnvKey}" sudah diisi di .env`
        );
    }

    await loginPage.login(nik, password);
});

Then('Berhasil login dan direct ke halaman dashboard', async ({ loginPage }) => {
    await loginPage.hal_dashboard.waitFor({ state: 'visible', timeout: 30_000 });
    await expect(loginPage.hal_dashboard).toContainText('Dashboard');
});