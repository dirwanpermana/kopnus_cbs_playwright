Feature: Antrian Komite
@antrianKomite1 @regression
  Scenario: Verifikasi Antrian Komite
    Given Pengguna berada di halaman login
    When Pengguna login dengan "userPusat"
    Then Sistem menampilkan pesan sukses
    When Pengguna membuka menu Verifikasi Komite Kredit Layer 1 "Lending > Komite Kredit Pensiun > Verifikasi Komite Kredit Layer 1"
    Then Sistem menampilkan halaman Verifikasi Persetujuan Komite Layer 1
    When Proses nopen pada antrian komite layer 1
    Then Menampilkan form Resume Verifikasi Persetujuan Kredit Layer 1
    When Pengguna melakukan verifikasi dokumen layer 1
    When Simpan verifikasi dokumen pada layer 1
    When Verifikasi Interview layer 1
    When Verifikasi Data Nasabah layer 1
    When Approve verifikasi komite kredit layer 1
    Then Menampilkan pesan berhasil Approve verifikasi komite kredit layer 1
