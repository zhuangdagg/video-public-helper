import { Browser, BrowserContext, BrowserType, chromium, devices } from 'playwright';
import { ipcMain } from 'electron';

ipcMain.handle('playwright:login', async () => {
  console.log('titok login');
  await login();
});
let browser: Browser;
let browserContext: BrowserContext;

async function login() {
  browser = await chromium.launch({
    headless: false,
    channel: 'msedge',
  });

  const browserContext = await browser.newContext(devices['Desktop Edge']);

  const page = await browserContext.newPage();

  await page.goto('https://creator.douyin.com/');
}
