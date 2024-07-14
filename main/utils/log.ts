import { mainWindow } from '../';

export type onLogType = 'video-download-log' | 'default-log';
export const sendWindowLog = (type: onLogType, message: string, window = mainWindow) => {
  window.webContents.send(type, message);
};
