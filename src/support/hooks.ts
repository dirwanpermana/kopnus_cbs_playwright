// untuk menambahkan screenshot setiap step di report

import { createBdd } from 'playwright-bdd';
import { test } from './fixtures.js';
import { closePool } from '../helpers/db/dbHelper.js';

const { AfterStep, AfterAll } = createBdd(test);

// AfterStep hook untuk menambahkan screenshot setiap step ke dalam report
AfterStep('@ui', async ({ page, $step, $testInfo }) => {
    if (!$step) return;
    const screenshot = await page.screenshot({ fullPage: true });
    await $testInfo.attach(`Step: ${$step.title}`, { body: screenshot, contentType: 'image/png' });
});

AfterAll(async () => {
    await closePool();
});