import * as fs from 'node:fs';
import * as path from 'node:path';
import { dbHelper } from '../helpers/DBhelper';

/**
 * MIGRATION NOTE: tidak berubah dari versi asli. Dependency-nya hanya dbHelper + fs/path,
 * tidak ada API WDIO. `resetNopenLogFile()` sekarang dipanggil dari `global-setup.ts`
 * (pengganti `onPrepare` di wdio.conf.ts).
 */
class NopenState {
  private _nopen: string | null = null;

  set(value: string): void {
    this._nopen = value;
  }

  get(): string {
    if (!this._nopen) {
      throw new Error(
        '[NopenState] Nopen belum di-generate. Pastikan step "Generate nopen melalui database" dijalankan terlebih dahulu.'
      );
    }
    return this._nopen;
  }

  clear(): void {
    this._nopen = null;
  }
}

export const nopenState = new NopenState();
const NOPEN_LOG_PATH = path.join(process.cwd(), 'logs', 'nopen-generated.log');

export function resetNopenLogFile(): void {
  const dir = path.dirname(NOPEN_LOG_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(NOPEN_LOG_PATH, '', { encoding: 'utf-8' });
}

function appendNopenLog(nopen: string): void {
  const timestamp = new Date().toISOString();
  const line = `Nopen berhasil tergenarate : ${nopen} pada ${timestamp}`;

  try {
    const dir = path.dirname(NOPEN_LOG_PATH);
    fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(NOPEN_LOG_PATH, line, { encoding: 'utf-8' });
  } catch (error) {
    console.warn(`[NopenLog] Gagal menulis log nopen ke file: ${error}`);
  }
}

export async function generateNopen(): Promise<string> {
  const nopen = await dbHelper.callScalarFunction('generate_permohonan_kresun_yudhi', [1, 509]);

  nopenState.set(nopen);
  appendNopenLog(nopen);

  return nopen;
}
