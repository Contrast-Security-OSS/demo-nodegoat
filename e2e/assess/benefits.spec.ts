import { test, expect } from '@playwright/test';

test.use({ storageState: './tmp/admin.json' })
test.describe('/benefits behaviour', () => {

  test("Should be a table with rows", async ({ page }) => {
    await page.goto('/benefits');
    const rows = await page.$$eval('table tr', rows => rows.length);
    expect(rows).toBeGreaterThan(0);
  });

  test("Should data in the table be modified", async ({ page }) => {
    await page.goto('/benefits');
    await page.fill("input[name='benefitStartDate']", "2099-01-10");
    await page.click("button[type='submit']");
    const url = page.url();
    expect(url).toContain('benefits');
    const value = await page.$eval("input[name='benefitStartDate']", el => el.value);
    expect(value).toEqual("2099-01-10");
  });
});