import { type Page, type Locator, expect } from '@playwright/test';
import BasePage from '../page_login_dashboard/page.js';

class PermohonanKresun extends BasePage {
  // ===== Constants =====
  private readonly ELEMENT_WAIT_TIMEOUT = 5000;
  private readonly DROPDOWN_WAIT_TIMEOUT = 8000;
  private readonly DROPDOWN_OPTION_TIMEOUT = 3000;
  private readonly SMALL_PAUSE = 150;
  private readonly MEDIUM_PAUSE = 250;
  private readonly LARGE_PAUSE = 400;
  private readonly CALCULATION_WAIT = 5000;

  constructor(protected readonly page: Page) {
    super(page);
  }

  // ===== Locators =====
  // NOTE: WDIO `tag=text` (exact match) di-convert ke CSS pseudo-class :text-is()
  // yang merupakan exact-text-match Playwright. WDIO `=text` (any tag, exact)
  // di-convert ke `:text-is("...")` tanpa tag prefix.

  get verifyPermohonanPensiun(): Locator {
    return this.page.locator('h2:text-is("Data Permohonan Pensiun")');
  }

  get titleDataGaji(): Locator {
    return this.page.locator('h2:text-is("Data Gaji")');
  }

  get fieldNopen(): Locator {
    return this.page.locator('#nopen');
  }

  get searchNopen(): Locator {
    return this.page.locator('button:text-is("Daftar")');
  }

  get fieldNoPensiun(): Locator {
    return this.page.locator('#nama_pensiun');
  }

  get messageNopenDalamAntrian(): Locator {
    return this.page.locator('#swal2-content');
  }

  get buttonOKNopenDalamAntrian(): Locator {
    return this.page.locator('button:text-is("OK")');
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

  get fieldAgama(): Locator {
    return this.page.locator('#select2-agama-container');
  }

  get pilihAgamaIslam(): Locator {
    return this.page.locator('#select2-agama-result-kltz-1');
  }

  get fieldAhliWaris(): Locator {
    return this.page.locator('#btn_input_hubungan');
  }

  get dropdownAhliWaris(): Locator {
    return this.page.locator('#select2-hubungan-container');
  }

  get klikDropdownAhliWaris(): Locator {
    return this.page.locator('#select2-hubungan-results');
  }

  get pilihAnakTesting(): Locator {
    return this.page.locator(':text-is("ANAK Testing")');
  }

  get submitAhliWaris(): Locator {
    return this.page
      .locator("(//div[contains(@class, 'modal-footer')]//button[normalize-space()='Submit'])[last()]")
      .last();
  }

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
  get persenGaji(): Locator {
    return this.page.locator('#persen_gaji');
  }

  get persenPerhitungan(): Locator {
    return this.page.locator('#persen_perhitungan');
  }

  get angsuranPerBulan(): Locator {
    return this.page.locator('#angsuran_per_bulan');
  }

  get bunga(): Locator {
    return this.page.locator('#bunga');
  }

  get statusTakeover(): Locator {
    return this.page.locator('#status_takeover');
  }

  get biayaTakeOver(): Locator {
    return this.page.locator('#biaya_take_over');
  }

  get biayaPelunasan(): Locator {
    return this.page.locator('#biaya_pelunasan');
  }

  get biayaAsuransi(): Locator {
    return this.page.locator('#adm_asuransi');
  }

  get saldoBlokir(): Locator {
    return this.page.locator('#saldo_blokir');
  }

  get saldoBlokirNumber(): Locator {
    return this.page.locator('#saldo_blokir_number');
  }

  get biayaAngsuranDiMuka(): Locator {
    return this.page.locator('#biaya_angsuran_dimuka');
  }

  get biayaAngsuranDiMukaNumber(): Locator {
    return this.page.locator('#biaya_angsuran_dimuka_number');
  }

  get biayaKeanggotaan(): Locator {
    return this.page.locator('#biaya_keanggotaan');
  }

  get biayaMaterai(): Locator {
    return this.page.locator('#biaya_materai');
  }

  get terimaBersih(): Locator {
    return this.page.locator('#terima_bersih');
  }

  get sumberDana(): Locator {
    return this.page.locator('#sumber_dana');
  }

  get nominalCashback(): Locator {
    return this.page.locator('#nominal_cashback');
  }

  get rekeningPembiayaanSebelumnya(): Locator {
    return this.page.locator('#rek_pembiayaan_sebelumnya');
  }

  // ===== Submit & Confirmation =====
  get btnOKSubmit(): Locator {
    return this.page.locator('button:text-is("Simpan")');
  }

  get textPopupSubmit(): Locator {
    return this.page.locator('div:text-is("Apakah anda yakin data inputan sudah benar?")');
  }

  get buttonOKPopupSubmit(): Locator {
    return this.page.locator('button:text-is("OK")');
  }

  get prosesPermohonan(): Locator {
    return this.page.locator('button:text-is("Proses")');
  }

  get successSubmitPermohonanKresun(): Locator {
    return this.page.locator('#swal2-content');
  }

  get halPermohonanKresun(): Locator {
    return this.verifyPermohonanPensiun;
  }

  // --- Locator untuk flow Take Over ---
  get fieldMutasi(): Locator {
    return this.page.locator('#select2-status_mutasi-container');
  }

  get pilihNonMutasi(): Locator {
    return this.page.locator(
      '//li[contains(@class, "select2-results__option")][normalize-space(text())="Non Mutasi"]'
    );
  }

  get pilihMutasi(): Locator {
    return this.page.locator(
      '//li[contains(@class, "select2-results__option")][normalize-space(text())="Mutasi"]'
    );
  }

  get opsiMutasi(): Locator {
    return this.page.locator('.select2-results__options');
  }

  get fieldkanTorMutasi(): Locator {
    return this.page.locator('#select2-kantor_bank_asal-container');
  }

  get searchKantorMutasi(): Locator {
    return this.page.locator('.select2-search__field');
  }

  get pilihKantorMutasi(): Locator {
    return this.page.locator('//ul[@id="select2-kantor_bank_asal-results"]');
  }

  get fieldBankAsalTakeOver(): Locator {
    return this.page.locator('#select2-bank_asal_take_over-container');
  }

  get inputBiayaTakeOver(): Locator {
    return this.page.locator('//div[20]/div/button');
  }

  get titleBiayaTakeOver(): Locator {
    return this.page.locator('#modalBiayaTakOver');
  }

  get pelunasanPusat(): Locator {
    return this.page.locator('label:text-is("Pusat")');
  }

  get pelunasanCabang(): Locator {
    return this.page.locator('label:text-is("Cabang")');
  }

  get fieldInputBiayaTakeOver(): Locator {
    return this.page.locator('#input_biaya_take_over');
  }

  // TODO: sesuaikan selector ini dengan id/atribut sebenarnya di modal Biaya Take Over
  get fieldInputNominalBlokir(): Locator {
    return this.page.locator('#input_nominal_blokir');
  }

  get buttonSubmitBiayaTakeOver(): Locator {
    return this.page.locator('button:text-is("Submit")');
  }

  get fieldTanggalPelunasan(): Locator {
    return this.page.locator('#tanggal_jadwal_biaya_take_over');
  }

  get tanggalPelunasanToday(): Locator {
    return this.page.locator('table.ui-datepicker-calendar .ui-datepicker-today a');
  }

  // Tambahan field khusus Produk 3O
  get field_penghasilan_lain(): Locator {
    return this.page.locator('#sumber_penghasilan_lainnya');
  }

  get field_nom_penghasilan_lain(): Locator {
    return this.page.locator('#nominal_penghasilan_lainnya');
  }

  get popup_informasi_jateng(): Locator {
    return this.page.locator('#form-jateng > div.modal-body');
  }

  get btn_lanjutkan(): Locator {
    return this.page.locator('#btn-simpan-jateng');
  }

  // ===== Actions =====

  async inputNopen(nopen: string): Promise<void> {
    await this.fieldNopen.waitFor({ state: 'visible', timeout: 10000 });
    console.log(`[inputNopen] fieldNopen is displayed, setting value: ${nopen}`);
    await this.fieldNopen.fill(nopen);
    await this.searchNopen.click();
    await this.page.waitForTimeout(1000);

    let formFound = false;
    const startTime = Date.now();
    const maxWait = 10000;

    while (!formFound && Date.now() - startTime < maxWait) {
      try {
        const fieldExists = (await this.fieldNoPensiun.count()) > 0;
        if (fieldExists) {
          console.log(`[inputNopen] Form field found`);
          formFound = true;
          break;
        }
      } catch {
        // Field check failed, continue looping
      }

      if (!formFound) {
        await this.page.waitForTimeout(200);
      }
    }

    if (!formFound) {
      console.log(`[inputNopen] Warning: Form not found after ${Date.now() - startTime}ms, continuing...`);
      await this.page.waitForTimeout(2000);
    } else {
      console.log(`[inputNopen] Next page loaded successfully`);
    }
  }

  async checkAndHandleAntrianPopup(): Promise<boolean> {
    console.log('Checking untuk antrian popup (simple check)...');
    await this.page.waitForTimeout(500);

    try {
      const isPopupDisplayed = await this.messageNopenDalamAntrian.isVisible();

      if (isPopupDisplayed) {
        console.log('Popup antrian ditemukan, klik OK');
        await this.page.waitForTimeout(100);
        await this.buttonOKNopenDalamAntrian.click();
        await this.page.waitForTimeout(100);
        return true;
      }

      console.log('Tidak ada popup antrian');
      return false;
    } catch (error) {
      console.log('Popup antrian tidak ditemukan (timeout atau not found)');
      return false;
    }
  }

  async dataUmumPensiun(): Promise<void> {
    console.log('[dataUmumPensiun] Waiting untuk fieldNoPensiun...');
    await this.fieldNoPensiun.waitFor({ state: 'visible', timeout: 8000 });
    console.log('[dataUmumPensiun] fieldNoPensiun is displayed');
    await this.page.waitForTimeout(this.MEDIUM_PAUSE);
  }

  async dataAnggota(
    norekKantor: string,
    tinggiBadan: string,
    beratBadan: string,
    namaAhliWaris: string,
    noReferensi: string
  ): Promise<void> {
    // Input nomor rekening kantor bayar
    console.log('[dataAnggota] Waiting untuk fieldNorekKantorBayar...');
    await this.fieldNorekKantorBayar.waitFor({ state: 'visible', timeout: 8000 });
    await this.page.waitForTimeout(300);
    await this.fieldNorekKantorBayar.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(200);
    await this.fieldNorekKantorBayar.fill(norekKantor);
    await this.fieldTB.fill(tinggiBadan);
    await this.fieldBB.fill(beratBadan);

    // Input ahli waris
    await this.fieldAhliWaris.waitFor({ state: 'visible', timeout: 8000 });
    await this.page.waitForTimeout(300);
    await this.fieldAhliWaris.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(200);
    await this.fieldAhliWaris.click();
    await this.page.waitForTimeout(500);
    await this.dropdownAhliWaris.click();
    await this.page.waitForTimeout(300);
    await this.klikDropdownAhliWaris.click();
    await this.page.waitForTimeout(this.LARGE_PAUSE);
    await this.pilihAnakTesting.click();
    await this.page.waitForTimeout(this.LARGE_PAUSE);
    await this.submitAhliWaris.click();
    await this.page.waitForTimeout(this.LARGE_PAUSE);

    await this.fieldNamaAhliWaris.waitFor({ state: 'visible', timeout: this.ELEMENT_WAIT_TIMEOUT });
    await this.fieldNamaAhliWaris.fill(namaAhliWaris);
    await this.fieldNoReferensi.fill(noReferensi);
    await this.page.waitForTimeout(this.LARGE_PAUSE);
  }

  async dataGaji(): Promise<void> {
    await this.titleDataGaji.waitFor({ state: 'visible' });
  }

  /**
   * Select dropdown dengan 3-tier fallback strategy:
   * 1. Exact text match (paling reliable, prioritas utama)
   * 2. Partial/contains text match
   * 3. Case-insensitive XPath fallback
   *
   * Playwright auto-wait sudah handle sebagian besar dynamic loading,
   * tapi tetap eksplisit waitFor untuk konsistensi dengan flow lama.
   */
  private async selectDropdownByText(fieldLocator: Locator, searchText: string, fieldName = ''): Promise<void> {
    try {
      await fieldLocator.click();
      await this.page.waitForTimeout(this.LARGE_PAUSE);

      const dropdownList = this.page.locator('.select2-dropdown');
      await dropdownList.waitFor({ state: 'visible', timeout: this.DROPDOWN_WAIT_TIMEOUT });
      await this.page.waitForTimeout(this.MEDIUM_PAUSE);

      // Scope pencarian ke dalam container hasil dropdown, bukan seluruh halaman,
      // supaya tidak salah tangkap elemen lain yang kebetulan punya teks sama.
      const resultsContainer = this.page.locator('.select2-results__options');

      // Strategi 1: exact text match
      let dropdownOption = resultsContainer.getByText(searchText, { exact: true });

      try {
        await dropdownOption.waitFor({ state: 'visible', timeout: this.DROPDOWN_OPTION_TIMEOUT });
      } catch {
        // Strategi 2: partial/contains text match
        try {
          dropdownOption = resultsContainer.getByText(searchText, { exact: false });
          await dropdownOption.waitFor({ state: 'visible', timeout: this.DROPDOWN_OPTION_TIMEOUT });
        } catch {
          // Strategi 3: fallback XPath case-insensitive, pakai contains(., ...) BUKAN
          // contains(text(), ...) supaya tetap baca text dari nested element/descendant.
          dropdownOption = this.page.locator(
            `//li[contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${searchText.toLowerCase()}')]`
          );
          await dropdownOption.waitFor({ state: 'visible', timeout: this.DROPDOWN_OPTION_TIMEOUT });
        }
      }

      await dropdownOption.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(this.SMALL_PAUSE);
      await dropdownOption.click();
      await this.page.waitForTimeout(this.LARGE_PAUSE);
    } catch (error) {
      throw new Error(`Failed to select "${searchText}" from dropdown "${fieldName}": ${error}`);
    }
  }

  /**
   * Entry point input Data Permohonan.
   * Routing logic dipisah per jenis program (Take Over / New SK di Tangan / Top Up)
   * supaya masing-masing flow mudah dipelihara secara independen.
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
    // ===== Parameter khusus Take Over =====
    mutasi = 'Mutasi',
    kantorMutasi = '',
    bankAsalTakeOver = 'Bukopin',
    tipePelunasan = 'Cabang',
    biayaTakeOver = '',
    nominalBlokir = '',
    // ===== Parameter khusus Kode Produk 3O =====
    penghasilanLain = '',
    nomPenghasilanLain = ''
  ): Promise<void> {
    await this.selectDropdownByText(this.fieldkodeProduk, kodeProduk, 'kode_produk');
    await this.selectDropdownByText(this.fieldJenisSK, jenisSK, 'jenis_sk');
    await this.selectDropdownByText(this.fieldJenisProduk, jenisProduk, 'jenis_produk');
    await this.selectDropdownByText(this.fieldJenisProgram, jenisProgram, 'jenis_program');

    const programDiPilih = jenisProgram.trim().toLowerCase();

    console.log(`\n[DEBUG] Jenis Program yang dikirim dari test data: "${jenisProgram}"`);
    console.log(`[DEBUG] Setelah normalisasi (trim & lowercase): "${programDiPilih}"\n`);

    if (programDiPilih === 'take over') {
      await this.handleTakeOver(
        mutasi,
        kantorMutasi,
        bankAsalTakeOver,
        tipePelunasan,
        biayaTakeOver,
        nominalBlokir,
        kodeInstansi,
        jenisPenggunaan,
        programPinjaman,
        permohonanKredit,
        jangkaWaktu
      );
    } else if (programDiPilih === 'new (sk di tangan)') {
      await this.handleNewSkDiTangan(kodeInstansi, jenisPenggunaan, programPinjaman, permohonanKredit, jangkaWaktu);
    } else if (programDiPilih === 'top up') {
      await this.handleTopUp(kodeInstansi, jenisPenggunaan, programPinjaman, permohonanKredit, jangkaWaktu);
    } else {
      throw new Error(`Jenis Program "${jenisProgram}" belum di setting di automation`);
    }

    // ===== Cek Kode Produk setelah handler jenis program selesai (berlaku utk New/TopUp/TakeOver) =====
    // Ambil kode di depan tanda "-" saja, abaikan label "PINJAMAN A"/"PINJAMAN B"
    // Contoh: "3O - PINJAMAN A" -> "3O" | "3B - PINJAMAN B" -> "3B"
    const kodeProdukSaja = kodeProduk.split('-')[0].trim().toUpperCase();

    console.log(`\n[DEBUG] Kode Produk yang dikirim: "${kodeProduk}"`);
    console.log(`[DEBUG] Setelah parsing (ambil kode saja): "${kodeProdukSaja}"\n`);

    if (kodeProdukSaja === '3O') {
      console.log('[dataPermohonan] Kode Produk = 3O, input field penghasilan lain wajib diisi');

      await this.field_penghasilan_lain.waitFor({ state: 'visible', timeout: this.ELEMENT_WAIT_TIMEOUT });
      await this.field_penghasilan_lain.fill(penghasilanLain);
      await this.page.waitForTimeout(this.SMALL_PAUSE);

      await this.field_nom_penghasilan_lain.waitFor({ state: 'visible', timeout: this.ELEMENT_WAIT_TIMEOUT });
      await this.field_nom_penghasilan_lain.fill(nomPenghasilanLain);
      await this.page.waitForTimeout(this.SMALL_PAUSE);
    } else {
      console.log(`[dataPermohonan] Kode Produk = "${kodeProdukSaja}" (bukan 3O), field penghasilan lain di-skip`);
    }
  }

  /**
   * Flow khusus Jenis Program = "Take Over"
   * - Pilih Mutasi / Non Mutasi
   * - Jika Mutasi: pilih Kantor Bank Asal
   * - Input Permohonan Kredit & Jangka Waktu
   * - Pilih Bank Asal Take Over (default: Bukopin)
   * - Buka modal Biaya Take Over -> pilih radio Pusat/Cabang -> input biaya & nominal blokir
   */
  private async handleTakeOver(
    mutasi: string,
    kantorMutasi: string,
    bankAsalTakeOver: string,
    tipePelunasan: string,
    biayaTakeOver: string,
    nominalBlokir: string,
    kodeInstansi: string,
    jenisPenggunaan: string,
    programPinjaman: string,
    permohonanKredit: string,
    jangkaWaktu: string
  ): Promise<void> {
    const programLabel = programPinjaman.split(' - ')[0].trim();
    const statusMutasi = mutasi.trim().toLowerCase();
    const tipe = tipePelunasan.trim().toLowerCase();

    await this.selectDropdownByText(this.fieldProgramPinjaman, programLabel, 'program_pinjaman');
    await this.selectDropdownByText(this.fieldKodeInstansi, kodeInstansi, 'kode_instansi');
    await this.selectDropdownByText(this.fieldJenisPenggunaan, jenisPenggunaan, 'jenis_penggunaan');

    // ----- Pilih Mutasi / Non Mutasi -----
    await this.fieldMutasi.click();
    await this.page.waitForTimeout(this.LARGE_PAUSE);

    if (statusMutasi === 'mutasi') {
      await this.pilihMutasi.waitFor({ state: 'visible', timeout: this.DROPDOWN_WAIT_TIMEOUT });
      await this.pilihMutasi.click();

      // ----- Kantor Bank Asal (hanya muncul kalau pilih mutasi Mutasi) -----
      await this.page.waitForTimeout(3000);
      await this.fieldkanTorMutasi.click();
      await this.searchKantorMutasi.waitFor({ state: 'visible' });
      await this.searchKantorMutasi.fill(kantorMutasi);
      await this.pilihKantorMutasi.waitFor({ state: 'visible', timeout: this.DROPDOWN_WAIT_TIMEOUT });
      await this.pilihKantorMutasi.click();
      await this.page.waitForTimeout(this.MEDIUM_PAUSE);
      await this.page.keyboard.press('Enter');
    } else {
      throw new Error(`Status mutasi "${mutasi}" tidak dikenali. Gunakan "Mutasi" atau "Non Mutasi".`);
    }

    await this.fieldpermohonanKredit.fill(String(permohonanKredit));
    await this.page.waitForTimeout(this.SMALL_PAUSE);

    await this.fieldJangkaWaktu.fill(String(jangkaWaktu));
    await this.page.waitForTimeout(this.SMALL_PAUSE);
    await this.page.keyboard.press('Enter');

    // ----- Bank Asal Take Over (default: Bukopin) -----
    await this.selectDropdownByText(this.fieldBankAsalTakeOver, bankAsalTakeOver, 'bank_asal_take_over');

    // ----- Modal Biaya Take Over -----
    await this.inputBiayaTakeOver.click();
    await this.titleBiayaTakeOver.waitFor({ state: 'visible', timeout: this.ELEMENT_WAIT_TIMEOUT });

    // ----- Radio button Pusat / Cabang -----
    if (tipe === 'pusat') {
      await this.pelunasanPusat.click();
    } else if (tipe === 'cabang') {
      await this.pelunasanCabang.click();
    } else {
      throw new Error(`Tipe pelunasan "${tipePelunasan}" tidak dikenali. Gunakan "Pusat" atau "Cabang".`);
    }
    await this.page.waitForTimeout(this.SMALL_PAUSE);

    // ----- Input Biaya Take Over -----
    await this.fieldInputBiayaTakeOver.fill(biayaTakeOver);
    await this.page.waitForTimeout(this.SMALL_PAUSE);
    await this.fieldTanggalPelunasan.click();
    await this.tanggalPelunasanToday.click();

    await this.buttonSubmitBiayaTakeOver.click();
    await this.page.waitForTimeout(this.LARGE_PAUSE);
  }

  /**
   * Flow khusus Jenis Program = "New (SK di Tangan)"
   */
  private async handleNewSkDiTangan(
    kodeInstansi: string,
    jenisPenggunaan: string,
    programPinjaman: string,
    permohonanKredit: string,
    jangkaWaktu: string
  ): Promise<void> {
    const programLabel = programPinjaman.split(' - ')[0].trim();
    await this.selectDropdownByText(this.fieldProgramPinjaman, programLabel, 'program_pinjaman');
    await this.selectDropdownByText(this.fieldKodeInstansi, kodeInstansi, 'kode_instansi');
    await this.selectDropdownByText(this.fieldJenisPenggunaan, jenisPenggunaan, 'jenis_penggunaan');
    await this.page.waitForTimeout(this.MEDIUM_PAUSE);

    await this.fieldpermohonanKredit.fill(String(permohonanKredit));
    await this.page.waitForTimeout(this.SMALL_PAUSE);

    await this.fieldJangkaWaktu.fill(String(jangkaWaktu));
    await this.page.waitForTimeout(this.SMALL_PAUSE);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Flow khusus Jenis Program = "Top Up"
   * Saat ini flow-nya identik dengan New SK di Tangan, dipisah sebagai method
   * sendiri supaya kalau ada perbedaan logic nanti, tidak perlu sentuh dataPermohonan lagi.
   */
  private async handleTopUp(
    kodeInstansi: string,
    jenisPenggunaan: string,
    programPinjaman: string,
    permohonanKredit: string,
    jangkaWaktu: string
  ): Promise<void> {
    await this.handleNewSkDiTangan(kodeInstansi, jenisPenggunaan, programPinjaman, permohonanKredit, jangkaWaktu);
  }

  async perhitunganSimulasiPinjaman(): Promise<void> {
    await this.page.waitForTimeout(this.CALCULATION_WAIT);
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
    const simpanBtn = this.btnOKSubmit;
    await simpanBtn.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(this.LARGE_PAUSE);
    await simpanBtn.click();
    await this.page.waitForTimeout(1500);

    await this.prosesPermohonan.waitFor({ state: 'visible', timeout: this.ELEMENT_WAIT_TIMEOUT });
    await this.prosesPermohonan.click();

    // NOTE: WDIO punya waitForClickable() yang tidak ada padanan 1:1 di Playwright,
    // karena Playwright auto-wait actionability saat .click() dipanggil.
    // Di sini kita cukup pastikan elemen visible dulu sebelum cek kondisional-nya.
    await this.btn_lanjutkan.waitFor({ state: 'visible', timeout: this.ELEMENT_WAIT_TIMEOUT }).catch(() => {
      // Popup "Data Review" tidak muncul dalam timeout - lanjut seperti biasa
    });

    try {
      const isPopupReviewMuncul = await this.btn_lanjutkan.isVisible();
      if (isPopupReviewMuncul) {
        await this.btn_lanjutkan.click();
        await this.page.waitForTimeout(this.MEDIUM_PAUSE);
      } else {
        console.log('[submitPermohonanKresun] Popup "Data Review" tidak muncul, lanjut seperti biasa');
      }
    } catch {
      console.log('[submitPermohonanKresun] Popup "Data Review" tidak ditemukan (timeout/not exist), lanjut seperti biasa');
    }
  }

  async verifySuccessSubmit(): Promise<void> {
    if (await this.successSubmitPermohonanKresun.isVisible()) {
      await this.page.waitForTimeout(1500);
      await expect(this.successSubmitPermohonanKresun).toHaveText('Sukses register data');
    } else {
      await expect(this.successSubmitPermohonanKresun).toHaveText('Sedang memproses...');
    }
    const OKbutton = this.page.locator('button:text-is("OK")');
    await OKbutton.waitFor({ state: 'visible', timeout: this.ELEMENT_WAIT_TIMEOUT });
    await OKbutton.click();
  }
}

export default PermohonanKresun;