export interface Root {
  documentAntrianKomite3: DocumentAntrianKomite3
  antrianKomite2: AntrianKomite2
  antrianKomite1: AntrianKomite1
}

export interface DocumentAntrianKomite3 {
  "E-KTP": string[]
  "Kartu Keluarga (KK) debitur": string
  "Kartu Keluarga (KK) ahli waris": string[]
  "E-KTP suami/ Istri atau ahli waris": string[]
  NPWP: string[]
  "Tanda Terima Penyerahan Jaminan": string
  "Display Gaji": string[]
  "Disposisi/ Odoo persetujuan pusat": string[]
  "Surat Keterangan Kesehatan Tertanggung (SKKT) atau SPA": string[]
  "Surat Keputusan Pensiun (SKEP)": string[]
  "KARIP/ E-KARIP/ Buku Asabri": string
  "Form Keanggotaan": string[]
  "Surat Keterangan Sisa Uang Pensiun (SKSUP)": string
  "Aplikasi Permohonan Pinjaman Pensiun": string
  "Surat pernyataan/surat keterangan dari dari kantor bayar": string
  "Bukti Setor": string
  "Lainnya 3": string[]
}

export interface AntrianKomite2 {
  "E-KTP": string
  "Kartu Keluarga (KK) debitur": string
  "Kartu Keluarga (KK) ahli waris": string
  NPWP: string
  "Tanda Terima Penyerahan Jaminan": string
  "Display Gaji": string
  "Surat Keputusan Pensiun (SKEP)": string
  "KARIP/ E-KARIP/ Buku Asabri": string
  "Form Keanggotaan": string
  "Surat Keterangan Sisa Uang Pensiun (SKSUP)": string
  "Aplikasi Permohonan Pinjaman Pensiun": string
  "Surat pernyataan/surat keterangan dari dari kantor bayar": string
  "Bukti Setor": string
}

export interface AntrianKomite1 {
  "E-KTP": string
  "Kartu Keluarga (KK) debitur": string
  "Kartu Keluarga (KK) ahli waris": string
  NPWP: string
  "Tanda Terima Penyerahan Jaminan": string
  "Display Gaji": string[]
  "Disposisi/ Odoo persetujuan pusat": string[]
  "Surat Keterangan Kesehatan Tertanggung (SKKT) atau SPA": string[]
  "Surat Keputusan Pensiun (SKEP)": string
  "KARIP/ E-KARIP/ Buku Asabri": string
  "Form Keanggotaan": string
  "Surat Keterangan Sisa Uang Pensiun (SKSUP)": string
  "Aplikasi Permohonan Pinjaman Pensiun": string
  "Surat pernyataan/surat keterangan dari dari kantor bayar": string
  "Bukti Setor": string
}
