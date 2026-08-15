import { Page, Locator, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import BasePage from '../page_login_dashboard/page';
import { sweetAlertContent, sweetAlertButton } from '../../../../src/support/uiHelpers';

/**
 * MIGRATION NOTE — file paling besar & paling banyak `browser.pause()` kedua setelah
 * menuPermohonanKresun.page.ts. Perubahan utama:
 *   - Semua `browser.pause(...)` DIHAPUS, termasuk yang dipakai sebagai "safety net"
 *     generik ("tunggu halaman fully loaded") — diganti assertion/waitFor pada elemen
 *     konkret yang jadi sinyal state sudah siap.
 *   - `browser.waitUntil(async () => !(await el.isDisplayed()), ...)` (tunggu popup
 *     hilang) -> `locator.waitFor({ state: 'hidden' })`.
 *   - `browser.execute(...)` untuk klik tombol via XPath/dispatch event radio ->
 *     `page.evaluate(...)` dengan logic sama persis.
 *   - `$$`/`$(...)` WDIO -> `page.locator(...)`, `.isExisting()` -> `.count() > 0` atau
 *     `.isVisible()` tergantung konteks aslinya.
 */
export default class AntrianKomiteLayer3 extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get halAntrianKomiteLayer3(): Locator {
    return this.page.locator('h2').filter({ hasText: /^Verifikasi Persetujuan Komite Layer 3$/ });
  }

  get prosesAntrianKomiteLayer3(): Locator {
    return this.page.locator('span').filter({ hasText: /^Proses$/ }).first();
  }

  get titleVerifikasiDokumen(): Locator {
    return this.page.locator('h4').filter({ hasText: /^Verifikasi Dokumen$/ });
  }

  get namaPenerima(): Locator { return this.page.locator('#napem'); }
  get noAnggota(): Locator { return this.page.locator('#no_anggota'); }
  get noPensiun(): Locator { return this.page.locator('#nomor_pensiun'); }

  get fieldCatatan(): Locator {
    return this.page.locator('#keterangan_verifikasi_dokumen');
  }

  get submitVerifikasiBerkas(): Locator {
    return this.page.getByRole('button', { name: 'Submit', exact: true });
  }

  get YaButton(): Locator {
    return sweetAlertButton(this.page, 'Ya');
  }

  get titleVerifikasiInterview(): Locator {
    return this.page.locator('h4').filter({ hasText: /^Verifikasi Interview$/ });
  }

  get fieldCatatanInterview(): Locator {
    return this.page.locator('#keterangan_verifikasi_interview');
  }

  get submitInterviewButton(): Locator {
    return this.page.getByRole('button', { name: 'Submit', exact: true });
  }

  get titleVerifikasiData(): Locator {
    return this.page.locator('h4').filter({ hasText: /^Verifikasi Data$/ });
  }

  get verifikasiDataSesuai(): Locator {
    return this.page.locator('label[for="sesuai_data"]');
  }

  get verifikasiDataTidakSesuai(): Locator {
    return this.page.locator('label[for="tidak_sesuai_data"]');
  }

  get fieldCatatanVerifikasiData(): Locator {
    return this.page.locator('#keterangan_verifikasi_data');
  }

  get submitVerifikasiDataButton(): Locator {
    return this.page.locator(
      '//h4[contains(text(), "Verifikasi Data")]/following::button[contains(text(), "Submit")][1]'
    );
  }

  get popupYaButton(): Locator {
    return sweetAlertButton(this.page, 'Ya');
  }

  get popupTidakButton(): Locator {
    return sweetAlertButton(this.page, 'Tidak');
  }

  get titleResumeVerifikasi(): Locator {
    return this.page.locator('h4').filter({ hasText: /^Resume Verifikasi Persetujuan Kredit$/ });
  }

  get fieldNapem(): Locator { return this.page.locator('#review__napem'); }
  get fieldNopen(): Locator { return this.page.locator('#review__nomor_pensiun'); }
  get btnApproveAntrianKomite3(): Locator { return this.page.locator('#btn_submit_summary_approve'); }
  get btnRejectAntrianKomite3(): Locator { return this.page.locator('#btn_submit_summary_reject'); }

  get successApprovalantrianKomite3(): Locator {
    return sweetAlertContent(this.page);
  }

  get btnOKSuccess(): Locator {
    return sweetAlertButton(this.page, 'OK');
  }

  /**
   * MIGRATION NOTE: `browser.pause(2000)` di awal (tunggu halaman loaded) dan setelah
   * klik "Proses" DIHAPUS — diganti waitFor eksplisit pada elemen label dokumen approval
   * yang jadi sinyal form sudah render. Try/catch dipertahankan sama persis (button
   * "Proses" opsional, tidak semua entry state punya tombol ini).
   */
  async prosesAntrianKomite3(): Promise<void> {
    try {
      const prosesBtn = this.prosesAntrianKomiteLayer3;
      try {
        await prosesBtn.scrollIntoViewIfNeeded();
        await prosesBtn.click({ timeout: 10_000 });
      } catch (error: any) {
        console.warn(`Proses button tidak ditemukan dengan selector pertama: ${error.message}`);
        console.log('Melanjutkan ke step berikutnya...');
      }

      const docLabelElem = this.page.locator('//p[contains(@class, "approve_reject_title")]');
      try {
        await docLabelElem.first().waitFor({ state: 'visible', timeout: 15_000 });
      } catch {
        console.warn('Form approval tidak ditemukan');
      }
    } catch (error: any) {
      console.error(`Error di prosesAntrianKomite3: ${error.message}`);
      throw error;
    }
  }

  normalizeDocumentName(name: string): string {
    return name
      .replace(/\s*\*\s*$/, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async getListOfDocuments(): Promise<string[]> {
    try {
      const documentLabels = await this.page.locator('//p[contains(@class, "approve__reject__title")]').all();
      const documents: string[] = [];

      for (const element of documentLabels) {
        const text = await element.textContent();
        if (text?.trim() && !documents.includes(text.trim())) {
          documents.push(text.trim());
        }
      }
      return documents;
    } catch (error: any) {
      console.error(`Error mengambil documents: ${error.message}`);
      return [];
    }
  }

  async setApprovalStatus(fieldName: string, action: 'approve' | 'pending' | 'reject', reason?: string): Promise<void> {
    try {
      let titleXPath = `//p[contains(@class, 'approve__reject__title') and contains(text(), '${fieldName}')]`;
      let titleElement = this.page.locator(titleXPath);
      let found = (await titleElement.count()) > 0;

      if (!found) {
        const normalizedFieldName = this.normalizeDocumentName(fieldName);
        titleXPath = `//p[contains(@class, 'approve__reject__title') and (contains(text(), '${normalizedFieldName}') or contains(text(), '${fieldName}'))]`;
        titleElement = this.page.locator(titleXPath);
        found = (await titleElement.count()) > 0;
      }

      if (!found) {
        throw new Error(`Dokumen tidak ditemukan: ${fieldName}`);
      }

      const containerPath = titleXPath + `/ancestor::div[contains(@class, 'approve__reject')][1]`;
      let label: Locator | undefined;
      let checkboxId = '';

      if (action === 'approve') {
        const approveCheckbox = this.page.locator(containerPath + `//input[contains(@class, 'approve') and @type='checkbox'][1]`);
        if ((await approveCheckbox.count()) > 0) {
          checkboxId = (await approveCheckbox.getAttribute('id')) || '';
        }
        label = checkboxId
          ? this.page.locator(containerPath + `//label[@for='${checkboxId}']`)
          : this.page.locator(containerPath + `//div[contains(@class, 'radio__group')][1]//label[1]`);
      } else if (action === 'pending') {
        const pendingCheckbox = this.page.locator(containerPath + `//input[contains(@class, 'pending') and @type='checkbox'][1]`);
        if ((await pendingCheckbox.count()) > 0) {
          checkboxId = (await pendingCheckbox.getAttribute('id')) || '';
        }
        label = checkboxId
          ? this.page.locator(containerPath + `//label[@for='${checkboxId}']`)
          : this.page.locator(containerPath + `//div[contains(@class, 'radio__group')][2]//label[1]`);
      } else {
        const rejectCheckbox = this.page.locator(containerPath + `//input[contains(@class, 'reject') and @type='checkbox'][1]`);
        if ((await rejectCheckbox.count()) > 0) {
          checkboxId = (await rejectCheckbox.getAttribute('id')) || '';
        }
        label = checkboxId
          ? this.page.locator(containerPath + `//label[@for='${checkboxId}']`)
          : this.page.locator(containerPath + `//div[contains(@class, 'radio__group')][3]//label[1]`);
      }

      if (!label || (await label.count()) === 0) {
        throw new Error(`Label tidak ditemukan: ${fieldName}`);
      }

      await label.click();

      if ((action === 'reject' || action === 'pending') && reason) {
        await this.setRejectionReason(fieldName, reason);
      }
    } catch (error: any) {
      console.error(`Error setApprovalStatus: ${error.message}`);
      throw error;
    }
  }

  async loadApprovalMapping(): Promise<Record<string, string | string[]>> {
    try {
      const dataPath = path.join(process.cwd(), 'test/src/ddt/dataPermohonanKresun/antrianKomite3.json');

      if (!fs.existsSync(dataPath)) {
        throw new Error(`File tidak ditemukan: ${dataPath}`);
      }

      const fileContent = fs.readFileSync(dataPath, 'utf-8');
      return JSON.parse(fileContent).documentAntrianKomite3 || {};
    } catch (error: any) {
      console.error(`Error loading approval mapping: ${error.message}`);
      throw error;
    }
  }

  async processApprovalWithJson(): Promise<{ total: number; approved: number; pending: number; rejected: number }> {
    const summary = { total: 0, approved: 0, pending: 0, rejected: 0 };

    try {
      await this.page.evaluate(() => window.scrollBy(0, 500));

      const documents = await this.getListOfDocuments();
      if (documents.length === 0) return summary;

      const approvalMapping = await this.loadApprovalMapping();

      for (const docName of documents) {
        try {
          const normalizedDocName = this.normalizeDocumentName(docName);
          const action = approvalMapping[normalizedDocName];

          if (!action) continue;
          if (Array.isArray(action)) {
            const [status, reason] = action;
            if (status === 'Reject') {
              await this.setApprovalStatus(docName, 'reject', reason);
              summary.rejected++;
            } else if (status === 'Pending') {
              await this.setApprovalStatus(docName, 'pending', reason);
              summary.pending++;
            } else if (status === 'Approve') {
              await this.setApprovalStatus(docName, 'approve');
              summary.approved++;
            }
          } else if (action === 'Approve') {
            await this.setApprovalStatus(docName, 'approve');
            summary.approved++;
          } else if (action === 'Reject') {
            await this.setApprovalStatus(docName, 'reject');
            summary.rejected++;
          } else if (action === 'Pending') {
            await this.setApprovalStatus(docName, 'pending');
            summary.pending++;
          }

          summary.total++;
        } catch (error: any) {
          console.error(`Error processing ${docName}: ${error.message}`);
        }
      }

      return summary;
    } catch (error: any) {
      console.error(`Approval processing failed: ${error.message}`);
      throw error;
    }
  }

  async setMultipleApprovals(approvalData: Record<string, 'approve' | 'reject'>): Promise<void> {
    for (const [fieldName, action] of Object.entries(approvalData)) {
      await this.setApprovalStatus(fieldName, action);
    }
  }

  async setRejectionReason(fieldName: string, reason: string): Promise<void> {
    try {
      let titleXPath = `//p[contains(@class, 'approve__reject__title') and contains(text(), '${fieldName}')]`;
      let titleElement = this.page.locator(titleXPath);
      let found = (await titleElement.count()) > 0;

      if (!found) {
        const normalizedFieldName = this.normalizeDocumentName(fieldName);
        titleXPath = `//p[contains(@class, 'approve__reject__title') and (contains(text(), '${normalizedFieldName}') or contains(text(), '${fieldName}'))]`;
        titleElement = this.page.locator(titleXPath);
        found = (await titleElement.count()) > 0;
      }

      if (!found) {
        throw new Error(`Dokumen tidak ditemukan: ${fieldName}`);
      }

      const containerPath = titleXPath + `/ancestor::div[contains(@class, 'approve__reject')][1]`;

      let reasonInput = this.page.locator(containerPath + `//input[starts-with(@name, 'message_') and @type='text']`);
      if ((await reasonInput.count()) === 0) {
        const reasonInputSelectors = [
          `${containerPath}//input[contains(@class, 'reason') and @type='text']`,
          `${containerPath}//input[contains(@placeholder, 'alasan') or contains(@placeholder, 'Alasan')]`,
          `${containerPath}//input[@type='text']`,
          `${containerPath}//textarea[contains(@class, 'reason') or contains(@placeholder, 'alasan')]`,
        ];
        for (const selector of reasonInputSelectors) {
          const elem = this.page.locator(selector);
          if ((await elem.count()) > 0) {
            reasonInput = elem;
            break;
          }
        }
      }

      if (!reasonInput || (await reasonInput.count()) === 0) {
        console.warn(`Reason input tidak ditemukan untuk: ${fieldName}`);
        return;
      }

      await reasonInput.fill(reason);
    } catch (error: any) {
      console.error(`Error setRejectionReason: ${error.message}`);
      throw error;
    }
  }

  async inputCatatan(catatan: string): Promise<void> {
    if ((await this.fieldCatatan.count()) > 0) {
      await this.fieldCatatan.fill(catatan);
    }
  }

  async submitVerifikasi(): Promise<void> {
    await this.submitVerifikasiBerkas.click();
    await this.YaButton.click({ timeout: 5000 });
  }

  async setInterviewStatus(status: 'sesuai' | 'tidak_sesuai', questionText?: string): Promise<void> {
    try {
      const labelText = status === 'sesuai' ? 'Sesuai' : 'Tidak Sesuai';
      let label = this.page.locator(`//label[contains(text(), '${labelText}')]`);

      if (questionText) {
        const row = this.page.locator(`//tr[contains(., '${questionText}')]`);
        if ((await row.count()) > 0) {
          label = row.locator(`//label[contains(text(), '${labelText}')]`);
        }
      }

      if ((await label.count()) === 0) {
        throw new Error(`Label tidak ditemukan: ${labelText}`);
      }

      const radio = label.locator('xpath=preceding-sibling::input[@type="radio"]');
      const isSelected = await radio.isChecked().catch(() => false);
      if (isSelected) return;

      await label.scrollIntoViewIfNeeded();
      await label.click();
    } catch (error: any) {
      console.error(`Error setInterviewStatus: ${error.message}`);
      throw error;
    }
  }

  /**
   * MIGRATION NOTE: `.setValue()` lalu `waitForDisplayed` pada title dipertahankan
   * urutannya sama seperti asli (sedikit aneh — isi catatan dulu baru cek title —
   * tapi ini perilaku asli, bukan bug yang saya perkenalkan).
   */
  async verifyFormVerifikasiInterview(title: string): Promise<boolean> {
    try {
      await this.fieldCatatanInterview.fill(`Catatan untuk interview - ${new Date().toLocaleDateString('id-ID')}`);
      await expect(this.titleVerifikasiInterview).toBeVisible({ timeout: 5000 });
      const text = await this.titleVerifikasiInterview.textContent();
      return text?.trim() === title;
    } catch {
      return false;
    }
  }

  async submitInterview(): Promise<void> {
    await this.submitInterviewButton.click();
    await this.YaButton.click({ timeout: 5000 });
  }

  async setAllInterviewStatus(status: 'sesuai' | 'tidak_sesuai' = 'sesuai'): Promise<void> {
    await this.page.evaluate((selectedStatus: string) => {
      const allRadios = document.querySelectorAll('input[type="radio"]');

      for (const radio of Array.from(allRadios)) {
        const radioElement = radio as HTMLInputElement;
        const radioId = radioElement.getAttribute('id') || '';

        let shouldSelect = false;
        if (selectedStatus === 'sesuai') {
          shouldSelect = radioId.toLowerCase().includes('_sesuai') && !radioId.toLowerCase().includes('tidak_sesuai');
        } else if (selectedStatus === 'tidak_sesuai') {
          shouldSelect = radioId.toLowerCase().includes('tidak_sesuai');
        }

        if (shouldSelect && !radioElement.checked) {
          radioElement.checked = true;
          radioElement.dispatchEvent(new Event('change', { bubbles: true }));
          radioElement.dispatchEvent(new Event('input', { bubbles: true }));
          radioElement.dispatchEvent(new Event('click', { bubbles: true }));

          const label = document.querySelector(`label[for="${radioId}"]`);
          if (label) {
            try {
              label.dispatchEvent(new Event('click', { bubbles: true }));
            } catch {
              // ignore
            }
          }
        }
      }
    }, status);
  }

  async verifyDataSesuai(): Promise<void> {
    await this.verifikasiDataSesuai.click();
  }

  async verifyDataTidakSesuai(): Promise<void> {
    await this.verifikasiDataTidakSesuai.click();
  }

  async inputCatatanVerifikasiData(catatan: string): Promise<void> {
    await this.fieldCatatanVerifikasiData.fill(catatan);
  }

  /**
   * MIGRATION NOTE: `browser.pause(1000)` x2 dihapus. `waitForDisplayed` +
   * `waitForClickable` manual dihapus (auto-wait `.click()`).
   */
  async submitVerifikasiData(): Promise<void> {
    try {
      const btn = this.submitVerifikasiDataButton;
      await btn.scrollIntoViewIfNeeded();
      await btn.click({ timeout: 10_000 });
      await this.popupYaButton.click({ timeout: 5000 });
    } catch (error: any) {
      console.error(`Error submitVerifikasiData: ${error.message}`);
      throw error;
    }
  }

  async verifyPersetujuanKredit(): Promise<void> {
    console.log(`Napem: ${await this.fieldNapem.inputValue()}`);
    console.log(`Nopen: ${await this.fieldNopen.inputValue()}`);
  }

  /**
   * MIGRATION NOTE: `browser.pause(10000)` (10 detik!) sebelum klik "Ya" DIHAPUS —
   * ini kandidat kuat sumber flakiness/durasi test yang tidak perlu di kode asli.
   * `.click()` popup sudah auto-wait sampai tombol actionable; kalau proses approval
   * di backend memang butuh waktu lama sebelum popup konfirmasi muncul, itu harus
   * di-cover lewat timeout eksplisit pada `waitFor`/`click` popup itu sendiri
   * (sudah diberi timeout 15s di bawah), bukan blind wait 10 detik di semua kondisi.
   */
  async ApproveAntrianKomite3(): Promise<void> {
    await this.btnApproveAntrianKomite3.click();
    await this.popupYaButton.click({ timeout: 15_000 });
  }

  async RejectAntrianKomite3(): Promise<void> {
    await this.btnRejectAntrianKomite3.click();
    await this.popupYaButton.click({ timeout: 5000 });
  }

  /**
   * MIGRATION NOTE: `browser.waitUntil(...)` (tunggu popup hilang) -> `waitFor({state:'hidden'})`.
   * `browser.pause(1500)` buffer di akhir DIHAPUS — caller yang butuh state berikutnya
   * akan menunggu elemen konkretnya sendiri lewat auto-wait.
   */
  async closeSuccessPopup(): Promise<void> {
    await this.btnOKSuccess.click({ timeout: 10_000 });
    await this.successApprovalantrianKomite3.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {
      // Element sudah tidak ada di DOM sama sekali = popup sudah hilang, ini bukan error.
    });
  }
}
