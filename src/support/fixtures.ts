import { test as base } from 'playwright-bdd';
import { createBdd } from 'playwright-bdd';
import { dbHelper } from '../../test/src/helpers/DBhelper';

/**
 * MIGRATION NOTE — DB connection lifecycle (WDIO -> Playwright):
 *
 * WDIO asli: dbHelper.connect() dipanggil di hook `before` (wdio.conf.ts), dbHelper.close()
 * di hook `after`. Alasannya didokumentasikan di komentar asli: onPrepare jalan di main
 * process, sedangkan step definitions jalan di worker process terpisah — pool yang dibuat
 * di onPrepare TIDAK ter-share ke worker.
 *
 * Playwright punya masalah proses yang SAMA PERSIS (test workers = child processes terpisah),
 * jadi solusinya pun setara: worker-scoped fixture dengan `scope: 'worker'`.
 * Fixture ini otomatis connect() sekali per worker dan close() sekali saat worker selesai —
 * pengganti tepat untuk hook `before`/`after` di wdio.conf.ts.
 */
type WorkerFixtures = {
  dbConnection: void;
};

const baseWithDb = base.extend<{}, WorkerFixtures>({
  dbConnection: [
    async ({}, use) => {
      await dbHelper.connect();
      await use();
      await dbHelper.close();
    },
    { scope: 'worker', auto: true },
  ],
});

export const test = baseWithDb;

/**
 * IMPORTANT — jangan bungkus Given/When/Then di sini.
 *
 * Ditemukan lewat testing nyata (bukan asumsi): playwright-bdd melakukan STATIC ANALYSIS
 * terhadap source code function yang di-pass ke Given/When/Then untuk tahu fixture apa
 * yang harus di-inject — ia mensyaratkan parameter pertama berupa literal object-destructuring
 * `({ page, ... }) => ...`. Membungkus function itu di runtime (mis. `(fixtures, ...args) => ...`)
 * mengubah signature yang terlihat oleh static analyzer-nya dan bikin `bddgen` gagal dengan:
 * "First argument must use the object destructuring pattern".
 *
 * Karena itu Given/When/Then di-export APA ADANYA dari createBdd(test), tidak dimodifikasi.
 * Screenshot per-step diimplementasikan lewat helper `withStepScreenshot()` (lihat
 * stepScreenshot.ts) yang dipanggil MANUAL di dalam body tiap step — lihat contoh
 * pemakaiannya di test/src/step-definitions/login.ts.
 */
export const { Given, When, Then } = createBdd(test);
