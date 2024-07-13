import { ipcMain } from 'electron';

import { systemInfo } from './handleMap';

ipcMain.handle(systemInfo.getEnv, async (evt) => {
  return {
    ...process.env,
    cwd: process.cwd(),
  };
});

ipcMain.handle(systemInfo.getCwd, async (evt) => {
  return process.cwd();
});
