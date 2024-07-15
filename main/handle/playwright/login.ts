import { Browser, BrowserContext, Page, chromium, devices } from 'playwright';
import { ipcMain } from 'electron';
import { playwrightEnum } from '../handleMap';
import stroageJson from './storageState.json';
import mockUserinfo from './userinfo.mock.json';
import { getTitokUserinfo } from './utils';

const titokConfig: LoginConfig = {
  loginUrl: 'https://creator.douyin.com/',
  waitForUrl: '**/home',
  accountType: 'titok',
};

ipcMain.handle(playwrightEnum.login, async (evt, plationType: string) => {
  console.log({ evt, plationType });
  let info: UserInfo;
  let handler: ReturnType<typeof useLogin>;
  switch (plationType) {
    case 'titok':
      handler = useLogin(titokConfig);
      // mock
      info = mockUserinfo as UserInfo;
      // info = await handler.exec(getTitokUserinfo);
      break;
    default:
      console.log('暂不支持该平台');
      return new Error('暂不支持该平台');
  }

  return info;
});

interface LoginConfig {
  loginUrl: string;
  accountType: 'titok' | 'bilibili';
  waitForUrl: string;
  [key: string]: any;
}

export interface UserInfo {
  storageState: string;
  name: string;
  accountId: string | number;
  fans?: number;
  status: 0 | 1;
  accountType: any;
  avatar?: string;
  origin?: Record<string, any>;
}

function useLogin(config: LoginConfig) {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  let userInfo: UserInfo = {
    status: 0,
    storageState: JSON.stringify(stroageJson),
    name: '',
    accountId: '',
    fans: 0,
    accountType: config.accountType,
  };
  // {
  //   storageState: 'cookies',
  //   name: '雨的',
  //   accountId: '68143622679',
  //   fans: 0,
  // };

  /**
   * 打开登录页面并等待用户完成登录
   */
  const open = async () => {
    browser = await chromium.launch({
      headless: false,
      channel: 'msedge',
    });
    context = await browser.newContext(devices['Desktop Edge']);
    page = await context.newPage();
    await page.goto(config.loginUrl);
    await page.waitForURL(config.waitForUrl, { timeout: 0, waitUntil: 'domcontentloaded' });

    return true;
  };

  const close = async () => {
    await context?.close();
    await browser?.close();
  };

  const exec = async (getUserInfo: any = () => {}) => {
    try {
      await open();
      userInfo.storageState = JSON.stringify(await context.storageState());
      await getUserInfo(page, userInfo);
    } catch (err) {
      console.error('获取storageState登录状态失败', err);
    } finally {
      close();
    }

    // 获取用户信息122344
    return userInfo;
  };
  return {
    open,
    exec,
    close,
  };
}
