import { test, expect } from '@playwright/test';

test.use({ storageState: './tmp/admin.json' })
test.describe('/signup behaviour', () => {

  test("Should be a form with inputs", async ({ page }) => {
    await page.goto('/signup');
    const inputs = await page.$$('form[role="form"] input');
    expect(inputs.length).toBe(7);
  });

  test("Should new user be added to the system", async ({ page }) => {
    await page.goto('/signup');

    var username = generateRandomUserName();

    await page.fill('#userName', username);
    await page.fill('#firstName', 'John');
    await page.fill('#lastName', 'Doe');
    await page.fill('#password', 'hunter2');
    await page.fill('#verify', 'hunter2');

    await page.click('button[type="submit"]');
    
    await expect(page.locator('.alert-danger')).toBeHidden();
    await expect(page.locator('.breadcrumb > li')).toHaveText('Dashboard');
  });
});

function generateRandomUserName() {
  const namePrefix = "User";
  const randomNumber = Math.floor(Math.random() * 10000); // generates a random number between 0 and 9999
  return namePrefix + randomNumber; // concatenates the name prefix and the random number
}