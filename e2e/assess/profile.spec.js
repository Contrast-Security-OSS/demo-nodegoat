import { test, expect } from '@playwright/test';

test.use({ storageState: './tmp/admin.json' })
test.describe('/profile behaviour', () => {

  test("Should be a form with inputs", async ({ page }) => {
    await page.goto('/profile');
    const inputs = await page.$$('form[role="form"] input');
    expect(inputs.length).toBe(9);
  });

  test("Should first name be modified", async ({ page }) => {
    const newName = "My new name!";
    const bankRouting = "0198212#";
    await page.goto('/profile');
    await page.fill('#firstName', newName);
    await page.fill('#bankRouting', bankRouting);
    await page.click('button[type="submit"]');
    expect(page.url()).toContain('profile');
    const successAlert = await page.$('.alert-success');
    expect(successAlert).not.toBeNull();
  });

  test("Google search this profile by name", async ({ page }) => {
    await page.goto('/profile');
    const searchLink = await page.$('form[role="form"] a');
    expect(searchLink).not.toBeNull();
  });
});