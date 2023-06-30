import { test, expect } from '@playwright/test';

test.describe('/auth behaviour', () => {
  test('Should redirect if the user has not logged in', async ({page}) => {
    await page.goto('/allocations/1');
    expect(page.url()).toContain('login');
  });
});