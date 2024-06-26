import { ipcMain, nativeTheme } from 'electron';
import { darkModeEnum } from './handleMap';

ipcMain.handle(darkModeEnum.toggle, (evt, tab) => {
  console.log(evt);
  console.log({ tab });
  nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'light' : 'dark';
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle(darkModeEnum.system, () => {
  nativeTheme.themeSource = 'system';
  return true;
});
