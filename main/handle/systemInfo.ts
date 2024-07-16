import { ipcMain, app } from 'electron';

import { systemInfo } from './handleMap';

import path from 'node:path';

ipcMain.handle(systemInfo.getEnv, async (evt) => {
  return {
    ...process.env,
    name: app.getName(),
    version: app.getVersion(),
    videoAppData: path.join(process.env.APPDATA, `./${app.getName()}`),
    cwd: process.cwd(),
  };
});

ipcMain.handle(systemInfo.getCwd, async (evt) => {
  return process.cwd();
});
