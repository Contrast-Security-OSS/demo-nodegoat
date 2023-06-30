import { test, expect } from '@playwright/test';

test.use({ storageState: './tmp/admin.json' })
test.describe('/dashboard behaviour', () => {

  test("Should be accessible for a logged user", async ({ page }) => {
    await page.goto('/dashboard');
    const url = page.url();
    expect(url).toContain('dashboard');
  });

  test("Should display information", async ({ page }) => {
    await page.goto('/dashboard');
    const url = page.url();
    expect(url).toContain('dashboard');
    const panels = await page.$$eval('.panel', panels => panels.length);
    expect(panels).toEqual(5);
  });

  test("Should have a link to /contributions", async ({ page }) => {
    await page.goto('/dashboard');
    const url = page.url();
    expect(url).toContain('dashboard');
    const hrefAttr = await page.$eval(".panel a", el => el.getAttribute('href'));
    expect(hrefAttr).toEqual('/contributions');
  });
});