import { Page, Locator, expect } from '@playwright/test';
import path from 'path';
import BasePage from '../page_login/page';
import { waitForDebugger } from 'inspector';

export default class TipeDokumenPage extends BasePage {
  readonly hal_tipe_dok: Locator;
  readonly btn_add_tipe_dok: Locator;
  readonly hal_tambah_tipe_dok: Locator;
  readonly status_active: Locator;
  readonly status_inactive: Locator;
  readonly field_nama_tipe_dok: Locator;
  readonly field_kode_tipe_dok: Locator;
  readonly field_info_tamb: Locator;
  readonly field_format_penomoran: Locator;
  readonly field_format_bulan: Locator;
  readonly field_format_tahun: Locator;
  readonly field_template: Locator;
  readonly btn_simpan: Locator;
  readonly btn_ya_simpan: Locator;
  readonly popup_success: Locator;
  readonly popup_btn_ok: Locator;
  readonly search_tipedok: Locator;
  // --- untuk validasi tabel ---
  readonly table: Locator;
  readonly headerCells: Locator;
  readonly bodyRows: Locator;
  // --- untuk halaman Detail Tipe Dokumen
  readonly hal_detail_tipe_dok: Locator;
  readonly detailRows: Locator;

  constructor(page: Page) {
    super(page);
    this.hal_tipe_dok = page.getByRole('heading', { name: 'Tipe Dokumen', level: 1 });
    this.btn_add_tipe_dok = page.locator(`div.card-title-container > div.flex > button.font-lato`);
    this.hal_tambah_tipe_dok = page.getByRole('heading', { name: 'Tambah Tipe Dokumen' });
    this.status_active = page.locator('button[role="radio"][data-value="0"]');
    this.status_inactive = page.locator('button[role="radio"][data-value="1"]');
    this.field_nama_tipe_dok = page.getByLabel('Nama Tipe Dokumen');
    this.field_kode_tipe_dok = page.locator('#code');
    this.field_info_tamb = page.getByLabel('Info Tambahan');
    this.field_format_penomoran = page.getByText('keyboard_arrow_down', { exact: true });
    this.field_format_bulan = page.getByLabel('Format Bulan');
    this.field_format_tahun = page.getByLabel('Format Tahun');
    this.field_template = page.locator('input#template');
    this.btn_simpan = page.getByRole('button', { name: 'Simpan' });
    this.btn_ya_simpan = page.getByRole('button', { name: 'Ya, Simpan' });
    this.popup_success = page.getByRole('heading', { name: 'Sukses' });
    this.popup_btn_ok = page.getByRole('button', { name: 'OK' });
    this.search_tipedok = page.getByRole('textbox', { name: 'Cari tipe dokumen / info tambahan' });

    // Selector tabel pakai data-slot, lebih stabil dibanding class Tailwind
    this.table = page.locator('div[data-slot="table-container"] table[data-slot="table"]');
    this.headerCells = this.table.locator('thead[data-slot="table-header"] th[data-slot="table-head"]');
    this.bodyRows = this.table.locator('tbody[data-slot="table-body"] tr[data-slot="table-row"]');
    // detail dokumen
    this.hal_detail_tipe_dok = page.locator(`h1:has-text("Detail Tipe Dokumen")`);
    this.detailRows = page.locator('div.card-content > div.flex.flex-col');
  }

  private formatOption(label: string): Locator {
    return this.page.locator('ul').getByRole('button', { name: label, exact: true });
  }

  private formatBulanOption(label: string): Locator {
    return this.page.getByRole('option', { name: label, exact: true });
  }

  private formatTahunOption(label: string): Locator {
    return this.page.getByRole('option', { name: label, exact: true });
  }

    // Cari index kolom berdasarkan nama header (case-insensitive, toleran icon/karakter tambahan)
  private async getColumnIndex(columnName: string): Promise<number> {
    const count = await this.headerCells.count();
    for (let i = 0; i < count; i++) {
      const text = (await this.headerCells.nth(i).innerText()).trim().toLowerCase();
      if (text.includes(columnName.toLowerCase())) return i;
    }
    throw new Error(`Kolom "${columnName}" tidak ditemukan di header tabel Tipe Dokumen`);
  }

  async btn_add_tipe_dokumen() {
    await this.btn_add_tipe_dok.click();
  }

  async hal_add_tipe_dokumen() {
    await expect(this.hal_tambah_tipe_dok).toBeVisible();
    await expect(this.hal_tambah_tipe_dok).toHaveText('Tambah Tipe Dokumen');
  }

    private readonly formatOptionLabelMap: Record<string, string> = {
    'Bulan': 'Bulan',
    'Tahun': 'Tahun',
    '-': '- (separator)',
    '/': '/ (separator)',
    'Info Tambahan': 'Info Tambahan',
  };

  private resolveFormatOptionLabel(token: string): string {
    const label = this.formatOptionLabelMap[token];
    if (!label) {
      throw new Error(
        `Token format "${token}" tidak dikenali di formatOptionLabelMap. ` +
        `Token yang valid: ${Object.keys(this.formatOptionLabelMap).join(', ')}`
      );
    }
    return label;
  }

  async add_tipe_dokumen(data: {
    status: string;
    namaTipeDok: string;
    kodeTipeDok: string;
    formatDok: string;
    infoTambahan?: string;
    formatBulan?: string;
    formatTahun?: string;
    templateFileName: string;
  }) {
    if (data.status === 'Aktif') {
      await this.status_active.click();
    } else {
      await this.status_inactive.click();
    }

    await this.field_nama_tipe_dok.fill(data.namaTipeDok);
    await this.field_kode_tipe_dok.fill(data.kodeTipeDok);

    const formatList = data.formatDok.split(',').map((f) => f.trim());

    // Pilih opsi dropdown Format Penomoran — pakai label asli hasil mapping, bukan token mentah
    for (const token of formatList) {
      const label = this.resolveFormatOptionLabel(token);
      await this.field_format_penomoran.click();
      await this.formatOption(label).click();
    }

    // Format Bulan: guard enabled dulu sebelum interaksi
    if (formatList.includes('Bulan')) {
      await expect(this.field_format_bulan).toBeEnabled({ timeout: 5000 });
      if (data.formatBulan) {
        await this.field_format_bulan.click();
        await this.formatBulanOption(data.formatBulan).click();
      }
    }

    // Format Tahun: sama, guard enabled state
    if (formatList.includes('Tahun')) {
      await expect(this.field_format_tahun).toBeEnabled({ timeout: 5000 });
      if (data.formatTahun) {
        await this.field_format_tahun.click();
        await this.formatTahunOption(data.formatTahun).click();
      }
    }

    // Info Tambahan: HANYA enabled kalau opsi "Info Tambahan" dipilih di Format Penomoran.
    // Sebelumnya field ini di-fill tanpa syarat, padahal field disabled by default.
    if (formatList.includes('Info Tambahan')) {
      await expect(this.field_info_tamb).toBeEnabled({ timeout: 5000 });
      if (data.infoTambahan) {
        await this.field_info_tamb.fill(data.infoTambahan);
      }
    }

    // Upload dokumen
    const fileName = data.templateFileName || 'dokumen_testing.pdf';
    const filePath = path.join(__dirname, '../../data_test/attachment', fileName);
    await this.field_template.setInputFiles(filePath);
  }

  async simpan_tipe_dokumen() {
    await this.btn_simpan.click();
    await expect(this.btn_ya_simpan).toBeVisible();
    await this.btn_ya_simpan.click();
  }

  async success_message() {
    await this.popup_success.waitFor({ state: 'visible', timeout: 7000 });
    await expect(this.popup_success).toHaveText('Sukses');
  }

  // search data pada tabel
  private async cari_tipe_dokumen(keyword: string): Promise<void> {
    await this.search_tipedok.fill(keyword);
    await this.page.waitForTimeout(500);
  }

    private async getRowByTipe(tipeValue: string): Promise<Locator> {
    const tipeColIndex = await this.getColumnIndex('Tipe');
    const rowCount = await this.bodyRows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = this.bodyRows.nth(i);
      const cellText = (await row.locator('td[data-slot="table-cell"]').nth(tipeColIndex).innerText()).trim();
      if (cellText === tipeValue) return row;
    }
    throw new Error(`Row dengan Tipe "${tipeValue}" tidak ditemukan di tabel setelah pencarian`);
  }

  // Step 1: pastikan data hasil input muncul di tabel
  async verify_data_tampil_pada_tabel(tipeValue: string): Promise<void> {
    await this.popup_btn_ok.click();
    await this.cari_tipe_dokumen(tipeValue);
    const row = await this.getRowByTipe(tipeValue);
    await expect(row, `Row dengan Tipe "${tipeValue}" tidak muncul di tabel`).toBeVisible();
  }

  // Step 2: validasi detail kolom (Format Penomoran, Status, Last User)
async validasi_detail_tipe_dokumen(
    tipeValue: string,
    expected: { tipe: string; formatPenomoran: string; status: string; lastUser: string }
  ): Promise<void> {
    const row = await this.getRowByTipe(tipeValue);

    const checks: Array<[string, string]> = [
      ['Tipe', expected.tipe],
      ['Format Penomoran', expected.formatPenomoran],
      ['Status', expected.status],
      ['Last User', expected.lastUser],
    ];

    for (const [columnName, expectedValue] of checks) {
      const colIndex = await this.getColumnIndex(columnName);
      const cell = row.locator('td[data-slot="table-cell"]').nth(colIndex);
      await expect(cell, `Kolom "${columnName}" untuk Tipe "${tipeValue}" tidak sesuai`).toHaveText(expectedValue);
    }
  }

  // Step 3: validasi Last Update — tidak exact match, karena timestamp dinamis
  async validasi_last_update_terbaru(tipeValue: string, withinSeconds = 120): Promise<void> {
    const row = await this.getRowByTipe(tipeValue);
    const colIndex = await this.getColumnIndex('Last Update');
    const rawText = (await row.locator('td[data-slot="table-cell"]').nth(colIndex).innerText()).trim();

    const match = rawText.match(/^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/);
    expect(match, `Format Last Update tidak sesuai pola DD-MM-YYYY HH:mm:ss, actual: "${rawText}"`).toBeTruthy();

    if (match) {
      const [, dd, mm, yyyy, hh, min, ss] = match;
      const parsedDate = new Date(`${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`);
      const diffSeconds = Math.abs((Date.now() - parsedDate.getTime()) / 1000);
      expect(
        diffSeconds,
        `Last Update "${rawText}" tidak dalam rentang ${withinSeconds} detik terakhir dari waktu eksekusi test`
      ).toBeLessThanOrEqual(withinSeconds);
    }
  }

  // Klik icon mata (Aksi) pada row dengan Tipe tertentu
  async klik_aksi_tipe_dokumen(tipeValue: string): Promise<void> {
    const row = await this.getRowByTipe(tipeValue);
    const aksiCell = row.locator('td[data-slot="table-cell"]').first();
    await aksiCell.locator('button').click();
  }

  async verify_halaman_detail_tipe_dokumen(): Promise<void> {
    await expect(this.hal_detail_tipe_dok).toBeVisible();
  }

  private async getDetailFieldValue(label: string): Promise<string> {
    const rowCount = await this.detailRows.count();
    for (let i = 0; i < rowCount; i++) {
      const row = this.detailRows.nth(i);
      const labelText = (await row.locator('> div').first().innerText()).trim();
      if (labelText.toLowerCase() === label.toLowerCase()) {
        const rawValue = (await row.locator('> div').nth(1).innerText()).trim();
        // Bersihkan karakter ":" dan whitespace/nbsp sisa markup
        return rawValue.replace(/^:+\s*/, '').replace(/\s+/g, ' ').trim();
      }
    }
    throw new Error(`Label "${label}" tidak ditemukan di halaman Detail Tipe Dokumen`);
  }

  // Validasi seluruh field di halaman detail sekaligus
  async validasi_detail_halaman(expected: {
    status?: string;
    tipeDokumen?: string;
    kodeTipeDokumen?: string;
    infoTambahan?: string;
    formatBulan?: string;
    formatTahun?: string;
    urutanFormatPenomoran?: string;
  }): Promise<void> {
    const checks: Array<[string, string | undefined]> = [
      ['Status', expected.status],
      ['Tipe Dokumen', expected.tipeDokumen],
      ['Kode Tipe Dokumen', expected.kodeTipeDokumen],
      ['Info Tambahan', expected.infoTambahan],
      ['Format Bulan', expected.formatBulan],
      ['Format Tahun', expected.formatTahun],
      ['Urutan Format Penomoran', expected.urutanFormatPenomoran],
    ];

    for (const [label, expectedValue] of checks) {
      if (expectedValue === undefined) continue; // skip field yang tidak di-assert (mis. field optional/kondisional)
      const actualValue = await this.getDetailFieldValue(label);
      expect(actualValue, `Field "${label}" di halaman detail tidak sesuai`).toBe(expectedValue);
    }
  }

  // Template Dokumen: bukan plain text, tapi tombol "Lihat Dokumen" — validasi keberadaannya saja
  async validasi_template_dokumen_tersedia(): Promise<void> {
    const row = this.detailRows.filter({ hasText: 'Template Dokumen' }).first();
    await expect(row.getByText('Lihat Dokumen'), 'Tombol "Lihat Dokumen" tidak tampil di halaman detail').toBeVisible();
  }

}