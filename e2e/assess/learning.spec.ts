import { test, expect } from '@playwright/test';

test.use({ storageState: './tmp/admin.json' })
test.describe('/tutorial behaviour', () => {

  test('Should navigate to learning page', async ({ page }) => {
    await page.goto('/learn?url=https://www.khanacademy.org/economics-finance-domain/core-finance/investment-vehicles-tutorial/ira-401ks/v/traditional-iras');
    expect(page.url()).toContain('www.khanacademy.org');
  });
 
});