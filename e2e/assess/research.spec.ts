import { test, expect } from '@playwright/test';

test.use({ storageState: './tmp/admin.json' })
test.describe('/research behaviour', () => {

  test("Should be a form with an input", async ({ page }) => {
    await page.goto('/research');
    const input = await page.$('form[role="search"] input');
    expect(input).not.toBeNull();
  });

  test("Should have an input text as a valid stock symbol", async ({ page }) => {
    const stockSymbol = "AAPL";
    await page.goto('/research');
    await page.fill('.form-control', stockSymbol);
    await page.click('button[type="submit"]');
    expect(page.url()).toContain('https%3A%2F%2Ffinance.yahoo.com%2Fquote%2F&symbol=AAPL');
  });
});