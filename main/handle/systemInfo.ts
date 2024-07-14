import { ipcMain } from 'electron';

import { systemInfo } from './handleMap';

import path from 'node:path';

ipcMain.handle(systemInfo.getEnv, async (evt) => {
  return {
    ...process.env,
    videoAppData: path.join(process.env.APPDATA, `./${process.env.npm_package_name}`),
    cwd: process.cwd(),
  };
});

ipcMain.handle(systemInfo.getCwd, async (evt) => {
  return process.cwd();
});
