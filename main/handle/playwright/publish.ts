import { ipcMain } from 'electron';
import { chromium } from 'playwright';
import { playwrightEnum } from '../handleMap';
import { VideoPublishInfo } from '#/video-plation-publish';

ipcMain.handle(playwrightEnum.publish, async (evt, publishInfo: VideoPublishInfo) => {
  console.log({ publishInfo });

  return '发布成功';
});
