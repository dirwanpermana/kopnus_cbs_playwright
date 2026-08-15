import { expect } from '@playwright/test';
import { When, Then } from '../../../src/support/fixtures';
import { withStepScreenshot } from '../../../src/support/stepScreenshot';
import { loadTestData } from '../helpers/dataLoader';
import SearchMenuCbs from '../pageobjects/page_login_dashboard/searchMenu.page';
import PermohonanKresun from '../pageobjects/page_permohonan_kresun_dan_antrian_komite/menuPermohonanKresun.page';
import LogoutPage from '../pageobjects/page_login_dashboard/logout.page';
import { generateNopen, nopenState } from '../scriptDatabase/generate_nopen';

/**
 * MIGRATION NOTE — diff vs original test/src/step-definitions/permohonanKresun.ts:
 *   - Semua logic murni (getKresunTestData, isTopUpProgram, getNopenArray) SAMA PERSIS,
 *     tidak ada dependency WDIO.
 *   - Page objects sekarang di-instantiate per-step dengan `new X(page)`, bukan singleton import.
 *   - Setiap step body dibungkus `withStepScreenshot(page, ...)`.
 *   - BUG DITEMUKAN & DIPERBAIKI: kode asli hardcode `browser.url('http://10.30.8.40:5000/')`
 *     di tengah loop iterasi (navigasi ke home page antar-nopen) — sebuah IP internal
 *     yang di-hardcode, bukan pakai `process.env.CBS_URL`. Ini bug portabilitas: kalau
 *     environment QA lain punya CBS_URL beda, step ini akan selalu gagal/salah environment
 *     walau `.env` sudah benar. Diperbaiki jadi `process.env.CBS_URL` di bawah.
 *   - Semua `browser.pause(...)` di dalam loop DIHAPUS — pengganti selengkapnya ada di
 *     komentar inline pada tiap titik.
 */

function getKresunTestData(jenisProgram: string): any {
  const kresunFile: any = loadTestData('dataPermohonanKresun');
  const defaultData: any = kresunFile.dataPermohonanKresun || kresunFile;
  const programKey = jenisProgram.trim().toLowerCase();

  switch (programKey) {
    case 'new (sk di tangan)':
    case 'makro new reguler':
      return kresunFile.dataMakroNewReguler || defaultData;
    case 'top up':
    case 'makro top up':
      return kresunFile.dataMakroTopUp || defaultData;
    case 'take over':
    case 'makro take over':
      return kresunFile.dataMakroTakeOver || defaultData;
    case 'pospay new reguler':
      return kresunFile.dataPospayNewReguler || defaultData;
    default:
      console.warn(`Warning: Program "${jenisProgram}" tidak dikenali, menggunakan data default.`);
      return defaultData;
  }
}

const PROGRAM_TANPA_GENERATE_DB = ['top up', 'makro top up'];

function isTopUpProgram(jenisProgram: string): boolean {
  return PROGRAM_TANPA_GENERATE_DB.includes(jenisProgram.trim().toLowerCase());
}

function getNopenArray(jenisProgram: string): string[] {
  if (isTopUpProgram(jenisProgram)) {
    const testData = getKresunTestData(jenisProgram);
    const nopen = testData.nopen;
    return Array.isArray(nopen) ? nopen : [nopen];
  }

  const nopenDariDb = nopenState.get();
  return [nopenDariDb];
}

When('Generate nopen melalui database', async ({ page }) => {
  await withStepScreenshot(page, async () => {
    const nopen = await generateNopen();
    console.log(`[Step] Nopen berhasil di-generate: ${nopen}`);
  });
});

When('Pengguna membuka menu permohonan kresun {string}', async ({ page }, menuPath: string) => {
  await withStepScreenshot(page, async () => {
    const searchMenu = new SearchMenuCbs(page);
    await searchMenu.navigateMenu(menuPath);
  });
});

Then(/^Sistem menampilkan halaman Permohonan Kredit Pensiun$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    const permohonanKresun = new PermohonanKresun(page);
    await expect(permohonanKresun.halPermohonanKresun).toBeVisible();
    await expect(permohonanKresun.halPermohonanKresun).toHaveText('Data Permohonan Pensiun');
  });
});

When('Pengguna menginput nomor pensiun yang valid dan mengisi form permohonan {string}', async ({ page }, jenisProgram: string) => {
  await withStepScreenshot(page, async () => {
    const permohonanKresun = new PermohonanKresun(page);
    const searchMenu = new SearchMenuCbs(page);

    const nopenArray = getNopenArray(jenisProgram);
    const testData = getKresunTestData(jenisProgram);
    let processedCount = 0;

    console.log(`\nMULAI LOOPING PERMOHONAN KRESUN - PROGRAM: ${jenisProgram.toUpperCase()}`);
    console.log(`Sumber NOPEN: ${isTopUpProgram(jenisProgram) ? 'JSON (manual)' : 'Database (generate)'}`);
    console.log(`Total NOPEN: ${nopenArray.length}`);
    console.log(`NOPEN: ${nopenArray.join(', ')}\n`);

    for (let i = 0; i < nopenArray.length; i++) {
      const nopen = nopenArray[i];
      console.log(`\n========== ITERASI ${i + 1}/${nopenArray.length} - NOPEN: ${nopen} ==========`);

      try {
        console.log('Step 1: Input nopen...');
        await permohonanKresun.inputNopen(nopen);

        console.log('Step 2: Check antrian popup...');
        const isNopenInAntrian = await permohonanKresun.checkAndHandleAntrianPopup();
        if (isNopenInAntrian) {
          console.log(`NOPEN ${nopen} sedang dalam antrian, lanjut ke nopen berikutnya.`);
          continue;
        }

        console.log('Step 3: Input data umum pensiun...');
        await permohonanKresun.dataUmumPensiun();

        console.log('Step 4: Input data anggota...');
        const norekKantor = String(testData.norek_kantor_bayar);
        const tinggiBadan = String(testData.tinggi_badan);
        const beratBadan = String(testData.berat_badan);
        const namaAhliWaris = String(testData.namaAhliWaris);
        const noreferensi = String(testData.noReferensi);

        await permohonanKresun.dataAnggota(norekKantor, tinggiBadan, beratBadan, namaAhliWaris, noreferensi);

        console.log('Step 5: Verify data gaji...');
        await expect(permohonanKresun.titleDataGaji).toHaveText('Data Gaji');

        console.log('Step 6: Input data permohonan...');
        const permohonanKredit = String(testData.permohonan_kredit);
        const jangkaWaktu = String(testData.jangka_waktu);
        const kodeProduk = String(testData.kode_produk);
        const jenisSK = String(testData.jenis_SK);
        const jenisProduk = String(testData.jenis_produk);
        const programPinjaman = String(testData.program_pinjaman);
        const kodeInstansi = String(testData.kode_instansi);
        const jenisPenggunaan = String(testData.jenis_penggunaan);

        const mutasi = String(testData.data_mutasi ?? '');
        const kantorMutasi = String(testData.kantor_asal_mutasi ?? '');
        const bankAsalTakeOver = String(testData.bank_asal_take_over ?? '');
        const tipePelunasan = String(testData.tipe_pelunasan ?? '');
        const biayaTakeOver = String(testData.biaya_take_over ?? '');

        await permohonanKresun.dataPermohonan(
          permohonanKredit, jangkaWaktu, jenisProduk, jenisProgram, programPinjaman,
          jenisPenggunaan, kodeProduk, jenisSK, kodeInstansi, mutasi, kantorMutasi,
          bankAsalTakeOver, tipePelunasan, biayaTakeOver
        );

        console.log('Step 7: Wait simulasi pinjaman...');
        await permohonanKresun.perhitunganSimulasiPinjaman();

        console.log('Step 8: Submit permohonan...');
        await permohonanKresun.submitPermohonanKresun();

        console.log('Step 9: Verify success...');
        await expect(permohonanKresun.successSubmitPermohonanKresun).toBeVisible();
        await expect(permohonanKresun.successSubmitPermohonanKresun).toHaveText('Sukses register data');

        console.log(`Permohonan NOPEN ${nopen} berhasil disimpan`);
        processedCount++;

        console.log('Step 10: Click OK success popup...');
        const okButton = page.getByRole('button', { name: 'OK', exact: true });
        await okButton.click({ timeout: 5000 });
        console.log('Popup success ditutup');

        if (i < nopenArray.length - 1) {
          console.log(`\nPreparing untuk iterasi berikutnya (${i + 2}/${nopenArray.length})...`);
          console.log('Step 11: Navigate ke home page...');
          try {
            // BUG DIPERBAIKI: asli hardcode 'http://10.30.8.40:5000/' — sekarang pakai CBS_URL dari .env.
            await page.goto(`${process.env.CBS_URL}`, { waitUntil: 'domcontentloaded' });
            await searchMenu.navigateMenu('Kredit  > Permohonan Kredit Pensiun');
            console.log('Step 11 selesai: menu ter-navigasi kembali');
          } catch (navError: any) {
            console.log(`Step 11 warning: ${navError.message}`);
          }
        }
      } catch (error: any) {
        console.error(`\nERROR pada iterasi ${i + 1} (NOPEN: ${nopen})`);
        console.error(`Error message: ${error.message}`);
        throw error;
      }

      await expect(permohonanKresun.halPermohonanKresun).toHaveText('Data Permohonan Pensiun');
    }

    console.log('\n========== SUMMARY LOOPING ==========');
    console.log(`Total permohonan kresun yang berhasil: ${processedCount} dari ${nopenArray.length} Nopen yang diproses.`);
  });
});

When(/^Pengguna Logout dari cbs$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    const logoutPage = new LogoutPage(page);
    await logoutPage.logout();
  });
});
