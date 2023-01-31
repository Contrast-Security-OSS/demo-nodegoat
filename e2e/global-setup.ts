import { Browser, chromium, FullConfig } from '@playwright/test'
 
async function globalSetup (config: FullConfig) {
  const browser = await chromium.launch()
  let project = config.projects[0];
  const { baseURL } = project.use;
  const loginPage = baseURL + "/login"
  await saveStorage(browser, loginPage, 'user1', 'User1_123', './tmp/admin.json')
  await browser.close()
}
 
async function saveStorage (browser: Browser, loginPage: string, email: string, password: string, saveStoragePath: string) {
  const page = await browser.newPage()
  await page.goto(loginPage)
  await page.fill('input[name="userName"]', email);
  await page.fill('input[name="password"]', password);
  await page.locator('button:has-text("Submit")').click();
  await page.context().storageState({ path: saveStoragePath })
}
 
export default globalSetup