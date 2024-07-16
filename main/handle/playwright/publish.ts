import { ipcMain } from 'electron';
import { Browser, BrowserContext, Page, chromium, devices, errors } from 'playwright';
import { isTargePage } from './utils';
import { playwrightEnum } from '../handleMap';
import { VideoPublishInfo, VideoPublishResult, PlationAccountInfo } from '#/video-plation-publish';

ipcMain.handle(playwrightEnum.publish, async (evt, publishInfo: VideoPublishInfo) => {
  console.log({ publishInfo });
  const result: VideoPublishResult[] = [];
  const { account, ...info } = publishInfo;
  for (const item of account) {
    result.push(await handlePublish(item, info));
  }
  return result;
});

type PublishContent = Omit<VideoPublishInfo, 'account'>;

const handlePublish = async (account: PlationAccountInfo, info: PublishContent) => {
  switch (account.accountType) {
    case 'titok':
      return await handleTitokPublish(account, info);
      break;
    case 'bilibili':
      break;

    default:
      console.error('发布信息无法识别账号类型');
      return {} as VideoPublishResult;
  }
};

const handleTitokPublish = async (account: PlationAccountInfo, content: PublishContent) => {
  const { storageState, accountId, name, accountType } = account;
  const result: VideoPublishResult = {
    accountId,
    name,
    result: 'failure',
    time: '',
    title: content.title || '',
    detail: [],
    accountType,
    publishId: `${accountId}-${Date.now()}`,
  };
  const config = {
    publishUrl: 'https://creator.douyin.com/creator-micro/content/publish',
  };
  const { open, publishTitok, close } = usePublish(config, result.detail);
  try {
    await open(storageState);
    await publishTitok(content);
    result.result = 'success';
    result.time = new Date().toDateString();
    result.detail.push('publish success');
  } catch (err) {
    result.result = err;
  } finally {
    await close();
  }
  return result;
};

interface PublishConfig {
  publishUrl: string;
}

function usePublish(config: PublishConfig, log: any[]) {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  /**
   * 打开登录页面并等待用户完成登录
   */
  const open = async (storageStateStr: string) => {
    browser = await chromium.launch({
      headless: true, // 打开页面
      channel: 'msedge',
    });
    log.push('browser launched');
    let storageState: any;
    try {
      storageState = JSON.parse(storageStateStr);
      log.push('storageState parsed');
    } catch (err) {
      throw new Error('storageState ineffective');
    }

    context = await browser.newContext({
      ...devices['Desktop Edge'],
      storageState,
    });
    page = await context.newPage();
    log.push('page open done');
    await page.goto(config.publishUrl);

    // 验证是否账号登录正常
    if (!(await isTargePage(page, config.publishUrl))) {
      throw new Error('storageState ineffective');
    }
    log.push('publish url is truth');
    return true;
  };

  /**
   * 关闭相关句柄
   */
  const close = async () => {
    await context?.close();
    await browser?.close();
  };

  /**
   * 发布抖音视频
   * @param publishContent
   */
  const publishTitok = async (publishContent: PublishContent) => {
    try {
      await page.getByPlaceholder('填写作品标题，为作品获得更多流量').fill(publishContent.title);
      log.push('title input done');
      const locat = await page.locator('.editor-kit-outer-container > div[contenteditable="true"]');
      await locat.fill(publishContent.desc);
      log.push('desc input done');
    } catch (err) {
      throw new Error('publish content input error');
    }

    try {
      await page
        .locator('div#micro input[accept="video/mp4,video/x-m4v,video/*"]')
        ?.setInputFiles(publishContent.filePath);
      log.push('file input done');
    } catch (err) {
      console.error(err);
      throw new Error('file input error');
    }
    log.push('publish content input done all');
    const stop = tryPublishClick(10); // 等待10分钟

    log.push('waiting publish');
    try {
      await page.waitForURL(
        (url) => {
          return url.href.indexOf('/manage') > -1;
        },
        {
          timeout: 10 * 60 * 1000,
          waitUntil: 'load',
        },
      );
    } catch (err) {
      throw new Error('发布超时');
    } finally {
      stop();
    }
    console.log('publish success');
  };

  function tryPublishClick(cnt: number) {
    let _timer = setInterval(async () => {
      try {
        await page.getByRole('button', { name: '发布', exact: true })?.click();
        console.log('click su');
      } catch (err) {
        console.log('click err');
      }
    }, 1000 * 20);

    return function stop() {
      clearInterval(_timer);
    };
  }

  return {
    open,
    publishTitok,
    close,
  };
}
