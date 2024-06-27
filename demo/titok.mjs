import { chromium, devices, errors } from 'playwright';
// import { storageStateStr } from './storageState.mjs';

const publishContent = {
  type: 'video',
  title: '我的第一个视频',
  desc: '随便发发 #首发 #雨的',
  filePath: 'C:\\Users\\zhuang\\Videos\\a.mp4',
};

let browser;
let browserContext;
/**
 * @type playwright-core.Pagef
 */
let page;
async function main() {
  // await openPage();
  // await login();
  await publish();
}

main();

async function openPage() {
  browser = await chromium.launch({
    headless: false,
    // channel: 'msedge',
    executablePath: './browser/chrome-win/chrome.exe',
  });

  browserContext = await browser.newContext({
    storageState: './demo/storageState.json',
    ...devices['Desktop Chrome'],
  });

  page = await browserContext.newPage();

  await page.goto('https://creator.douyin.com/');
}

async function login() {
  /**
   * @type playwright.Page
   */
  // const btn = await page.getByRole('button', { type: 'submit' });
  // console.log(btn, '--btn');
  // await btn.click();
  await page.waitForURL('**/home', { timeout: 0, waitUntil: 'domcontentloaded' });
  setTimeout(async () => {
    await page.context().storageState({ path: './demo/storageState.json' });
    console.log('登录成功');
    page.close();
    await browserContext.close();
    await browser.close();
  }, 5000);
}

// 发布
// https://creator.douyin.com/creator-micro/content/upload

async function publish() {
  browser = await chromium.launch({
    headless: false,
    // channel: 'msedge',
    executablePath: './browser/chrome-win/chrome.exe',
  });

  browserContext = await browser.newContext({
    storageState: './demo/storageState.json',
    ...devices['Desktop Chrome'],
  });

  page = await browserContext.newPage();

  await page.goto('https://creator.douyin.com/creator-micro/content/publish');

  await setPublishContent();
  // await setDescription();
}

async function setPublishContent() {
  await page.getByPlaceholder('好的作品标题可获得更多浏览').fill(publishContent.title);

  // TODO:
  try {
    const locat = await page.locator('.editor-kit-outer-container > div[contenteditable="true"]');
    await locat.fill(publishContent.desc);
  } catch (err) {
    console.log(err, '--desc error');
  }

  try {
    await page
      .locator('div#micro input[accept="video/mp4,video/x-m4v,video/*"]')
      ?.setInputFiles(publishContent.filePath);
  } catch (err) {
    console.error(err);
  }
  // await waitVideoLoaded();
  console.log('发布成功！');
}

async function waitVideoLoaded() {
  try {
    await page.waitForURL('**/manage', { timeout: 60000, waitUntil: 'domcontentloaded' });
  } catch (err) {
    if (err instanceof errors.TimeoutError) {
      await page.getByRole('button', { name: '发布', exact: true })?.click();
      await waitVideoLoaded();
    }
  }
}

/* 
<div class="ace-line" data-node="true">
  <div data-line-wrapper="true" dir="auto">
    <span class="" data-leaf="true">
      <span data-string="true">666</span>
    </span>
    <span class="" data-leaf="true">
      <span data-string="true" data-enter="true">​</span>
    </span>
  </div>
</div> */
