import { createBdd } from 'playwright-bdd';
import { test } from '../support/fixtures.js';

const { When, Then } = createBdd(test);

// Mapping scenario name -> env var keys
const scenarioCredentialMap: Record<string, { nikEnv: string; passwordEnv: string }> = {
  'Invalid NIK and Password': {
    nikEnv: 'INVALID_NIK',
    passwordEnv: 'INVALID_PASSWORD',
  },
  'Invalid Password': {
    nikEnv: 'NIK_HQ_SUPERADMIN',
    passwordEnv: 'INVALID_PASSWORD',
  },
  'NIK Kosong': {
    nikEnv: '', // sengaja kosong
    passwordEnv: 'PASSWORD_VALID',
  },
  'Password Kosong': {
    nikEnv: 'NIK_HQ_SUPERADMIN',
    passwordEnv: '',
  },
  'Akun Inactive': {
    nikEnv: 'AKUN_INACTIVE',
    passwordEnv: 'PASSWORD_INACTIVE',
  },
};

function getCredentials(scenario: string): { nik: string; password: string } {
  const mapping = scenarioCredentialMap[scenario];
  if (!mapping) {
    throw new Error(`Scenario credential tidak ditemukan untuk: "${scenario}"`);
  }

  const nik = mapping.nikEnv ? process.env[mapping.nikEnv] : '';
  const password = mapping.passwordEnv ? process.env[mapping.passwordEnv] : '';

  // Validasi env terisi (kecuali memang sengaja kosong buat test "Kosong")
  if (mapping.nikEnv && !nik) {
    throw new Error(`ENV "${mapping.nikEnv}" belum di-set untuk scenario "${scenario}"`);
  }
  if (mapping.passwordEnv && !password) {
    throw new Error(`ENV "${mapping.passwordEnv}" belum di-set untuk scenario "${scenario}"`);
  }

  return { nik: nik ?? '', password: password ?? '' };
}

When(/^Login dengan scenario "(.+)"$/, async ({ loginPage }, scenario: string) => {
  const { nik, password } = getCredentials(scenario);
  await loginPage.login(nik, password);
});

Then(/^Login gagal dan menampilkan message "(.+)"$/, async ({ loginPage }, expectedErrorMessage: string) => {
  const codeMatch = expectedErrorMessage.match(/\((\w+)\)\s*$/);
  const errorCode = codeMatch ? codeMatch[1] : null;

  if (expectedErrorMessage === 'Kolom wajib diisi') {
    const nikErrorDisplayed = await loginPage.error_nik.isVisible();
    if (nikErrorDisplayed) {
      await loginPage.verify_kolom_nik_kosong(expectedErrorMessage);
    } else {
      await loginPage.verify_kolom_password_kosong(expectedErrorMessage);
    }
  } else if (errorCode === '04A') {
    await loginPage.verify_password_salah_atau_user_inactive(expectedErrorMessage);
    await loginPage.tutup_popup_error_login.click();
  } else if (errorCode === '04J') {
    await loginPage.verify_nik_tidak_terdaftar(expectedErrorMessage);
    await loginPage.tutup_popup_error_login.click();
  } else {
    throw new Error(`Scenario tidak dikenali: "${expectedErrorMessage}"`);
  }
});