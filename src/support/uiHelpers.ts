import { Page, Locator, expect } from '@playwright/test';

/**
 * MIGRATION NOTE — pola `browser.pause(ms)` di seluruh page object asli dipakai untuk 3 alasan
 * berbeda, dan masing-masing punya pengganti Playwright yang lebih tepat (bukan sekadar hilang):
 *
 *   1. "Tunggu animasi/AJAX dropdown selesai sebelum klik opsi"
 *      -> TIDAK PERLU LAGI. Playwright locator.click() auto-wait sampai element
 *         actionable (visible + stable + tidak animasi + menerima event). Yang
 *         dulunya perlu `waitForDisplayed()` manual + `pause()` jaga-jaga, sekarang
 *         cukup 1 assertion `toBeVisible()` (retry otomatis) tanpa pause tambahan.
 *   2. "Tunggu popup SweetAlert2 muncul/hilang"
 *      -> `expect(locator).toBeVisible()` / `toBeHidden()` (auto-retry, ada timeout
 *         eksplisit, dan GAGAL DENGAN JELAS kalau popup tidak pernah muncul — beda
 *         dengan `pause()` yang tetap lanjut walau popup belum siap).
 *   3. "Tunggu form berikutnya ter-render setelah submit AJAX"
 *      -> `locator.waitFor({ state: 'visible' })` pada elemen KONKRET dari form
 *         berikutnya, bukan delay buta. Kalau form itu tidak pernah muncul, test GAGAL
 *         dengan pesan jelas alih-alih lanjut jalan dengan state yang salah (silent bug).
 *
 * Helper di file ini dipakai berulang oleh page object select2/SweetAlert2 supaya
 * pola di atas konsisten, bukan diulang copy-paste per page object.
 */

const SELECT2_DROPDOWN = '.select2-dropdown';
const SWEETALERT_CONTENT = '#swal2-content';

/**
 * Select2 dropdown by visible text — pengganti `selectDropdownByText` di
 * menuPermohonanKresun.page.ts (WDIO). Coba exact match dulu, fallback ke
 * case-insensitive contains (sama seperti logic asli), TANPA pause statis di antaranya.
 */
export async function selectSelect2ByText(
  page: Page,
  fieldLocator: Locator,
  searchText: string,
  fieldName = ''
): Promise<void> {
  await fieldLocator.click();

  const dropdown = page.locator(SELECT2_DROPDOWN).last();
  await expect(dropdown).toBeVisible({ timeout: 8000 });

  // Exact match dulu (case-sensitive)
  const exactOption = dropdown.locator('li', { hasText: new RegExp(`^${escapeRegex(searchText)}$`) });
  const exactCount = await exactOption.count();

  const option = exactCount > 0
    ? exactOption.first()
    : dropdown.locator('li').filter({ hasText: new RegExp(searchText, 'i') }).first();

  try {
    await expect(option).toBeVisible({ timeout: 3000 });
  } catch (error) {
    throw new Error(`Gagal memilih "${searchText}" dari dropdown "${fieldName}": opsi tidak ditemukan/visible. ${error}`);
  }

  await option.click();
}

/** Escape regex metachar supaya searchText aman dipakai sebagai pattern literal. */
function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Ambil locator konten SweetAlert2 (`#swal2-content`) dan tunggu sampai visible.
 * Dipakai di banyak tempat pengganti pola:
 *   await this.popupX.waitForDisplayed({ timeout });
 *   expect(await this.popupX.getText()).toBe('...');
 */
export function sweetAlertContent(page: Page): Locator {
  return page.locator(SWEETALERT_CONTENT);
}

export async function expectSweetAlertText(page: Page, expectedText: string, timeout = 10_000): Promise<void> {
  const alert = sweetAlertContent(page);
  await expect(alert).toBeVisible({ timeout });
  await expect(alert).toHaveText(expectedText);
}

/**
 * Klik tombol dalam popup SweetAlert2 by text ("Ya", "OK", "Tidak", dst).
 * SweetAlert2 me-render tombolnya sebagai <button> biasa, jadi locator by role+name
 * paling stabil (tidak bergantung struktur DOM internal SweetAlert2).
 */
export function sweetAlertButton(page: Page, name: string | RegExp): Locator {
  return page.getByRole('button', { name });
}

/**
 * JS-click escape hatch — pengganti `browser.execute((el) => el.click(), await locator)`
 * di kode asli. Dipakai untuk radio/checkbox custom-styled yang kadang dianggap
 * "outside viewport"/"covered by overlay" oleh native click, meski secara visual
 * terlihat & clickable. Playwright jauh lebih jarang butuh ini dibanding WDIO
 * (auto-scroll + actionability check-nya lebih baik), tapi dipertahankan sebagai
 * fallback yang eksplisit, bukan default — dipakai hanya di titik yang sama dengan
 * kode asli, dan HANYA jika native click benar-benar gagal.
 */
export async function clickViaJs(locator: Locator): Promise<void> {
  await locator.evaluate((el) => (el as HTMLElement).click());
}

/**
 * Generic polling helper — pengganti pola manual `while(!found && Date.now()-start<max)`
 * di `inputNopen()` (menuPermohonanKresun.page.ts asli). Playwright TIDAK punya
 * primitif polling generik built-in untuk "tunggu salah satu dari beberapa kemungkinan
 * next-state", jadi ini tetap perlu, tapi diimplementasikan dengan interval check yang
 * jelas timeout & pesan errornya — bukan `browser.pause(200)` di dalam loop tanpa batas jelas.
 */
export async function waitUntilTrue(
  check: () => Promise<boolean>,
  options: { timeout?: number; interval?: number; message?: string } = {}
): Promise<boolean> {
  const timeout = options.timeout ?? 10_000;
  const interval = options.interval ?? 200;
  const start = Date.now();

  while (Date.now() - start < timeout) {
    if (await check().catch(() => false)) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  if (options.message) {
    console.warn(`[waitUntilTrue] Timeout setelah ${timeout}ms: ${options.message}`);
  }
  return false;
}
