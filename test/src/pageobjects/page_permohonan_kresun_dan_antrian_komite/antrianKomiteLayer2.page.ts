import { Page, Locator, expect } from '@playwright/test';
import BasePage from '../page_login_dashboard/page';
import { sweetAlertContent, sweetAlertButton } from '../../../../src/support/uiHelpers';

type AksiDokumen = 'Approve' | 'Pending' | 'Reject';
type DokumenData = Record<string, AksiDokumen | [AksiDokumen, string]>;

/** MIGRATION NOTE: identik strukturnya dengan AntrianKomiteLayer1 — lihat komentar di sana. */
export default class AntrianKomiteLayer2 extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get halAntrianKomiteLayer2(): Locator {
    return this.page.locator('h2').filter({ hasText: /^Verifikasi Persetujuan Komite Layer 2$/ });
  }

  get prosesAntrianKomiteLayer2(): Locator {
    return this.page.locator('span').filter({ hasText: /^Proses$/ }).first();
  }

  get resumeVerifikasiLayer2(): Locator {
    return this.page.locator('h4').filter({ hasText: /^Resume Verifikasi Persetujuan Kredit Layer 2$/ });
  }

  get catatanVerifikasiDokumen(): Locator {
    return this.page.locator('#layer2__content__body__dokumen__keteragan');
  }

  get btnVerifikasiDokumen(): Locator {
    return this.page.getByRole('button', { name: 'Verifikasi Dokumen', exact: true });
  }

  get titleVerifikasiDokumen(): Locator {
    return this.page.locator('h2').filter({ hasText: /^Verifikasi Dokumen$/ });
  }

  get modalDokumen(): Locator {
    return this.page.locator('#modal__dokumen');
  }

  get simpanVerifikasiDokumen(): Locator {
    return this.page.getByRole('button', { name: 'Simpan', exact: true });
  }

  get popupSimpanVerifikasiDokumen(): Locator {
    return sweetAlertContent(this.page);
  }

  get popupYaButton(): Locator {
    return sweetAlertButton(this.page, 'Ya');
  }

  get berhasilSimpanVerifikasiDokumen(): Locator {
    return sweetAlertContent(this.page);
  }

  get btnOK(): Locator {
    return sweetAlertButton(this.page, 'OK');
  }

  get interview_data_sesuai(): Locator {
    return this.page.locator('input#sesuai_interview_data');
  }

  get interview_data_tdk_sesuai(): Locator {
    return this.page.locator('input#tidak_sesuai_interview_data');
  }

  get catatanVerifikasiInterview(): Locator {
    return this.page.locator('#layer2__content__body__interview__keterangan');
  }

  get catatanVerifikasiData(): Locator {
    return this.page.locator('#layer2__content__body__data__keterangan');
  }

  get verif_data_sesuai(): Locator {
    return this.page.locator('input#sesuai_verifikasi_data');
  }

  get verif_data_tdk_sesuai(): Locator {
    return this.page.locator('input#tidak_sesuai_verifikasi_data');
  }

  get approveLayer2(): Locator {
    return this.page.locator('#btn_submit_approve');
  }

  get pendingLayer2(): Locator {
    return this.page.locator('#btn_submit_pending');
  }

  get rejectLayer2(): Locator {
    return this.page.locator('#btn_submit_reject');
  }

  get successApprovalantrianKomite2(): Locator {
    return this.page.getByText('Submit Data Approval sukses', { exact: true });
  }

  private messageInput(dataId: string): Locator {
    return this.page.locator(`input#message_${dataId}`);
  }

  async prosesNopenAntrianKomiteLayer2(): Promise<void> {
    await this.prosesAntrianKomiteLayer2.click();
  }

  async dropdownDetailAntrianKomiteLayer2(): Promise<void> {
    const dropdowns = await this.page.locator('i.material-icons.f-35').all();
    for (const dropdown of dropdowns) {
      await dropdown.click();
    }
  }

  async catatanVerifikasiDokumenLayer2(catatan: string): Promise<void> {
    await this.catatanVerifikasiDokumen.fill(catatan);
  }

  async bukaModalVerifikasiDokumen(): Promise<void> {
    const isModalOpen = await this.modalDokumen.isVisible().catch(() => false);
    if (isModalOpen) {
      console.log('   Modal sudah terbuka, skip klik tombol Verifikasi Dokumen');
      return;
    }

    await this.btnVerifikasiDokumen.click();
    await expect(this.titleVerifikasiDokumen).toBeVisible({ timeout: 10_000 });
    await expect(this.titleVerifikasiDokumen).toContainText('Verifikasi Dokumen');
    console.log('   Modal Verifikasi Dokumen berhasil dibuka');
  }

  async getDataIdByNama(namaDokumen: string): Promise<string> {
    const hiddenInput = this.page.locator(
      `//p[contains(@class,"approve__reject__title") and normalize-space(text())="${namaDokumen}"]` +
      `/parent::div[contains(@class,"approve__reject")]` +
      `//input[@type="hidden"]`
    );
    await hiddenInput.waitFor({ state: 'attached', timeout: 5000 });
    const dataId = await hiddenInput.getAttribute('value');

    if (!dataId) throw new Error(`data-id tidak ditemukan untuk dokumen "${namaDokumen}"`);

    console.log(`   Dokumen "${namaDokumen}" → data-id: ${dataId}`);
    return dataId;
  }

  private async klikAksi(dataId: string, aksi: string): Promise<boolean> {
    let selector: string;
    switch (aksi.toLowerCase()) {
      case 'approve': selector = `input.approve[data-id="${dataId}"]`; break;
      case 'pending': selector = `input.pending[data-id="${dataId}"]`; break;
      case 'reject': selector = `input.reject[data-id="${dataId}"]`; break;
      default: throw new Error(`Aksi tidak dikenal: "${aksi}"`);
    }

    const result = await this.page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLInputElement | null;
      if (!el) return 'not_found';
      if (el.checked || el.disabled || el.classList.contains('checked')) return 'already_checked';
      el.click();
      return 'clicked';
    }, selector);

    switch (result) {
      case 'already_checked':
        console.log(`   Skip — "${aksi}" data-id="${dataId}" sudah diaksi sebelumnya`);
        return false;
      case 'clicked':
        console.log(`   Klik "${aksi}" data-id="${dataId}" berhasil`);
        return true;
      case 'not_found':
        throw new Error(`Element tidak ditemukan: ${selector}`);
      default:
        return false;
    }
  }

  private async isiCatatan(dataId: string, catatan: string): Promise<void> {
    const inputMsg = this.messageInput(dataId);
    await inputMsg.fill(catatan);
  }

  async prosesSemuaDokumen(dokumenData: DokumenData): Promise<void> {
    for (const [namaDokumen, aksi] of Object.entries(dokumenData)) {
      console.log(`\n── Dokumen: ${namaDokumen}`);
      const dataId = await this.getDataIdByNama(namaDokumen);

      if (Array.isArray(aksi)) {
        const [status, alasan] = aksi;
        if (!alasan || alasan.trim() === '') {
          throw new Error(
            `Dokumen "${namaDokumen}": aksi "${status}" wajib mengisi alasan. Format: ["${status}", "isi alasan"]`
          );
        }
        console.log(`   Aksi: ${status} | Alasan: ${alasan}`);
        const diklik = await this.klikAksi(dataId, status);
        if (diklik) {
          await this.isiCatatan(dataId, alasan);
        }
      } else {
        if (aksi.toLowerCase() !== 'approve') {
          throw new Error(
            `Dokumen "${namaDokumen}": aksi "${aksi}" wajib disertai alasan. Gunakan format: ["${aksi}", "isi alasan"]`
          );
        }
        console.log(`   Aksi: ${aksi}`);
        await this.klikAksi(dataId, aksi);
      }
    }
  }

  async simpanverifikasiDokumenLayer2(): Promise<void> {
    await this.simpanVerifikasiDokumen.click();
    await expect(this.popupSimpanVerifikasiDokumen).toBeVisible({ timeout: 5000 });
    await expect(this.popupSimpanVerifikasiDokumen).toHaveText('Apakah anda yakin?');
    await this.popupYaButton.click();
    await expect(this.berhasilSimpanVerifikasiDokumen).toHaveText('Submit Data Dokumen sukses', { timeout: 8000 });
    await this.btnOK.click();
  }

  async verifikasiInterview(sesuai: boolean, catatan: string): Promise<void> {
    await this.catatanVerifikasiInterview.fill(catatan);
    const target = sesuai ? this.interview_data_sesuai : this.interview_data_tdk_sesuai;
    await target.evaluate((el) => (el as HTMLElement).click());
  }

  async verifikasiData(sesuai: boolean, catatan: string): Promise<void> {
    await this.catatanVerifikasiData.fill(catatan);
    const target = sesuai ? this.verif_data_sesuai : this.verif_data_tdk_sesuai;
    await target.evaluate((el) => (el as HTMLElement).click());
  }

  async submitHasilVerifikasiLayer2(aksi: string): Promise<void> {
    switch (aksi.toLowerCase()) {
      case 'approve':
        await this.approveLayer2.click();
        await this.popupYaButton.click({ timeout: 5000 });
        break;
      case 'pending':
        await this.pendingLayer2.click();
        await this.popupYaButton.click({ timeout: 5000 });
        break;
      case 'reject':
        await this.rejectLayer2.click();
        break;
      default:
        throw new Error(`Aksi tidak dikenal: "${aksi}".`);
    }
  }

  async closePopupLayer2(): Promise<void> {
    if (await this.btnOK.isVisible()) {
      await this.btnOK.click();
    }
  }
}
