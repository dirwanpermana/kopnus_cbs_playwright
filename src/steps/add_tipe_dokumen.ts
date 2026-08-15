import { createBdd, DataTable } from 'playwright-bdd';
import { test, expect } from '../support/fixtures.js';
import searchMenu from '../pages/page_login/search_menu.page.js';
import { getTipeDokumenTestCase } from '../data_test/tipe_dokumen.data.js';

const { Given, When, Then } = createBdd(test);

When('Pilih menu {string}', async ({ searchMenu }, menuPath: string) => {
  await searchMenu.navigateMenu(menuPath);
});

Then('Verify halaman Tipe Dokumen', async ({ tipeDokumenPage }) => {
  await expect(tipeDokumenPage.hal_tipe_dok).toBeVisible();
  await expect(tipeDokumenPage.hal_tipe_dok).toHaveText('Tipe Dokumen', { exact: true } as any);
});

When('User klik tombol Tambah Tipe Dokumen', async ({ tipeDokumenPage }) => {
  await tipeDokumenPage.btn_add_tipe_dokumen();
});

Then('Verify halaman Tambah Tipe Dokumen', async ({ tipeDokumenPage }) => {
  await tipeDokumenPage.hal_add_tipe_dokumen();
});

// FIX: tambah {string} di teks step, cocok dengan 1 parameter (key)
When('Input form tambah tipe dokumen {string}', async ({ tipeDokumenPage }, key: string) => {
  const data = getTipeDokumenTestCase(key);
  await tipeDokumenPage.add_tipe_dokumen({
    status: data.status,
    namaTipeDok: data.namaTipeDok,
    kodeTipeDok: data.kodeTipeDok,
    formatDok: data.formatDok,
    infoTambahan: data.infoTambahan,
    formatBulan: data.formatBulan,
    formatTahun: data.formatTahun,
    templateFileName: data.templateDok,
  });
});

Then('Klik simpan tipe dokumen', async ({ tipeDokumenPage }) => {
  await tipeDokumenPage.simpan_tipe_dokumen();
});

Then('validasi success message', async ({ tipeDokumenPage }) => {
  await tipeDokumenPage.success_message();
});

// FIX: teks step tambah {string}, dan hapus 2 parameter berlebih (tipeValue, dataTable) yang sudah tidak dipakai
Then('Verify data tipe dokumen {string} tampil pada tabel', async ({ tipeDokumenPage }, key: string) => {
  const data = getTipeDokumenTestCase(key);
  await tipeDokumenPage.verify_data_tampil_pada_tabel(data.namaTipeDok);

  // Cek data pada tabel
  await tipeDokumenPage.validasi_detail_tipe_dokumen(data.namaTipeDok, {
    tipe: data.namaTipeDok,
    formatPenomoran: data.formatPenomoran,
    status: data.statusDisplay, // pakai statusDisplay ('Active'/'Inactive'), bukan status input ('Aktif'/'Inaktif')
    lastUser: data.lastUser,
  });

  // Last Update cuma diambil nilainya, tidak divalidasi
   await tipeDokumenPage.validasi_last_update_terbaru(data.namaTipeDok, 120);
});

// FIX: tambah {string}
When('User klik icon aksi pada tipe dokumen {string}', async ({ tipeDokumenPage }, key: string) => {
  const data = getTipeDokumenTestCase(key);
  await tipeDokumenPage.klik_aksi_tipe_dokumen(data.namaTipeDok);
});

Then('Verify halaman Detail Tipe Dokumen', async ({ tipeDokumenPage }) => {
  await tipeDokumenPage.verify_halaman_detail_tipe_dokumen();
});

// FIX: tambah {string}
Then('Validasi detail halaman tipe dokumen {string}', async ({ tipeDokumenPage }, key: string) => {
  const data = getTipeDokumenTestCase(key);
  await tipeDokumenPage.validasi_detail_halaman({
    status: data.statusDisplay,
    tipeDokumen: data.namaTipeDok,
    kodeTipeDokumen: data.kodeTipeDok,
    infoTambahan: data.infoTambahan ?? '-',
    formatBulan: data.formatBulan ?? '',
    formatTahun: data.formatTahun ?? '',
    urutanFormatPenomoran: data.formatPenomoran,
  });
  await tipeDokumenPage.validasi_template_dokumen_tersedia();
});