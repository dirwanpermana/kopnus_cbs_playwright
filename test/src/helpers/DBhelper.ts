import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

/**
 * MIGRATION NOTE: file ini identik dengan versi WDIO — DBhelper.ts di project asli
 * tidak punya dependency ke `browser`/`@wdio/*` sama sekali (murni `pg`), jadi
 * tidak ada yang perlu diubah secara arsitektural. Yang berubah hanya *kapan* dan
 * *di mana* connect()/close() dipanggil (lihat global-setup.ts dan src/support/fixtures.ts).
 */
class DbHelper {
  private pool: Pool | null = null;

  async connect(): Promise<void> {
    if (this.pool) {
      return;
    }

    const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
    const missing = requiredEnvVars.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(
        `[DbHelper] Environment variable berikut belum diset di .env: ${missing.join(', ')}`
      );
    }

    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    this.pool.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error('[DbHelper] Unexpected error pada idle client:', err);
    });

    try {
      await this.pool.query('SELECT 1');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[DbHelper] Gagal terhubung ke database:', error);
      throw error;
    }
  }

  private getPool(): Pool {
    if (!this.pool) {
      throw new Error(
        '[DbHelper] Database belum terkoneksi. Pastikan dbHelper.connect() dipanggil ' +
        '(lihat worker fixture "dbConnection" di src/support/fixtures.ts) sebelum test run dimulai.'
      );
    }
    return this.pool;
  }

  async query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: any[] = []
  ): Promise<QueryResult<T>> {
    const pool = this.getPool();
    try {
      return await pool.query<T>(sql, params);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`[DbHelper] Query gagal: ${sql}`, params, error);
      throw error;
    }
  }

  async getMany<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: any[] = []
  ): Promise<T[]> {
    const result = await this.query<T>(sql, params);
    return result.rows;
  }

  async getOne<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: any[] = []
  ): Promise<T | null> {
    const result = await this.query<T>(sql, params);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async callScalarFunction(functionName: string, params: any[] = []): Promise<string> {
    const placeholders = params.map((_, idx) => `$${idx + 1}`).join(', ');
    const sql = `SELECT * FROM ${functionName}(${placeholders});`;
    const row = await this.getOne(sql, params);

    if (!row) {
      throw new Error(
        `[DbHelper] Function ${functionName} tidak mengembalikan hasil untuk params: ${JSON.stringify(params)}`
      );
    }

    const firstKey = Object.keys(row)[0];
    const value = (row as Record<string, unknown>)[firstKey];

    if (value === null || value === undefined) {
      throw new Error(
        `[DbHelper] Function ${functionName} mengembalikan nilai null/undefined untuk params: ${JSON.stringify(params)}`
      );
    }

    return String(value);
  }

  async exists(sql: string, params: any[] = []): Promise<boolean> {
    const result = await this.query(sql, params);
    return result.rowCount !== null && result.rowCount > 0;
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const pool = this.getPool();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}

export const dbHelper = new DbHelper();
