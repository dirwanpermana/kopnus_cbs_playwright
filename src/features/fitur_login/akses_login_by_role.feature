Feature: Validasi Menu RCS  

Background:
    Given User berada di halaman login rcs

  @ui @role_user
  Scenario: Login RCS dengan user valid dan validasi menu - HQ_SUPERADMIN
    When User login dengan akun "HQ_SUPERADMIN"
    Then Berhasil login dan direct ke halaman dashboard
    Then Terdapat menu "Dashboard", "Pengajuan Dokumen Saya", "Approval Dokumen"    , "Inventaris Dokumen", "Master", "Settings"
    Then Menu "Master" memiliki submenu berikut:
      | Tipe Dokumen |
    Then Menu "Settings" memiliki submenu berikut:
      | User Management              |
      | Kode Inisial Unit Kerja      |
    When User logout dari aplikasi rcs
    Then Berhasil logout dan direct ke halaman login rcs

  @ui @role_user
  Scenario: Login RCS dengan user valid dan validasi menu - HQ_ADMIN
    When User login dengan akun "HQ_ADMIN"
    Then Berhasil login dan direct ke halaman dashboard
    Then Terdapat menu "Dashboard", "Pengajuan Dokumen Saya", "Approval Dokumen", "Inventaris Dokumen", "Settings"
    Then Menu "Settings" memiliki submenu berikut:
      | User Management              |
      | Kode Inisial Unit Kerja      |
    When User logout dari aplikasi rcs
    Then Berhasil logout dan direct ke halaman login rcs

  @ui @role_user
  Scenario: Login RCS dengan user valid dan validasi menu - HQ_STAFF_ADMIN
    When User login dengan akun "HQ_STAFF_ADMIN"
    Then Berhasil login sebagai "Staff Admin"
    Then Terdapat menu "Dashboard", "Pengajuan Dokumen Saya", "Approval Dokumen", "Inventaris Dokumen", "Settings"
    Then Menu "Settings" memiliki submenu berikut:
      | Kode Inisial Unit Kerja      |
    When User logout dari aplikasi rcs
    Then Berhasil logout dan direct ke halaman login rcs

  @ui @role_user
  Scenario: Login RCS dengan user valid dan validasi menu - HQ_REQUESTER
    When User login dengan akun "HQ_REQUESTER"
    Then Berhasil login sebagai "Requester"
    Then Terdapat menu "Pengajuan Dokumen Saya", "Inventaris Dokumen"
    When User logout dari aplikasi rcs
    Then Berhasil logout dan direct ke halaman login rcs

  @ui @role_user    
  Scenario: Login RCS dengan user valid dan validasi menu - HQ_HEAD_REQUESTER
    When User login dengan akun "HQ_HEAD_REQUESTER"
    Then Berhasil login sebagai "Head Requester"
    Then Terdapat menu "Pengajuan Dokumen Saya", "Approval Dokumen", "Inventaris Dokumen"
    When User logout dari aplikasi rcs
    Then Berhasil logout dan direct ke halaman login rcs