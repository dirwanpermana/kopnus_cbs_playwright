import * as fs from 'fs';
import * as path from 'path';

/**
 * Load test data dari file JSON atau module TypeScript.
 *
 * Proyek saat ini menyimpan fixture di test/src/ddt/*.ts (bukan .json), jadi loader
 * perlu menangani beberapa bentuk export: `export const loginData = {...}` dan
 * `export default {...}` serta JSON biasa.
 */
export const loadTestData = (filename: string): any => {
  const ddtRoot: string = path.join(process.cwd(), 'test', 'src', 'ddt');

  if (!fs.existsSync(ddtRoot)) {
    throw new Error(`Folder DDT tidak ditemukan di: ${ddtRoot}`);
  }

  const candidates = new Set<string>([
    filename,
    filename.endsWith('.json') ? filename : `${filename}.json`,
    filename.endsWith('.ts') ? filename : `${filename}.ts`,
    filename.endsWith('.js') ? filename : `${filename}.js`,
  ]);

  let foundPath: string | null = null;

  const findFileRecursively = (dir: string): void => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        findFileRecursively(fullPath);
        if (foundPath) return;
      } else if (candidates.has(file)) {
        foundPath = fullPath;
        return;
      }
    }
  };

  findFileRecursively(ddtRoot);

  if (!foundPath) {
    const knownFiles = Array.from(candidates).join(', ');
    throw new Error(`File '${filename}' tidak ditemukan di dalam folder '${ddtRoot}' (recursive search). Kandidat: ${knownFiles}`);
  }

  try {
    const ext = path.extname(foundPath).toLowerCase();

    if (ext === '.json') {
      const fileContent = fs.readFileSync(foundPath, 'utf-8');
      return JSON.parse(fileContent);
    }

    const imported = require(foundPath);
    if (imported && typeof imported === 'object') {
      if ('default' in imported && imported.default && typeof imported.default === 'object') {
        return imported.default;
      }

      const name = path.basename(foundPath, path.extname(foundPath));
      if (name in imported && imported[name] && typeof imported[name] === 'object') {
        return imported[name];
      }

      const firstExport = Object.values(imported).find((value) => value && typeof value === 'object');
      if (firstExport) {
        return firstExport;
      }
    }

    return imported;
  } catch (err: any) {
    throw new Error(`Gagal membaca atau memuat data dari ${foundPath}: ${err.message}`);
  }
};
