export interface Root {
  dataMakroNewReguler: DataMakroNewReguler
  dataMakroTopUp: DataMakroTopUp
  dataMakroTakeOver: DataMakroTakeOver
  dataPospayNewReguler: DataPospayNewReguler
}

export interface DataMakroNewReguler {
  norek_kantor_bayar: string
  tinggi_badan: string
  berat_badan: string
  namaAhliWaris: string
  noReferensi: string
  kode_produk: string
  jenis_SK: string
  jenis_produk: string
  jenis_program: string
  program_pinjaman: string
  kode_instansi: string
  jenis_penggunaan: string
  permohonan_kredit: string
  jangka_waktu: string
}

export interface DataMakroTopUp {
  nopen: string[]
  norek_kantor_bayar: string
  tinggi_badan: string
  berat_badan: string
  namaAhliWaris: string
  noReferensi: string
  kode_produk: string
  jenis_SK: string
  jenis_produk: string
  jenis_program: string
  program_pinjaman: string
  kode_instansi: string
  jenis_penggunaan: string
  permohonan_kredit: string
  jangka_waktu: string
}

export interface DataMakroTakeOver {
  norek_kantor_bayar: string
  tinggi_badan: string
  berat_badan: string
  namaAhliWaris: string
  noReferensi: string
  kode_produk: string
  jenis_SK: string
  jenis_produk: string
  jenis_program: string
  program_pinjaman: string
  kode_instansi: string
  jenis_penggunaan: string
  permohonan_kredit: string
  jangka_waktu: string
  data_mutasi: string
  kantor_asal_mutasi: string
  bank_asal_take_over: string
  biaya_take_over: string
  tipe_pelunasan: string
}

export interface DataPospayNewReguler {
  norek_kantor_bayar: string
  tinggi_badan: string
  berat_badan: string
  namaAhliWaris: string
  noReferensi: string
  kode_produk: string
  jenis_SK: string
  jenis_produk: string
  jenis_program: string
  program_pinjaman: string
  kode_instansi: string
  jenis_penggunaan: string
  permohonan_kredit: string
  jangka_waktu: string
}
