Feature: Login RCS valid

@ui @login_valid @regression
  Scenario: Login RCS dengan user valid
    Given User berada di halaman login rcs
    When User login dengan akun "HQ_SUPERADMIN"
    Then Berhasil login dan direct ke halaman dashboard