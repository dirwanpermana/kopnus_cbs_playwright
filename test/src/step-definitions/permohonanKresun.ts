import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from '../../../src/support/fixtures';

import { loadTestData } from '../helpers/dataLoader.js';
import { generateNopen, nopenState } from '../scriptDatabase/generate_nopen.js';

const { When, Then } = createBdd(test);

// function untuk ambil data dari file JSON berdasarkan parameter jenisProgram
function getKresunTestData(jenisProgram: string): any {
  const kresunFile: any = loadTestData('dataPermohonanKresun');
  const defaultData: any = kresunFile.dataPermohonanKresun || kresunFile;

  // Normalisasi input string agar tidak sensitif huruf besar/kecil
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

    // ===== Skenario Kode Produk 3O =====
    // Dipetakan terpisah dari skenario reguler di atas karena JSON-nya
    // (New_3O, Topup_3O, takeover_3O) membawa 2 field tambahan khusus
    // 3O: penghasilan_lain & nom_penghasilan_lain.
    case 'new 3o':
    case 'makro new 3o':
      return kresunFile.New_3O || defaultData;

    case 'top up 3o':
    case 'makro top up 3o':
      return kresunFile.Topup_3O || defaultData;

    case 'take over 3o':
    case 'makro take over 3o':
      return kresunFile.takeover_3O || defaultData;

    default:
      console.warn(`Warning: Program "${jenisProgram}" tidak dikenali, menggunakan data default.`);
      return defaultData;
  }
}

// Untuk top up (reguler maupun 3O) pake nopen dari json, bukan generate DB
const PROGRAM_TANPA_GENERATE_DB = ['top up', 'makro top up', 'top up 3o', 'makro top up 3o'];

function isTopUpProgram(jenisProgram: string): boolean {
  return PROGRAM_TANPA_GENERATE_DB.includes(jenisProgram.trim().toLowerCase());
}

// get nopen untuk take over dan new
function getNopenArray(jenisProgram: string): string[] {
  if (isTopUpProgram(jenisProgram)) {
    const testData = getKresunTestData(jenisProgram);
    const nopen = testData.nopen;
    return Array.isArray(nopen) ? nopen : [nopen];
  }

  // Non-Top Up: pakai nopen hasil generate dari database (step "Generate nopen melalui database").
  const nopenDariDb = nopenState.get();
  return [nopenDariDb];
}

When('Generate nopen melalui database', async () => {
  const nopen = await generateNopen();
  console.log(`[Step] Nopen berhasil di-generate: ${nopen}`);
});

When(
  'Pengguna membuka menu permohonan kresun {string}',
  async ({ searchMenuCbs }, menuPath: string) => {
    await searchMenuCbs.navigateMenu(menuPath);
  }
);

Then(
  /^Sistem menampilkan halaman Permohonan Kredit Pensiun$/,
  async ({ page, permohonanKresun }) => {
    await expect(permohonanKresun.halPermohonanKresun).toBeVisible();
    await expect(permohonanKresun.halPermohonanKresun).toHaveText('Data Permohonan Pensiun');
    await page.waitForTimeout(5000);
  }
);

When(
  'Pengguna menginput nomor pensiun yang valid dan mengisi form permohonan {string}',
  async ({ page, permohonanKresun, searchMenuCbs }, jenisProgram: string) => {
    const nopenArray = getNopenArray(jenisProgram);
    const testData = getKresunTestData(jenisProgram);
    let processedCount = 0;

    console.log(`\n MULAI LOOPING PERMOHONAN KRESUN - PROGRAM: ${jenisProgram.toUpperCase()}`);
    console.log(`Sumber NOPEN: ${isTopUpProgram(jenisProgram) ? 'JSON (manual)' : 'Database (generate)'}`);
    console.log(`Total NOPEN: ${nopenArray.length}`);
    console.log(`NOPEN: ${nopenArray.join(', ')}\n`);

    for (let i = 0; i < nopenArray.length; i++) {
      const nopen = nopenArray[i];
      console.log(`\n========== ITERASI ${i + 1}/${nopenArray.length} - NOPEN: ${nopen} ==========`);
      console.log(` Input NOPEN: ${nopen}`);
      try {
        console.log(`Step 1: Input nopen...`);
        await permohonanKresun.inputNopen(nopen);

        console.log(`Step 2: Check antrian popup...`);
        const isNopenInAntrian = await permohonanKresun.checkAndHandleAntrianPopup();
        if (isNopenInAntrian) {
          console.log(`NOPEN ${nopen} sedang dalam antrian, lanjut ke nopen berikutnya.`);
          continue;
        }

        console.log(`Step 3: Waiting untuk page fully loaded...`);
        await page.waitForTimeout(1500);

        console.log(`Step 4: Input data umum pensiun...`);
        await permohonanKresun.dataUmumPensiun();

        console.log(`Step 5: Input data anggota...`);
        const norekKantor = String(testData.norek_kantor_bayar);
        const tinggiBadan = String(testData.tinggi_badan);
        const beratBadan = String(testData.berat_badan);
        const namaAhliWaris = String(testData.namaAhliWaris);
        const noreferensi = String(testData.noReferensi);

        await permohonanKresun.dataAnggota(norekKantor, tinggiBadan, beratBadan, namaAhliWaris, noreferensi);

        console.log(`Step 6: Verify data gaji...`);
        await expect(permohonanKresun.titleDataGaji).toHaveText('Data Gaji');

        console.log(`Step 7: Input data permohonan...`);
        const permohonanKredit = String(testData.permohonan_kredit);
        const jangkaWaktu = String(testData.jangka_waktu);
        const kodeProduk = String(testData.kode_produk);
        const jenisSK = String(testData.jenis_SK);
        const jenisProduk = String(testData.jenis_produk);
        const programPinjaman = String(testData.program_pinjaman);
        const kodeInstansi = String(testData.kode_instansi);
        const jenisPenggunaan = String(testData.jenis_penggunaan);

        // PENTING: untuk routing flow (Take Over / New SK di Tangan / Top Up) di dalam
        // permohonanKresun.dataPermohonan(), pakai testData.jenis_program (field di JSON),
        // BUKAN parameter Cucumber "jenisProgram" mentah. Ini supaya skenario varian 3O
        // (misal Cucumber step dipanggil dengan "New 3O") tetap ke-routing dengan benar
        // ke handler "New (SK Di Tangan)", karena field jenis_program di JSON New_3O
        // memang sudah diisi "New (SK Di Tangan)".
        const jenisProgramUntukRouting = String(testData.jenis_program ?? jenisProgram);

        // Menggunakan fallback data jika key di JSON tidak tersedia (aman untuk non-takeover)
        const mutasi = String(testData.data_mutasi ?? '');
        const kantorMutasi = String(testData.kantor_asal_mutasi ?? '');
        const bankAsalTakeOver = String(testData.bank_asal_take_over ?? '');
        const tipePelunasan = String(testData.tipe_pelunasan ?? '');
        const biayaTakeOver = String(testData.biaya_take_over ?? '');

        // ===== Field khusus Kode Produk 3O =====
        // Kosong ('') aman untuk skenario non-3O karena permohonanKresun.dataPermohonan()
        // hanya akan input field ini kalau kodeProduk terparse sebagai "3O".
        const penghasilanLain = String(testData.penghasilan_lain ?? '');
        const nomPenghasilanLain = String(testData.nom_penghasilan_lain ?? '');

        await permohonanKresun.dataPermohonan(
          permohonanKredit,
          jangkaWaktu,
          jenisProduk,
          jenisProgramUntukRouting, // Routing pakai jenis_program dari JSON, bukan raw Cucumber string
          programPinjaman,
          jenisPenggunaan,
          kodeProduk,
          jenisSK,
          kodeInstansi,
          mutasi,
          kantorMutasi,
          bankAsalTakeOver,
          tipePelunasan,
          biayaTakeOver,
          undefined, // nominalBlokir - belum dipakai dari JSON saat ini
          penghasilanLain,
          nomPenghasilanLain
        );

        console.log(`Step 8: Wait simulasi pinjaman...`);
        await permohonanKresun.perhitunganSimulasiPinjaman();

        console.log(`Step 9: Submit permohonan...`);
        await permohonanKresun.submitPermohonanKresun();

        console.log(`Step 10: Verify success...`);
        await expect(permohonanKresun.successSubmitPermohonanKresun).toBeVisible();
        await expect(permohonanKresun.successSubmitPermohonanKresun).toHaveText('Sukses register data');

        console.log(`Permohonan NOPEN ${nopen} berhasil disimpan`);
        processedCount++;

        console.log(`Step 12: Click OK success popup...`);
        const OKbutton = page.locator('button:text-is("OK")');
        await OKbutton.waitFor({ state: 'visible', timeout: 5000 });
        await OKbutton.click();
        await page.waitForTimeout(3000);

        console.log(`Popup success ditutup`);

        if (i < nopenArray.length - 1) {
          console.log(`\n⏳ Preparing untuk iterasi berikutnya (${i + 2}/${nopenArray.length})...`);
          await page.waitForTimeout(2000);

          console.log(`Step 13: Navigate ke home page...`);
          try {
            await page.goto('http://10.30.8.40:5000/');
            console.log(`Step 13a: Home page navigation completed`);
            await page.waitForTimeout(2000);

            console.log(`Step 13b: Opening permohonan menu...`);
            await searchMenuCbs.navigateMenu('Kredit  > Permohonan Kredit Pensiun');
            console.log(`Step 13c: Menu navigated successfully`);
            await page.waitForTimeout(1000);
          } catch (navError: any) {
            console.log(`Step 13 warning: ${navError.message}`);
            await page.waitForTimeout(2000);
          }

          console.log(`Ready untuk iterasi berikutnya`);
        }
      } catch (error: any) {
        console.error(`\n ERROR pada iterasi ${i + 1} (NOPEN: ${nopen})`);
        console.error(`Error message: ${error.message}`);
        throw error;
      }

      await expect(permohonanKresun.halPermohonanKresun).toHaveText('Data Permohonan Pensiun');
      await page.waitForTimeout(2000);
    }

    console.log(`\n========== SUMMARY LOOPING ==========`);
    console.log(`Total permohonan kresun yang berhasil: ${processedCount} dari ${nopenArray.length} Nopen yang diproses.`);
  }
);

When(/^Pengguna Logout dari cbs$/, async ({ logoutPage }) => {
  await logoutPage.logout();
});