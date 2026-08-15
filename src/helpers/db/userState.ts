import { query } from './dbHelper.js';
import { expectedUserState } from '../data/expectedUserState.js';

type UserRow = {
    nik_odoo: string;
    region: string;
    role_id: number;
    is_active: boolean;
};

export async function ensureUserState(accountKey: string): Promise<void> {
    const key = accountKey.trim().toUpperCase();

    const nikEnvKey = `NIK_${key}`;
    const nik = process.env[nikEnvKey];
    if (!nik) {
        throw new Error(`Environment variable "${nikEnvKey}" belum diisi di .env`);
    }

    const expected = expectedUserState[key];
    if (!expected) {
        throw new Error(`Expected state untuk akun "${key}" belum didefinisikan di expectedUserState.ts`);
    }

    const result = await query<UserRow>(
        'SELECT nik_odoo, region, role_id, is_active FROM users WHERE nik_odoo = $1',
        [nik]
    );

    if (result.rowCount === 0) {
        throw new Error(`User dengan NIK "${nik}" (akun "${key}") tidak ditemukan di database`);
    }

    const current = result.rows[0];
    const isMismatch =
        current.region !== expected.region ||
        Number(current.role_id) !== expected.role_id ||
        current.is_active !== expected.is_active;

    if (!isMismatch) return;

    console.warn(
        `[DB Precondition] Data user "${key}" (${nik}) tidak sesuai expected state, melakukan auto-fix.\n` +
        `  Sebelum : region=${current.region}, role_id=${current.role_id}, is_active=${current.is_active}\n` +
        `  Sesudah : region=${expected.region}, role_id=${expected.role_id}, is_active=${expected.is_active}`
    );

    await query(
        'UPDATE users SET region = $1, role_id = $2, is_active = $3 WHERE nik_odoo = $4',
        [expected.region, expected.role_id, expected.is_active, nik]
    );
}