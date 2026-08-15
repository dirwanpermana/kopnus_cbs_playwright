import * as dotenv from 'dotenv';
import * as path from 'node:path';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

const envPath = path.resolve(__dirname, '../../../.env');
console.info('Loading DB env from', envPath);

dotenv.config({
  path: envPath,
  override: true,
});

const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missingVars = requiredVars.filter((name) => !process.env[name]);
if (missingVars.length > 0) {
  throw new Error(`Missing required DB environment variables: ${missingVars.join(', ')}`);
}

const sslOption = process.env.DB_SSL?.toLowerCase() === 'true'
  ? { rejectUnauthorized: false }
  : undefined;

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: sslOption,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    console.info('DB helper using config', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
      ssl: Boolean(dbConfig.ssl),
    });

    pool = new Pool(dbConfig);

    pool.on('error', (err) => {
      console.error('Unexpected error on idle DB client', err);
    });
  }
  return pool;
}

export async function query<T extends QueryResultRow = Record<string, unknown>>(
  text: string,
  params?: any[],
  retries = 2
): Promise<QueryResult<T>> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const client: PoolClient = await getPool().connect().catch((err) => {
      if (attempt === retries) throw err;
      console.warn(`[DB] Attempt ${attempt + 1} failed to connect: ${err.message}`);
      return null;
    });

    if (!client) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      continue;
    }

    try {
      const result = await client.query<T>(text, params);
      return result;
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`[DB] Attempt ${attempt + 1} failed to execute query: ${(err as Error).message}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      client.release(); // WAJIB, supaya koneksi balik ke pool
    }
  }

  throw new Error('DB query failed after retries');
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}