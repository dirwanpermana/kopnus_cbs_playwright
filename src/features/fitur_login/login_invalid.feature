Feature: Login RCS Invalid

  @ui @login_invalid
  Scenario Outline: Login RCS dengan user invalid - <scenario>
    Given User berada di halaman login rcs
    When Login dengan scenario "<scenario>"
    Then Login gagal dan menampilkan message "<expectedErrorMessage>"

    Examples:
      | scenario                  | expectedErrorMessage       |
      | Invalid NIK and Password  | NIK Tidak Terdaftar (04J)  |
      | Invalid Password          | Password Salah (04A)       |
      | NIK Kosong                | Kolom wajib diisi          |
      | Password Kosong           | Kolom wajib diisi          |
      | Akun Inactive             | Akun Sudah Tidak Aktif, Hubungi IT Operasional untuk informasi lebih lanjut. (04A)       |