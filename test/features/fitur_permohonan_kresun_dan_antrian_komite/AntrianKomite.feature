Feature: Antrian Komite
@antrianKomite3 @regression
  Scenario: Verifikasi Antrian Komite
    Given Pengguna berada di halaman login
    When Pengguna login dengan "userPusat"
    Then Sistem menampilkan pesan sukses
    When Pengguna membuka menu Verifikasi Komite Kredit Layer 3 "Lending > Komite Kredit Pensiun > Verifikasi Komite Kredit Layer 3"
    Then Sistem menampilkan halaman Verifikasi Persetujuan Komite Layer 3
    Then Verify data Antrian Komite sesuai dengan data yang diajukan pada Permohonan Kresun pada cbs konven
    # Contoh Reject di json --> "NPWP":["Reject","alasan NPWP tidak jelas"]
    When Verifikasi berkas pada Antrian Komite layer 3
    When Submit verifikasi berkas lengkap
    Then Buka form Verifikasi Interview
    When Input hasil interview
    When Submit hasil interview
    Then Menampilkan form Verifikasi Data
    When Verifikasi Keseluruhan Data
    When Submit Verifikasi Data
    Then Menampilkan Form Resume Verifikasi Persetujuan Kredit
    When Approve Permohonan Kresun
    Then Menampilkan pesan berhasil submit
    When refresh ke halaman home "Home"

    # Antrian komite layer 2
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
    # Antrian komite layer 1
    When refresh ke halaman home "Home"
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