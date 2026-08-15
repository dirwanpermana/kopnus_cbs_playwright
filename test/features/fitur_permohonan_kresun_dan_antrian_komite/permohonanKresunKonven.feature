Feature: Permohonan kresun pada cbs konven
@kresun @regression
  Scenario: Mengajukan Permohonan kresun pada cbs konven

    Given Pengguna berada di halaman login
    When Generate nopen melalui database
    When Pengguna login dengan "userCabang"
    Then Sistem menampilkan pesan sukses
    When Pengguna membuka menu permohonan kresun "Kredit > Permohonan Kredit Pensiun"
    Then Sistem menampilkan halaman Permohonan Kredit Pensiun
    # pilih Take Over | Top Up | new (sk di tangan)
    When Pengguna menginput nomor pensiun yang valid dan mengisi form permohonan "new (sk di tangan)"
    When Pengguna Logout dari cbs
    When Insert nopen ke function get_data_antrian_komite_kredit
    