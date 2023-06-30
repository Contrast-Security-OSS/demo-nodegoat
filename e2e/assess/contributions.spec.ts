import { test, expect } from '@playwright/test';

test.use({ storageState: './tmp/admin.json' })
test.describe('/contributions behaviour', () => {

  test("Should be accessible for a logged user", async ({ page }) => {
    await page.goto('/contributions');
    const url = page.url();
    expect(url).toContain('contributions');
  });

  test("Should be a table with several inputs", async ({ page }) => {
    await page.goto('/contributions');
    const inputs = await page.$$eval('table input', inputs => inputs.length);
    expect(inputs).toEqual(3);
  });

  test("Should input be modified", async ({ page }) => {
    const value = "12";
    await page.goto('/contributions');
    await page.fill('table input:first-child', value);
    await page.click("button[type='submit']");
    const tableValue = await page.$eval("tbody > tr > td:nth-child(2)", el => el.textContent);
    expect(tableValue.trim()).toEqual(`${value} %`);
    const alertVisible = await page.isVisible('.alert-success');
    expect(alertVisible).toBe(true);
    const url = page.url();
    expect(url).toContain('contributions');
  });
});