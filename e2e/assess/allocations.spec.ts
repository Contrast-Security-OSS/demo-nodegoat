import { test, expect } from '@playwright/test';

test.use({ storageState: './tmp/admin.json' })
test.describe('/allocations behaviour', () => {

  test('Should be accesible for a logged user', async ({page}) => {
    await page.goto('/allocations/1');
    expect(page.url()).toContain('allocations');
  });

  test('Should be an input', async ({page}) => {
    await page.goto('/allocations/1');
    const input = await page.$('input[name=threshold]');
    expect(input).toBeTruthy();
  });

  test('Should redirect the user', async ({page}) => {
    const threshold = 2;
    await page.goto('/allocations/1');
    
    await page.fill('input[name=threshold]', threshold.toString());
    await page.click('button[type=submit]');

    expect(page.url()).toContain(`?threshold=${threshold}`);
    expect(page.url()).toContain('/allocations/1');
  });
});