import * as fs from 'fs';
import * as path from 'path';

/**
 * MIGRATION NOTE: tidak berubah dari versi asli — file ini murni fs/path,
 * tidak menyentuh `browser` atau API WDIO apa pun.
 *
 * Load test data dari file JSON. Mencari file secara rekursif di dalam folder test/src/ddt.
 * @param {string} filename - Nama file (contoh: 'dataLogin' atau 'dataLogin.json')
 * @returns {any} Seluruh isi file JSON
 */
export const loadTestData = (filename: string): any => {
  const ddtRoot: string = path.join(process.cwd(), 'test', 'src', 'ddt');

  if (!fs.existsSync(ddtRoot)) {
    throw new Error(`Folder DDT tidak ditemukan di: ${ddtRoot}`);
  }

  const searchFile: string = filename.endsWith('.json') ? filename : `${filename}.json`;
  let foundPath: string | null = null;

  const findFileRecursively = (dir: string): void => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        findFileRecursively(fullPath);
        if (foundPath) return;
      } else if (file === searchFile) {
        foundPath = fullPath;
        return;
      }
    }
  };

  findFileRecursively(ddtRoot);

  if (!foundPath) {
    throw new Error(`File '${searchFile}' tidak ditemukan di dalam folder '${ddtRoot}' (recursive search).`);
  }

  try {
    const fileContent = fs.readFileSync(foundPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (err: any) {
    throw new Error(`Gagal membaca atau parsing file JSON di ${foundPath}: ${err.message}`);
  }
};
