import { chromium, devices } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function parseM3U8Header(m3u8) {
  const stream = [];
  const audio = {};
  const _list = m3u8.split('\n');
  const mediaFlag = '#EXT-X-MEDIA:';
  const streamFlag = '#EXT-X-STREAM-INF:';
  for (let i = 0; i < _list.length; i++) {
    const line = _list[i];
    if (line === '') continue;

    if (line.indexOf(mediaFlag) === 0) {
      const _obj = parseM3U8Value(line.slice(mediaFlag.length));
      audio[_obj['GROUP-ID']] = _obj;
      continue;
    }

    if (line.indexOf(streamFlag, 0) === 0) {
      const _obj = parseM3U8Value(line.slice(streamFlag.length));
      _obj['URL'] = _list[++i];
      stream.push(_obj);
    }
  }

  // console.log({ audio, stream });
  stream.forEach((item) => {
    item['AUDIO'] = audio[item['AUDIO']];
  });
  return stream;
}

function parseM3U8Content(m3u8) {
  const res = [];
  const _list = m3u8.split('\n');
  const headerFlag = '#EXT-X-MAP:';
  const itemFlag = '#EXTINF:';
  for (let i = 0; i < _list.length; i++) {
    const line = _list[i];
    if (line === '') continue;

    if (line.indexOf(headerFlag) === 0) {
      const _obj = parseM3U8Value(line.slice(headerFlag.length));
      res.push(_obj['URI']);
      continue;
    }

    if (line.indexOf(itemFlag, 0) === 0) {
      res.push(_list[++i]);
    }
  }

  return res;
}

function parseM3U8Value(val) {
  const res = {};
  let k = '';
  let v = '';
  let writeInKey = true;
  let inVal = false;
  for (let i = 0; i < val.length; i++) {
    const c = val[i];
    if (c === '=' && !inVal) {
      writeInKey = false;
      continue;
    }
    if (c === '"') {
      inVal = !inVal;
      continue;
    }

    if (c === ',' && !inVal) {
      res[k] = v;
      k = '';
      v = '';
      writeInKey = true;
      continue;
    }
    if (writeInKey) k += c;
    else v += c;
  }
  res[k] = v;
  return res;
}

let browser;
let browserContext;
/**
 * @type playwright-core.Pagef
 */
let page;

let m3u8_header;

const host = 'https://video.twimg.com';

async function main() {
  // m3u8_header = parseM3U8Header(m3u8_first);
  await openPage();

  // await fetchM3U8Content(m3u8_header);
  // await m4s2Mp4();
}

main();

async function openPage() {
  browser = await chromium.launch({
    headless: false,
    channel: 'msedge',
    // executablePath: './browser/chrome-win/chrome.exe',
  });

  browserContext = await browser.newContext(
    devices['Desktop Chrome'],
    //   {
    //   // storageState: './demo/storageState.json',
    //   ...devices['Desktop Chrome'],
    // }
  );

  page = await browserContext.newPage();

  await goPage();

  // await page.waitForURL('**/status/**', { timeout: 0, waitUntil: 'domcontentloaded' });

  m3u8_header = parseM3U8Header(await getM3U8());

  console.log('header', m3u8_header);

  // 清除下载文件夹
  fs.rmSync(path.join(process.cwd(), './demo/download'), { recursive: true, force: true });
  fs.mkdirSync(path.join(process.cwd(), './demo/download'));

  await Promise.all([
    fetchM4SStream(m3u8_header[0]['URL']),
    fetchM4SStream(m3u8_header[0]['AUDIO']['URI']),
  ]);

  // 合并视频
  m4s2Mp4();
}

async function goPage() {
  try {
    await page.goto('https://x.com/AMAZlNGNATURE/status/1811639283586908407');
    await page.waitForURL('**/status/**', { timeout: 2000 });
    console.log('success to status page');
  } catch (err) {
    // console.error(err);
    console.log('try link eight');
    await new Promise((resolve, reject) => {
      setTimeout(async () => {
        resolve(await goPage());
      }, 2000);
    });

    return;
  }
}

async function getM3U8() {
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
  return await res.text();
}

async function fetchM3U8Content(url) {
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

async function fetchM4SStream(m3u8_header) {
  const mediaUrls = parseM3U8Content(await fetchM3U8Content(m3u8_header));
  console.log({ mediaUrls });
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
      `./demo/download/${mediaType}-${index}.${index ? 'm4s' : 'mp4'}`,
      await res.body(),
      { flag: 'a' },
      (err) => {
        console.log(err);
      },
    );
  });

  await Promise.all(tasks);
}

async function m4s2Mp4() {
  console.log(process.cwd());
  const basePath = path.join(process.cwd(), './demo/download');
  const files = fs.readdirSync(basePath);
  let videoFiles = 'concat:';
  let audioFiles = 'concat:';
  videoFiles += files
    .filter((filename) => filename.indexOf('video') > -1)
    .map((file) => {
      return path.join(basePath, file);
    })
    .join('|');
  audioFiles += files
    .filter((filename) => filename.indexOf('audio') > -1)
    .map((file) => {
      return path.join(basePath, file);
    })
    .join('|');
  console.log({ files, videoFiles, audioFiles });

  const command = spawnSync(
    'ffmpeg',
    ['-i', videoFiles, '-i', audioFiles, '-c', 'copy', '.\\demo\\download\\test2.mp4'],
    {
      // detached: true,
      cwd: 'E:\\work\\video-public-assistant',
    },
  );

  console.log(command.stderr.toString('utf-8'));
  console.log(command.stdout.toString('utf-8'));
}
