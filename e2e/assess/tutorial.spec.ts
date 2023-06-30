import { test, expect } from '@playwright/test';

test.use({ storageState: './tmp/admin.json' })
test.describe('/tutorial behaviour', () => {

  test('Should have all the links in the side nav', async ({ page }) => {
    await page.goto('/tutorial');
    const links = await page.$$('.side-nav a');
    expect(links.length).toBe(12);
  });

  const routes = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'redos', 'ssrf'];

  routes.forEach(route => {
    test(`Should exists /tutorial/${route}`, async ({ page }) => {
      await page.goto(`/tutorial/${route}`);
      expect(page.url()).toContain(route);
    });
  });
 
});