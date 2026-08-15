import { expect } from '@playwright/test';
import { When, Then } from '../../../src/support/fixtures';
import { withStepScreenshot } from '../../../src/support/stepScreenshot';
import SearchMenuCbs from '../pageobjects/page_login_dashboard/searchMenu.page';
import AntrianKomiteLayer3 from '../pageobjects/page_permohonan_kresun_dan_antrian_komite/antrianKomiteLayer3.page';
import AntrianKomiteLayer2 from '../pageobjects/page_permohonan_kresun_dan_antrian_komite/antrianKomiteLayer2.page';
import AntrianKomiteLayer1 from '../pageobjects/page_permohonan_kresun_dan_antrian_komite/antrianKomiteLayer1.page';
import { nopenState } from '../scriptDatabase/generate_nopen';
import { updateAntrianKomiteFunction } from '../scriptDatabase/insert_nopen_to_function_komite';

/**
 * MIGRATION NOTE — file ini berisi step definitions untuk Layer 3, 2, DAN 1 sekaligus,
 * SAMA PERSIS dengan struktur asli (di repo asli, file terpisah
 * `antrianKomiteLayer1.ts`/`antrianKomiteLayer2.ts` isinya FULL COMMENTED OUT — versi
 * yang benar-benar aktif dipakai ada di dalam `approvalAntrianKomite.ts` ini). Saya
 * pertahankan struktur itu (bukan pisah ulang ke 3 file) supaya diff terhadap
 * behavior asli tetap 1:1 dan tidak ada step yang ke-drop tanpa sengaja.
 *
 * Semua `browser.pause(...)` dan `browser.execute(...)` generik (bukan business-logic)
 * dihapus/di-translate — lihat komentar di masing-masing page object terkait.
 */

When('Insert nopen ke function get_data_antrian_komite_kredit', async ({ page }) => {
  await withStepScreenshot(page, async () => {
    const nopen = nopenState.get();
    await updateAntrianKomiteFunction(nopen);
  });
});

// ===================== LAYER 3 =====================

When('Pengguna membuka menu Verifikasi Komite Kredit Layer 3 {string}', async ({ page }, menuPath: string) => {
  await withStepScreenshot(page, async () => {
    await new SearchMenuCbs(page).navigateMenu(menuPath);
  });
});

Then(/^Sistem menampilkan halaman Verifikasi Persetujuan Komite Layer 3$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    const layer3 = new AntrianKomiteLayer3(page);
    await expect(layer3.halAntrianKomiteLayer3).toBeVisible();
    await expect(layer3.halAntrianKomiteLayer3).toHaveText('Verifikasi Persetujuan Komite Layer 3');
  });
});

Then(/^Verify data Antrian Komite sesuai dengan data yang diajukan pada Permohonan Kresun pada cbs konven$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    await new AntrianKomiteLayer3(page).prosesAntrianKomite3();
  });
});

When(/^Verifikasi berkas pada Antrian Komite layer 3$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    console.log(`\n${'═'.repeat(70)}\nVERIFIKASI BERKAS - JSON DRIVEN\n${'═'.repeat(70)}\n`);
    const layer3 = new AntrianKomiteLayer3(page);
    try {
      await layer3.processApprovalWithJson();
      try {
        const defaultNotes = `Verifikasi dokumen komite layer 3 - ${new Date().toLocaleDateString('id-ID')}`;
        await layer3.inputCatatan(defaultNotes);
      } catch (error: any) {
        console.warn(`Could not input notes: ${error.message}`);
      }
    } catch (error: any) {
      console.error(`Error: ${error.message}`);
      throw error;
    }
  });
});

When(/^Submit verifikasi berkas lengkap$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    await new AntrianKomiteLayer3(page).submitVerifikasi();
  });
});

Then(/^Buka form Verifikasi Interview$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    await new AntrianKomiteLayer3(page).verifyFormVerifikasiInterview('Verifikasi Interview');
  });
});

When(/^Input hasil interview$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    await new AntrianKomiteLayer3(page).setAllInterviewStatus('sesuai');
  });
});

/**
 * MIGRATION NOTE: original punya fallback try/catch — kalau tombol Submit tidak
 * clickable via native click, coba JS click via XPath. Escape hatch dipertahankan,
 * `browser.pause(500)` di antaranya dihapus.
 */
When(/^Submit hasil interview$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    const layer3 = new AntrianKomiteLayer3(page);
    try {
      await layer3.submitInterviewButton.click({ timeout: 10_000 });
    } catch (error) {
      console.log('Submit button not clickable via native click, trying JavaScript click');
      await page.evaluate(() => {
        const btn = document.evaluate(
          "//button[contains(text(), 'Submit')]",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue as HTMLButtonElement;

        if (btn) {
          btn.disabled = false;
          btn.click();
        }
      });

      try {
        await layer3.YaButton.click({ timeout: 5000 });
      } catch {
        console.log('Pop Up Konfirmasi tidak tampil, Button Ya tidak terlihat');
      }
    }
  });
});

Then(/^Menampilkan form Verifikasi Data$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    const layer3 = new AntrianKomiteLayer3(page);
    await expect(layer3.titleVerifikasiData).toBeVisible({ timeout: 8000 });
    await expect(layer3.titleVerifikasiData).toHaveText('Verifikasi Data');
  });
});

When(/^Verifikasi Keseluruhan Data$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    const layer3 = new AntrianKomiteLayer3(page);
    await layer3.verifyDataSesuai();
    await layer3.inputCatatanVerifikasiData('Catatan kecil oleh orang besar');
  });
});

When(/^Submit Verifikasi Data$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    await new AntrianKomiteLayer3(page).submitVerifikasiData();
  });
});

Then(/^Menampilkan Form Resume Verifikasi Persetujuan Kredit$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    const layer3 = new AntrianKomiteLayer3(page);
    await expect(layer3.titleResumeVerifikasi).toBeVisible();
    await expect(layer3.titleResumeVerifikasi).toHaveText('Resume Verifikasi Persetujuan Kredit');
    await layer3.verifyPersetujuanKredit();
  });
});

When(/^Approve Permohonan Kresun$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    await new AntrianKomiteLayer3(page).ApproveAntrianKomite3();
  });
});

Then(/^Menampilkan pesan berhasil submit$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    const layer3 = new AntrianKomiteLayer3(page);
    await expect(layer3.successApprovalantrianKomite3).toBeVisible({ timeout: 15_000 });
    await expect(layer3.successApprovalantrianKomite3).toHaveText('Submit Data Approval sukses');
    await layer3.closeSuccessPopup();
    console.log('✓ Layer 3 selesai, lanjut ke Layer 2');
  });
});

When('refresh ke halaman home {string}', async ({ page }, menuPath: string) => {
  await withStepScreenshot(page, async () => {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await new SearchMenuCbs(page).navigateMenu(menuPath);
  });
});

// ===================== LAYER 2 =====================

When('Pengguna membuka menu Verifikasi Komite Kredit Layer 2 {string}', async ({ page }, menuPath: string) => {
  await withStepScreenshot(page, async () => {
    await new SearchMenuCbs(page).navigateMenu(menuPath);
  });
});

Then(/^Sistem menampilkan halaman Verifikasi Persetujuan Komite Layer 2$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    const layer2 = new AntrianKomiteLayer2(page);
    await expect(layer2.halAntrianKomiteLayer2).toBeVisible();
    await expect(layer2.halAntrianKomiteLayer2).toHaveText('Verifikasi Persetujuan Komite Layer 2');
  });
});

When(/^Proses nopen pada antrian komite layer 2$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    await new AntrianKomiteLayer2(page).prosesNopenAntrianKomiteLayer2();
  });
});

Then(/^Menampilkan form Resume Verifikasi Persetujuan Kredit Layer 2$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    const layer2 = new AntrianKomiteLayer2(page);
    await expect(layer2.resumeVerifikasiLayer2).toBeVisible();
    await expect(layer2.resumeVerifikasiLayer2).toHaveText('Resume Verifikasi Persetujuan Kredit Layer 2');
    await layer2.dropdownDetailAntrianKomiteLayer2();
  });
});

/**
 * MIGRATION NOTE: kode asli punya 2 versi step "Pengguna melakukan verifikasi dokumen"
 * — versi commented-out yang lengkap (buka modal + proses dokumen dari JSON) dan versi
 * aktif yang HANYA isi catatan (verifikasi dokumen benar-benar di-skip, ada di
 * komentar sumber: "Tidak verifikasi dokumen"). Saya port versi yang AKTIF
 * (skip verifikasi dokumen), sesuai behavior asli saat ini — bukan versi commented-out.
 */
When(/^Pengguna melakukan verifikasi dokumen$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    const layer2 = new AntrianKomiteLayer2(page);
    await layer2.catatanVerifikasiDokumenLayer2(`catatan verif dokumen layer 2 - ${new Date().toLocaleDateString('id-ID')}`);
  });
});

When(/^Simpan verifikasi dokumen pada layer 2$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    // Sesuai kode asli (aktif): step ini di-skip, tidak memanggil simpanverifikasiDokumenLayer2().
    console.log('Skip');
  });
});

When(/^Verifikasi Interview$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    await new AntrianKomiteLayer2(page).verifikasiInterview(true, `catatan verif interview layer 2 - ${new Date().toLocaleDateString('id-ID')}`);
  });
});

When(/^Verifikasi Data Nasabah$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    await new AntrianKomiteLayer2(page).verifikasiData(true, `catatan verif data layer 2 - ${new Date().toLocaleDateString('id-ID')}`);
  });
});

When(/^Approve verifikasi komite kredit layer 2$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    await new AntrianKomiteLayer2(page).submitHasilVerifikasiLayer2('Approve');
  });
});

Then(/^Menampilkan pesan berhasil Approve verifikasi komite kredit layer 2$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    await expect(new AntrianKomiteLayer2(page).successApprovalantrianKomite2).toHaveText('Submit Data Approval sukses', { timeout: 8000 });
  });
});

// ===================== LAYER 1 =====================

/**
 * MIGRATION NOTE: kode asli untuk step "Pengguna membuka menu Verifikasi Komite Kredit
 * Layer 1" punya `browser.refresh()` + `browser.pause(1000)` sebelum navigasi menu
 * (berbeda dari layer 2/3 yang tidak refresh dulu) — `pause` dihapus, `refresh` di-translate
 * ke `page.reload()` dan menunggu domcontentloaded (bukan delay buta 1 detik).
 */
When('Pengguna membuka menu Verifikasi Komite Kredit Layer 1 {string}', async ({ page }, menuPath: string) => {
  await withStepScreenshot(page, async () => {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await new SearchMenuCbs(page).navigateMenu(menuPath);
  });
});

Then(/^Sistem menampilkan halaman Verifikasi Persetujuan Komite Layer 1$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    const layer1 = new AntrianKomiteLayer1(page);
    await expect(layer1.halAntrianKomiteLayer1).toBeVisible();
    await expect(layer1.halAntrianKomiteLayer1).toHaveText('Verifikasi Persetujuan Komite Layer 1');
  });
});

When(/^Proses nopen pada antrian komite layer 1$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    await new AntrianKomiteLayer1(page).prosesNopenAntrianKomiteLayer1();
  });
});

Then(/^Menampilkan form Resume Verifikasi Persetujuan Kredit Layer 1$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    const layer1 = new AntrianKomiteLayer1(page);
    await expect(layer1.resumeVerifikasiLayer1).toBeVisible();
    await expect(layer1.resumeVerifikasiLayer1).toHaveText('Resume Verifikasi Persetujuan Kredit Layer 1');
    await layer1.dropdownDetailAntrianKomiteLayer1();
  });
});

// Sama seperti Layer 2: versi aktif di kode asli skip verifikasi dokumen (hanya isi catatan).
When(/^Pengguna melakukan verifikasi dokumen layer 1$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    const layer1 = new AntrianKomiteLayer1(page);
    await layer1.catatanVerifikasiDokumenLayer1(`catatan verif dokumen layer 1 - ${new Date().toLocaleDateString('id-ID')}`);
  });
});

When(/^Simpan verifikasi dokumen pada layer 1$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    console.log('Skip verifikasi dokumen layer 1');
  });
});

When(/^Verifikasi Interview layer 1$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    await new AntrianKomiteLayer1(page).verifikasiInterview(true, `catatan verif interview layer 1 - ${new Date().toLocaleDateString('id-ID')}`);
  });
});

When(/^Verifikasi Data Nasabah layer 1$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    await new AntrianKomiteLayer1(page).verifikasiData(true, `catatan verif data layer 1 - ${new Date().toLocaleDateString('id-ID')}`);
  });
});

When(/^Approve verifikasi komite kredit layer 1$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    await new AntrianKomiteLayer1(page).submitHasilVerifikasiLayer1('Approve');
  });
});

Then(/^Menampilkan pesan berhasil Approve verifikasi komite kredit layer 1$/, async ({ page }) => {
  await withStepScreenshot(page, async () => {
    await expect(new AntrianKomiteLayer1(page).successApprovalantrianKomite1).toHaveText('Submit Data Approval sukses', { timeout: 8000 });
  });
});
