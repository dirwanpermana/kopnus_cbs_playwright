Feature: Add Tipe Dokumen

  @ui @tipe_dokumen @add_tipe_dokumen
Scenario: Added New Tipe Dokumen and validate data in table
    Given User berada di halaman login rcs
    When User login dengan akun "HQ_SUPERADMIN"
    Then Berhasil login dan direct ke halaman dashboard
    And Pilih menu "Master > Tipe Dokumen"
    Then Verify halaman Tipe Dokumen
    When User klik tombol Tambah Tipe Dokumen
    Then Verify halaman Tambah Tipe Dokumen
    When Input form tambah tipe dokumen "Dokumen Negara KL"
    Then Klik simpan tipe dokumen
    And validasi success message
    Then Verify data tipe dokumen "Dokumen Negara KL" tampil pada tabel
    When User klik icon aksi pada tipe dokumen "Dokumen Negara KL"
    Then Verify halaman Detail Tipe Dokumen
    And Validasi detail halaman tipe dokumen "Dokumen Negara KL"