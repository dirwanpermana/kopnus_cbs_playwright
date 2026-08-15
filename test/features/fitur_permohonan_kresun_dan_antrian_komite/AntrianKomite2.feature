Feature: Antrian Komite
@antrianKomite2 @regression
  Scenario: Verifikasi Antrian Komite
    Given Pengguna berada di halaman login
    When Pengguna login dengan "userPusat"
    Then Sistem menampilkan pesan sukses
    When Pengguna membuka menu Verifikasi Komite Kredit Layer 2 "Lending > Komite Kredit Pensiun > Verifikasi Komite Kredit Layer 2"
    Then Sistem menampilkan halaman Verifikasi Persetujuan Komite Layer 2
    When Proses nopen pada antrian komite layer 2
    Then Menampilkan form Resume Verifikasi Persetujuan Kredit Layer 2
    When Pengguna melakukan verifikasi dokumen
    When Simpan verifikasi dokumen pada layer 2
    When Verifikasi Interview
    When Verifikasi Data Nasabah
    When Approve verifikasi komite kredit layer 2
    Then Menampilkan pesan berhasil Approve verifikasi komite kredit layer 2
