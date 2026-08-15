// src/steps/db_query/dbQuery.ts
import { createBdd } from 'playwright-bdd';
import { test, expect } from '../support/fixtures.js';
import { query } from '../helpers/db/dbHelper.js';

const { Given, When, Then } = createBdd(test);

let dbResult: Awaited<ReturnType<typeof query>>;

Given('database connection is ready', async () => {
    const result = await query('SELECT 1 AS test_connection');
    expect(result.rowCount).toBeGreaterThan(0);
});

When('I query the users table by NIK Odoo', async () => {
    const nikOdoo = process.env.NIK_SUPERVISOR;
    if (!nikOdoo) {
        throw new Error('Environment variable "NIK_SUPERVISOR" belum diisi di .env');
    }

    dbResult = await query('SELECT * FROM users WHERE nik_odoo = $1', [nikOdoo]);
});

Then('the result should contain a matching user row', () => {
    expect(dbResult).toBeDefined();
    expect(dbResult.rowCount).toBeGreaterThan(0);
    expect(dbResult.rows[0]?.nik_odoo).toBe(process.env.NIK_SUPERVISOR);
});