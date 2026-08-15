export interface TipeDokumenTestCase {
status: 'Aktif' | 'Inaktif';   
  namaTipeDok: string;
  kodeTipeDok: string;
  formatDok: string; // comma-separated: 'Bulan', '-', 'Tahun' — jangan sisipkan koma di dalam label
  formatBulan?: string;
  formatTahun?: string;
  templateDok: string;
  infoTambahan?: string;

  // --- Dipakai untuk validasi tabel & halaman detail ---
  statusDisplay: 'Active' | 'Inactive'; // representasi status setelah disimpan (Aktif→Active, Inaktif→Inactive)
  formatPenomoran: string; // representasi gabungan formatDok setelah disimpan, mis. "Bulan-Tahun"
  lastUser: string;
}

// Key = nama tipe dokumen, dipakai sebagai reference di feature file & step definition
export const tipeDokumenTestData: Record<string, TipeDokumenTestCase> = {
  'Dokumen Negara KL': {
    status: 'Inaktif',
    namaTipeDok: 'Dokumen Negara KL',
    kodeTipeDok: 'DOLA',
    formatDok: 'Bulan,-,Tahun',
    formatBulan: 'Huruf',
    formatTahun: '2 Digit',
    templateDok: 'dokumen_testing.pdf',
    infoTambahan: undefined,

    statusDisplay: 'Inactive',
    formatPenomoran: 'Bulan-Tahun',
    lastUser: 'Adi Superadmin',
  },

  // 'Dokumen Negara F': {
  //   status: 'Aktif',
  //   namaTipeDok: 'Dokumen Negara F',
  //   kodeTipeDok: 'DIDB',
  //   formatDok: 'Bulan,-,Tahun',
  //   formatBulan: 'Huruf',
  //   formatTahun: '2 Digit',
  //   templateDok: 'dokumen_testing.pdf',
  //   infoTambahan: '-',

  //   statusDisplay: 'Active',
  //   formatPenomoran: 'Bulan-Tahun',
  //   lastUser: 'Adi Superadmin',
  // },
};

// Helper untuk ambil 1 test case dengan error yang jelas kalau key tidak ada
export function getTipeDokumenTestCase(key: string): TipeDokumenTestCase {
  const data = tipeDokumenTestData[key];
  if (!data) {
    throw new Error(
      `Test data untuk Tipe Dokumen "${key}" tidak ditemukan di tipe_dokumen.data.ts. ` +
      `Key yang tersedia: ${Object.keys(tipeDokumenTestData).join(', ')}`
    );
  }
  return data;
}