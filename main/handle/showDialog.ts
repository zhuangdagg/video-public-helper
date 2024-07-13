import { ipcMain, dialog, shell } from 'electron';

import { showDialog } from './handleMap';

import { mainWindow } from '../';

ipcMain.handle(showDialog.directorySelect, async (evt) => {
  return await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
});

ipcMain.handle(showDialog.openFile, async (evt, filePath: string) => {
  return shell.openPath(filePath);
});
