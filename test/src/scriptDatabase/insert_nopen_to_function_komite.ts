import { dbHelper } from '../helpers/DBhelper';

const FUNCTION_NAME = 'get_data_antrian_komite_kredit'; //nama function
const FUNCTION_SCHEMA = 'public'; // nama schema
const MAX_ACTIVE_NOPEN = 2;
const NOPEN_FILTER_REGEX = /WHERE\s+nomor_pensiun\s+IN\s*\(([^)]*)\)/i;

/**
 * Mengambil source code (DDL) function dari database menggunakan pg_get_functiondef.
 *
 * @param functionName nama function, contoh: 'get_data_antrian_komite_kredit'
 * @param schema       nama skema, default 'public'
 */
async function getFunctionSource(
  functionName: string,
  schema: string = FUNCTION_SCHEMA
): Promise<string> {
  const sql = `
    SELECT pg_get_functiondef(p.oid) AS source
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE p.proname = $1
      AND n.nspname = $2
    LIMIT 1;
  `;

  const row = await dbHelper.getOne<{ source: string }>(sql, [functionName, schema]);

  if (!row) {
    throw new Error(
      `[updateAntrianKomiteFunction] Function "${schema}.${functionName}" tidak ditemukan di database.`
    );
  }

  return row.source;
}

/**
 * Memecah isi mentah di dalam "IN (...)" menjadi array nopen individual.
 * Format tiap item: ''NOPEN'' (single quote di-escape jadi 2x petik).
 *
 * parseNopenList("''A'',''B''") -> ['A', 'B']
 * parseNopenList("''A''")       -> ['A']
 * parseNopenList("")            -> []
 */
function parseNopenList(rawList: string): string[] {
  return rawList
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map((item) => item.replace(/^''/, '').replace(/''$/, ''));
}

  // Nopen pertama tidak pernah dihapus, supaya tidak mengganggu yg lain.
function buildUpdatedNopenList(existingNopens: string[], nopenBaru: string): string[] {
  if (existingNopens.length === 0) {
    return [nopenBaru];
  }

  if (existingNopens.length < MAX_ACTIVE_NOPEN) {
    return [...existingNopens, nopenBaru];
  }

  // Sudah penuh (>= MAX_ACTIVE_NOPEN): pertahankan nopen pertama, replace nopen terakhir.
  const nopenPertama = existingNopens[0];
  return [nopenPertama, nopenBaru];
}

//  Mengubah array nopen menjadi format SQL list: ''A'',''B''
function formatNopenListForSql(nopens: string[]): string {
  return nopens.map((n) => `''${n}''`).join(',');
}

function updateNopenFilterInSource(functionSource: string, nopenBaru: string): string {
  const match = functionSource.match(NOPEN_FILTER_REGEX);

  if (!match) {
    throw new Error(
      `[updateAntrianKomiteFunction] Pattern "WHERE nomor_pensiun IN (...)" tidak ditemukan di source function. ` +
        `Pastikan function belum berubah strukturnya.`
    );
  }

  const existingNopens = parseNopenList(match[1]);
  const updatedNopens = buildUpdatedNopenList(existingNopens, nopenBaru);
  const updatedListSql = formatNopenListForSql(updatedNopens);

  // eslint-disable-next-line no-console
  console.log(
    `[updateAntrianKomiteFunction] Nopen sebelumnya: [${existingNopens.join(', ')}] -> Nopen baru: [${updatedNopens.join(', ')}]`
  );

  return functionSource.replace(NOPEN_FILTER_REGEX, `WHERE nomor_pensiun IN (${updatedListSql})`);
}

// Update function get_data_antrian_komite_kredit di database, menambahkan/ replace nopen kedua
export async function updateAntrianKomiteFunction(nopenBaru: string): Promise<void> {
  const originalSource = await getFunctionSource(FUNCTION_NAME, FUNCTION_SCHEMA);
  const updatedSource = updateNopenFilterInSource(originalSource, nopenBaru);

  await dbHelper.query(updatedSource);

  // eslint-disable-next-line no-console
  console.log(`[updateAntrianKomiteFunction] Function "${FUNCTION_NAME}" berhasil di-update dengan nopen baru: ${nopenBaru}`);
}