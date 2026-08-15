import { Page, Locator, expect } from '@playwright/test';
import BasePage from '../page_login_dashboard/page';
import { selectSelect2ByText, sweetAlertContent, sweetAlertButton, waitUntilTrue } from '../../../../src/support/uiHelpers';

export default class PermohonanKresun extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ===== Locators =====
  get verifyPermohonanPensiun(): Locator {
    return this.page.locator('h2').filter({ hasText: /^Data Permohonan Pensiun$/ });
  }

  get titleDataGaji(): Locator {
    return this.page.locator('h2').filter({ hasText: /^Data Gaji$/ });
  }

  get fieldNopen(): Locator {
    return this.page.locator('#nopen');
  }

  get searchNopen(): Locator {
    return this.page.getByRole('button', { name: 'Daftar', exact: true });
  }

  get fieldNoPensiun(): Locator {
    return this.page.locator('#nama_pensiun');
  }

  get messageNopenDalamAntrian(): Locator {
    return sweetAlertContent(this.page);
  }

  get buttonOKNopenDalamAntrian(): Locator {
    return sweetAlertButton(this.page, 'OK');
  }

  get fieldNorekKantorBayar(): Locator {
    return this.page.locator('#nomor_rekening_central_giro');
  }

  get fieldTB(): Locator {
    return this.page.locator('#tinggi_badan');
  }

  get fieldBB(): Locator {
    return this.page.locator('#berat_badan');
  }

  get fieldAhliWaris(): Locator {
    return this.page.locator('#btn_input_hubungan');
  }

  get radioAhliWarisYa(): Locator {
    return this.page.getByRole('radio', { name: 'Ya' }).first();
  }

  get submitAhliWaris(): Locator {
    return this.page.getByRole('button', { name: /submit/i }).first();
  }
  get modalInputAhliWaris(): Locator {
  return this.page.locator('.modal').filter({ hasText: 'Input Ahli Waris' }).first();
}

  get dropdownAhliWaris(): Locator {
  return this.modalInputAhliWaris.getByRole('textbox', { name: 'Pilih Hubungan' });
}

  get klikDropdownAhliWaris(): Locator {
    return this.page.locator('#select2-hubungan-results');
  }

  get pilihAnakTesting(): Locator {
    return this.page.getByText('ANAK Testing', { exact: true });
  }

  // get submitAhliWaris(): Locator {
  //   return this.page.locator('.modal-footer button', { hasText: 'Submit' }).last();
  // }

  get fieldNamaAhliWaris(): Locator {
    return this.page.locator('[name="nama_ahli_waris"]');
  }

  get fieldNoReferensi(): Locator {
    return this.page.locator('#nik_referensi');
  }

  // ===== Data Permohonan =====
  get fieldJenisPinjaman(): Locator {
    return this.page.locator('#select2-jenis_pinjaman-container');
  }

  get fieldkodeProduk(): Locator {
    return this.page.locator('#select2-kode_produk-container');
  }

  get fieldJenisSK(): Locator {
    return this.page.locator('#select2-jenis_sk-container');
  }

  get fieldJenisProduk(): Locator {
    return this.page.locator('#select2-jenis_produk-container');
  }

  get fieldJenisProgram(): Locator {
    return this.page.locator('#select2-jenis_program-container');
  }

  get fieldProgramPinjaman(): Locator {
    return this.page.locator('#select2-program_pinjaman-container');
  }

  get fieldKodeInstansi(): Locator {
    return this.page.locator('#select2-kode_instansi-container');
  }

  get fieldJenisPenggunaan(): Locator {
    return this.page.locator('#select2-jenis_penggunaan-container');
  }

  get fieldpermohonanKredit(): Locator {
    return this.page.locator('#permohonan_pembiayaan');
  }

  get fieldJangkaWaktu(): Locator {
    return this.page.locator('#jangka_waktu');
  }

  // ===== Perhitungan Simulasi =====
  get persenGaji(): Locator { return this.page.locator('#persen_gaji'); }
  get persenPerhitungan(): Locator { return this.page.locator('#persen_perhitungan'); }
  get angsuranPerBulan(): Locator { return this.page.locator('#angsuran_per_bulan'); }
  get bunga(): Locator { return this.page.locator('#bunga'); }
  get statusTakeover(): Locator { return this.page.locator('#status_takeover'); }
  get biayaTakeOver(): Locator { return this.page.locator('#biaya_take_over'); }
  get biayaPelunasan(): Locator { return this.page.locator('#biaya_pelunasan'); }
  get biayaAsuransi(): Locator { return this.page.locator('#adm_asuransi'); }
  get saldoBlokir(): Locator { return this.page.locator('#saldo_blokir'); }
  get saldoBlokirNumber(): Locator { return this.page.locator('#saldo_blokir_number'); }
  get biayaAngsuranDiMuka(): Locator { return this.page.locator('#biaya_angsuran_dimuka'); }
  get biayaAngsuranDiMukaNumber(): Locator { return this.page.locator('#biaya_angsuran_dimuka_number'); }
  get biayaKeanggotaan(): Locator { return this.page.locator('#biaya_keanggotaan'); }
  get biayaMaterai(): Locator { return this.page.locator('#biaya_materai'); }
  get terimaBersih(): Locator { return this.page.locator('#terima_bersih'); }
  get sumberDana(): Locator { return this.page.locator('#sumber_dana'); }
  get nominalCashback(): Locator { return this.page.locator('#nominal_cashback'); }
  get rekeningPembiayaanSebelumnya(): Locator { return this.page.locator('#rek_pembiayaan_sebelumnya'); }

  // ===== Submit & Confirmation =====
  get btnOKSubmit(): Locator {
    return this.page.getByRole('button', { name: 'Simpan', exact: true });
  }

  get textPopupSubmit(): Locator {
    return this.page.getByText('Apakah anda yakin data inputan sudah benar?', { exact: true });
  }

  get buttonOKPopupSubmit(): Locator {
    return sweetAlertButton(this.page, 'OK');
  }

  get successSubmitPermohonanKresun(): Locator {
    return sweetAlertContent(this.page);
  }

  get halPermohonanKresun(): Locator {
    return this.verifyPermohonanPensiun;
  }

  // ----- Take Over specific -----
  get fieldMutasi(): Locator { return this.page.locator('#select2-status_mutasi-container'); }
  get pilihNonMutasi(): Locator {
    return this.page.locator('li.select2-results__option').filter({ hasText: /^Non Mutasi$/ });
  }
  get pilihMutasi(): Locator {
    return this.page.locator('li.select2-results__option').filter({ hasText: /^Mutasi$/ });
  }
  get fieldkanTorMutasi(): Locator { return this.page.locator('#select2-kantor_bank_asal-container'); }
  get searchKantorMutasi(): Locator { return this.page.locator('.select2-search__field'); }
  get pilihKantorMutasi(): Locator { return this.page.locator('#select2-kantor_bank_asal-results'); }
  get fieldBankAsalTakeOver(): Locator { return this.page.locator('#select2-bank_asal_take_over-container'); }
  get inputBiayaTakeOver(): Locator { return this.page.locator('div').nth(19).locator('button'); }
  get titleBiayaTakeOver(): Locator { return this.page.locator('#modalBiayaTakOver'); }
  get pelunasanPusat(): Locator { return this.page.getByText('Pusat', { exact: true }); }
  get pelunasanCabang(): Locator { return this.page.getByText('Cabang', { exact: true }); }
  get fieldInputBiayaTakeOver(): Locator { return this.page.locator('#input_biaya_take_over'); }
  get fieldInputNominalBlokir(): Locator { return this.page.locator('#input_nominal_blokir'); }
  get buttonSubmitBiayaTakeOver(): Locator { return this.page.getByRole('button', { name: 'Submit', exact: true }); }
  get fieldTanggalPelunasan(): Locator { return this.page.locator('#tanggal_jadwal_biaya_take_over'); }
  get tanggalPelunasanToday(): Locator { return this.page.locator('table.ui-datepicker-calendar .ui-datepicker-today a'); }

  // ===== Methods =====

  /**
   * MIGRATION NOTE: pengganti loop polling manual (`while(!formFound...)` + `pause(200)`
   * tanpa batas total jelas) dengan `waitUntilTrue()`. `searchNopen.click()` sudah
   * auto-wait sampai tombol actionable, jadi tidak perlu `waitForClickable` manual lagi.
   */
  async inputNopen(nopen: string): Promise<void> {
    await this.fieldNopen.fill(nopen);
    await this.searchNopen.click();

    const formFound = await waitUntilTrue(
      () => this.fieldNoPensiun.isVisible(),
      { timeout: 10_000, interval: 200, message: `Form data pensiun tidak muncul setelah input nopen "${nopen}"` }
    );

    if (formFound) {
      console.log('[inputNopen] Next page loaded successfully');
    } else {
      console.log('[inputNopen] Warning: Form not found within timeout, continuing...');
    }
  }

  /**
   * MIGRATION NOTE: `browser.pause(500)` sebelum cek popup dihapus — `isVisible()`
   * Playwright langsung mengecek state DOM saat ini, tidak butuh delay buatan
   * sebelum query pertama.
   */
  async checkAndHandleAntrianPopup(): Promise<boolean> {
    console.log('Checking untuk antrian popup...');
    const isPopupDisplayed = await this.messageNopenDalamAntrian.isVisible().catch(() => false);

    if (isPopupDisplayed) {
      console.log('Popup antrian ditemukan, klik OK');
      await this.buttonOKNopenDalamAntrian.click();
      return true;
    }

    console.log('Tidak ada popup antrian');
    return false;
  }

  async dataUmumPensiun(): Promise<void> {
    await expect(this.fieldNoPensiun).toBeVisible({ timeout: 8000 });
  }

  async dataAnggota(
    norekKantor: string,
    tinggiBadan: string,
    beratBadan: string,
    namaAhliWaris: string,
    noReferensi: string
  ): Promise<void> {
    await this.fieldNorekKantorBayar.scrollIntoViewIfNeeded();
    await this.fieldNorekKantorBayar.fill(norekKantor);
    await this.fieldTB.fill(tinggiBadan);
    await this.fieldBB.fill(beratBadan);

    await this.fieldAhliWaris.scrollIntoViewIfNeeded();
    await this.fieldAhliWaris.click();
    await this.dropdownAhliWaris.click();
    await this.klikDropdownAhliWaris.click();
    await this.pilihAnakTesting.click();
    await this.submitAhliWaris.click();

    await expect(this.fieldNamaAhliWaris).toBeVisible({ timeout: 5000 });
    await this.fieldNamaAhliWaris.fill(namaAhliWaris);
    await this.fieldNoReferensi.fill(noReferensi);
  }

  async dataGaji(): Promise<void> {
    await expect(this.titleDataGaji).toBeVisible();
  }

  /**
   * MIGRATION NOTE: pengganti `selectDropdownByText` private method asli — sekarang
   * delegasi ke helper reusable `selectSelect2ByText()` di uiHelpers.ts (dipakai juga
   * oleh page object lain nanti), tanpa pause statis di antara buka dropdown -> klik opsi.
   */
  private async selectDropdown(fieldLocator: Locator, searchText: string, fieldName = ''): Promise<void> {
    await selectSelect2ByText(this.page, fieldLocator, searchText, fieldName);
  }

  /**
   * Entry point input Data Permohonan. Routing logic dipisah per jenis program
   * (Take Over / New SK di Tangan / Top Up) — SAMA PERSIS dengan struktur asli.
   */
  async dataPermohonan(
    permohonanKredit: string,
    jangkaWaktu: string,
    jenisProduk: string,
    jenisProgram: string,
    programPinjaman: string,
    jenisPenggunaan: string,
    kodeProduk = 'PINJAMAN',
    jenisSK = 'SK Pensiun',
    kodeInstansi = 'Bogor',
    mutasi = 'Mutasi',
    kantorMutasi = '',
    bankAsalTakeOver = 'Bukopin',
    tipePelunasan = 'Cabang',
    biayaTakeOver = '',
    nominalBlokir = ''
  ): Promise<void> {
    await this.selectDropdown(this.fieldkodeProduk, kodeProduk, 'kode_produk');
    await this.selectDropdown(this.fieldJenisSK, jenisSK, 'jenis_sk');
    await this.selectDropdown(this.fieldJenisProduk, jenisProduk, 'jenis_produk');
    await this.selectDropdown(this.fieldJenisProgram, jenisProgram, 'jenis_program');

    const programDiPilih = jenisProgram.trim().toLowerCase();

    if (programDiPilih === 'take over') {
      await this.handleTakeOver(
        mutasi, kantorMutasi, bankAsalTakeOver, tipePelunasan, biayaTakeOver, nominalBlokir,
        kodeInstansi, jenisPenggunaan, programPinjaman, permohonanKredit, jangkaWaktu
      );
    } else if (programDiPilih === 'new (sk di tangan)') {
      await this.handleNewSkDiTangan(kodeInstansi, jenisPenggunaan, programPinjaman, permohonanKredit, jangkaWaktu);
    } else if (programDiPilih === 'top up') {
      await this.handleTopUp(kodeInstansi, jenisPenggunaan, programPinjaman, permohonanKredit, jangkaWaktu);
    } else {
      throw new Error(`Jenis Program "${jenisProgram}" belum di setting di automation`);
    }
  }

  private async handleTakeOver(
    mutasi: string,
    kantorMutasi: string,
    bankAsalTakeOver: string,
    tipePelunasan: string,
    biayaTakeOver: string,
    _nominalBlokir: string,
    kodeInstansi: string,
    jenisPenggunaan: string,
    programPinjaman: string,
    permohonanKredit: string,
    jangkaWaktu: string
  ): Promise<void> {
    const programLabel = programPinjaman.split(' - ')[0].trim();
    const statusMutasi = mutasi.trim().toLowerCase();
    const tipe = tipePelunasan.trim().toLowerCase();

    await this.selectDropdown(this.fieldProgramPinjaman, programLabel, 'program_pinjaman');
    await this.selectDropdown(this.fieldKodeInstansi, kodeInstansi, 'kode_instansi');
    await this.selectDropdown(this.fieldJenisPenggunaan, jenisPenggunaan, 'jenis_penggunaan');

    await this.fieldMutasi.click();

    if (statusMutasi === 'mutasi') {
      await expect(this.pilihMutasi).toBeVisible({ timeout: 8000 });
      await this.pilihMutasi.click();

      await this.fieldkanTorMutasi.click();
      await expect(this.searchKantorMutasi).toBeVisible();
      await this.searchKantorMutasi.fill(kantorMutasi);
      await expect(this.pilihKantorMutasi).toBeVisible({ timeout: 8000 });
      await this.pilihKantorMutasi.click();
      await this.page.keyboard.press('Enter');
    } else {
      throw new Error(`Status mutasi "${mutasi}" tidak dikenali. Gunakan "Mutasi" atau "Non Mutasi".`);
    }

    await this.fieldpermohonanKredit.fill(String(permohonanKredit));
    await this.fieldJangkaWaktu.fill(String(jangkaWaktu));
    await this.page.keyboard.press('Enter');

    await this.selectDropdown(this.fieldBankAsalTakeOver, bankAsalTakeOver, 'bank_asal_take_over');

    await this.inputBiayaTakeOver.click();
    await expect(this.titleBiayaTakeOver).toBeVisible({ timeout: 5000 });

    if (tipe === 'pusat') {
      await this.pelunasanPusat.click();
    } else if (tipe === 'cabang') {
      await this.pelunasanCabang.click();
    } else {
      throw new Error(`Tipe pelunasan "${tipePelunasan}" tidak dikenali. Gunakan "Pusat" atau "Cabang".`);
    }

    await this.fieldInputBiayaTakeOver.fill(biayaTakeOver);
    await this.fieldTanggalPelunasan.click();
    await this.tanggalPelunasanToday.click();

    await this.buttonSubmitBiayaTakeOver.click();
  }

  private async handleNewSkDiTangan(
    kodeInstansi: string,
    jenisPenggunaan: string,
    programPinjaman: string,
    permohonanKredit: string,
    jangkaWaktu: string
  ): Promise<void> {
    const programLabel = programPinjaman.split(' - ')[0].trim();
    await this.selectDropdown(this.fieldProgramPinjaman, programLabel, 'program_pinjaman');
    await this.selectDropdown(this.fieldKodeInstansi, kodeInstansi, 'kode_instansi');
    await this.selectDropdown(this.fieldJenisPenggunaan, jenisPenggunaan, 'jenis_penggunaan');

    await this.fieldpermohonanKredit.fill(String(permohonanKredit));
    await this.fieldJangkaWaktu.fill(String(jangkaWaktu));
    await this.page.keyboard.press('Enter');
  }

  private async handleTopUp(
    kodeInstansi: string,
    jenisPenggunaan: string,
    programPinjaman: string,
    permohonanKredit: string,
    jangkaWaktu: string
  ): Promise<void> {
    await this.handleNewSkDiTangan(kodeInstansi, jenisPenggunaan, programPinjaman, permohonanKredit, jangkaWaktu);
  }

  /**
   * MIGRATION NOTE: `browser.pause(this.CALCULATION_WAIT)` (5000ms) sebelum baca semua
   * field simulasi DIHAPUS. `.inputValue()` Playwright tidak butuh delay — field-field ini
   * hasil kalkulasi client-side yang re-render otomatis; kalau perlu menunggu nilai berubah,
   * itu tanggung jawab CALLER untuk assert pada field yang relevan, bukan blind wait di sini.
   */
  async perhitunganSimulasiPinjaman(): Promise<void> {
    await this.persenGaji.inputValue();
    await this.persenPerhitungan.inputValue();
    await this.angsuranPerBulan.inputValue();
    await this.bunga.inputValue();
    await this.statusTakeover.inputValue();
    await this.biayaTakeOver.inputValue();
    await this.biayaPelunasan.inputValue();
    await this.biayaAsuransi.inputValue();
    await this.saldoBlokir.inputValue();
    await this.saldoBlokirNumber.inputValue();
    await this.biayaAngsuranDiMuka.inputValue();
    await this.biayaAngsuranDiMukaNumber.inputValue();
    await this.biayaKeanggotaan.inputValue();
    await this.biayaMaterai.inputValue();
    await this.terimaBersih.inputValue();
    await this.sumberDana.inputValue();
    await this.nominalCashback.inputValue();
    await this.rekeningPembiayaanSebelumnya.inputValue();
  }

  async submitPermohonanKresun(): Promise<void> {
    await this.btnOKSubmit.scrollIntoViewIfNeeded();
    await this.btnOKSubmit.click();

    await expect(this.buttonOKPopupSubmit).toBeVisible({ timeout: 5000 });
    await this.buttonOKPopupSubmit.click();
  }

  async verifySuccessSubmit(): Promise<void> {
    const content = this.successSubmitPermohonanKresun;
    await expect(content).toBeVisible({ timeout: 5000 });

    const text = await content.textContent();
    if (text?.includes('Sukses register data')) {
      await expect(content).toContainText('Sukses register data');
    } else {
      await expect(content).toContainText('Sedang memproses...');
    }

    const okButton = this.page.getByRole('button', { name: 'OK', exact: true });
    await expect(okButton).toBeVisible({ timeout: 5000 });
    await okButton.click();
  }
}
