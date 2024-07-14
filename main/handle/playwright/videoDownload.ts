import { ipcMain } from 'electron';
import { Browser, BrowserContext, Page, chromium, devices } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import { videoDownload } from '../handleMap';
import { parseM3U8Header, parseM3U8Content } from '../../utils/video';
import { sendWindowLog } from '../../utils';

ipcMain.handle(videoDownload.download, async (evt, config: VideoDownloadConfig) => {
  const { open, goPage, getM3U8Header, makeDir, fetchM4SStream, m4s2Mp4, close } =
    useVideoDownload(config);
  sendWindowLog('video-download-log', '读取配置');
  await open();
  sendWindowLog('video-download-log', '打开浏览器');
  await goPage();
  sendWindowLog('video-download-log', '打开视频页面');
  const m3u8_header = await getM3U8Header();
  sendWindowLog('video-download-log', '读取视频数据');
  await makeDir();
  sendWindowLog('video-download-log', '开始下载...');
  await Promise.all([
    fetchM4SStream(m3u8_header[0]['URL']),
    fetchM4SStream(m3u8_header[0]['AUDIO']['URI']),
  ]);
  sendWindowLog('video-download-log', '处理视频数据...');
  await m4s2Mp4();
  sendWindowLog('video-download-log', '视频数据下载完成');
  return await close();
});

export interface VideoDownloadConfig {
  downloadUrl: string;
  saveDir: string;
}

const useVideoDownload = (config: VideoDownloadConfig) => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  const tempDir = path.join(process.env.TEMP, './vpa-video');
  const saveDir = path.join(config.saveDir || process.cwd(), './download');
  const _urls = config.downloadUrl.split('/');
  const saveVideoLocal = path.join(
    saveDir,
    `./${_urls.length ? _urls[_urls.length - 1] : Date.now()}.mp4`,
  );

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

    return true;
  };

  async function goPage() {
    try {
      await page.goto(config.downloadUrl);
      await page.waitForURL('**/status/**', { timeout: 2000 });
      console.log('success to video page');
    } catch (err) {
      console.log('try connect video page again...');
      await new Promise((resolve, reject) => {
        setTimeout(async () => {
          resolve(await goPage());
        }, 2000);
      });

      return;
    }
  }

  async function getM3U8Header() {
    const res = await page.waitForResponse(
      (response) => {
        if (
          response.url().indexOf('.m3u8') > -1 &&
          response.request().method() === 'GET' &&
          response.status() == 200
        ) {
          return true;
        }

        return false;
      },
      { timeout: 0 },
    );
    return parseM3U8Header(await res.text());
  }

  const makeDir = () => {
    // 清除下载文件夹
    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.mkdirSync(tempDir, { recursive: true });
    fs.mkdirSync(saveDir, { recursive: true });
    // if(fs.statfsSync)
  };

  async function _fetchM3U8Content(url: string) {
    const res = await page.waitForResponse(
      (response) => {
        if (
          response.url().indexOf(url) > -1 &&
          response.request().method() === 'GET' &&
          response.status() == 200
        ) {
          return true;
        }

        return false;
      },
      { timeout: 0 },
    );
    return await res.text();
  }

  async function fetchM4SStream(m3u8_header: string) {
    const mediaUrls = parseM3U8Content(await _fetchM3U8Content(m3u8_header));
    const tasks = mediaUrls.map(async (url, index) => {
      const res = await page.waitForResponse(
        (response) => {
          if (
            response.url().indexOf(url) > -1 &&
            response.request().method() === 'GET' &&
            response.status() == 200
          ) {
            return true;
          }

          return false;
        },
        { timeout: 0 },
      );
      const mediaType = url.indexOf('/aud/') > -1 ? 'audio' : 'video';
      console.log(mediaType, '接受:', index + 1);

      fs.writeFileSync(
        `${tempDir}/${mediaType}-${index}.${index ? 'm4s' : 'mp4'}`,
        await res.body(),
        { flag: 'a' },
      );
    });

    await Promise.all(tasks);
  }

  async function m4s2Mp4() {
    const files = fs.readdirSync(tempDir);
    let videoFiles = 'concat:';
    let audioFiles = 'concat:';
    videoFiles += files
      .filter((filename) => filename.indexOf('video') > -1)
      .map((file) => {
        return path.join(tempDir, file);
      })
      .join('|');
    audioFiles += files
      .filter((filename) => filename.indexOf('audio') > -1)
      .map((file) => {
        return path.join(tempDir, file);
      })
      .join('|');

    const command = spawnSync(
      'ffmpeg',
      ['-i', videoFiles, '-i', audioFiles, '-c', 'copy', saveVideoLocal],
      {
        // detached: true,
        // cwd: process.cwd(),
      },
    );

    console.log(command.stderr.toString('utf-8'));
    console.log(command.stdout.toString('utf-8'));
  }

  const close = async () => {
    await context?.close();
    await browser?.close();
    return saveVideoLocal;
  };

  return {
    open,
    goPage,
    getM3U8Header,
    makeDir,
    fetchM4SStream,
    m4s2Mp4,
    close,
  };
};
