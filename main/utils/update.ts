import {
  app,
  autoUpdater,
  BrowserWindow,
  dialog,
  MessageBoxOptions,
  MessageBoxReturnValue,
  Notification,
} from 'electron';

let timer = null as any;
/**
 * 检测版本更新
 * @param mainWindow
 * @param config
 * @returns
 */
export const useUpdateManage = (
  mainWindow: BrowserWindow,
  config = { delayTime: __DEV__ ? 60 * 1000 : 10 * 60 * 1000, server: 'http://139.9.39.205:8000' },
) => {
  const url = `${config.server}/api/electron-update/win32/${app.getVersion()}/stable`;
  console.log({ url });
  autoUpdater.setFeedURL({ url });

  function watch() {
    _clearInterval();
    timer = setInterval(() => {
      autoUpdater.checkForUpdates();
    }, config.delayTime);
  }

  function _clearInterval() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // event

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    mainWindow.webContents.send(
      'version-check',
      'update-downloaded',
      process.platform === 'win32' ? releaseNotes : releaseName,
    );
    _clearInterval();
    const dialogOpts: MessageBoxOptions = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: `${app.getVersion()} 更新提示：`,
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail:
        'A new version has been downloaded. Starta om applikationen för att verkställa uppdateringarna.',
    };

    dialog.showMessageBox(dialogOpts).then((returnValue: MessageBoxReturnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.on('update-not-available', () => {
    console.log('已经是最新版本');
    mainWindow.webContents.send('version-check', 'update-not-available');
  });
  autoUpdater.on('update-available', () => {
    console.log('发现可更新版本');
    mainWindow.webContents.send('version-check', 'update-available');
    _clearInterval();
    // TODO: 通知页面
  });

  autoUpdater.on('error', (err) => {
    mainWindow.webContents.send('version-check', 'error', err.message);
    // _clearInterval();
  });

  return {
    watch,
  };
};
