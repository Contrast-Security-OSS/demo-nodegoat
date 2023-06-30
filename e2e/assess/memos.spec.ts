import { test, expect } from '@playwright/test';

test.use({ storageState: './tmp/admin.json' })
test.describe('/memos behaviour', () => {

  test("Should exists a textarea", async ({ page }) => {
    await page.goto('/memos');
    const textarea = await page.$('textarea[name="memo"]');
    expect(textarea).not.toBeNull();
  });

  test("Should memo be generated", async ({ page }) => {
    const text = "Hello World!";
    await page.goto('/memos');
    await page.fill('textarea[name="memo"]', text);
    await page.click('button[type="submit"]');
    expect(page.url()).toContain('memos');
    const bodyText = await page.$eval('.panel-body > p', el => el.textContent);
    expect(bodyText).toContain(text);
  });
});