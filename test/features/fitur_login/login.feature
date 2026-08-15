Feature: Login CBS Konvensional Website

  Scenario: Pengguna login pada CBS Konvensional
    Given Pengguna berada di halaman login
    # ubah user sesuai di loginData.json
    When Pengguna login dengan "userCabang"
    Then Sistem menampilkan pesan sukses
