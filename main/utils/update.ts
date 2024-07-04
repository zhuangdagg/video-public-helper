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
  config = { delayTime: 60 * 60 * 1000, server: 'http://localhost' },
) => {
  const url = `${config.server}/update/flavor/default/windows_64/${app.getVersion()}/stable`;
  console.log({ url });
  autoUpdater.setFeedURL({ url });

  function watch() {
    autoUpdater.checkForUpdates();
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
    _clearInterval();
    const dialogOpts: MessageBoxOptions = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
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
  });
  autoUpdater.on('update-available', () => {
    console.log('发现可更新版本');
    _clearInterval();
    // TODO: 通知页面
  });

  autoUpdater.on('error', (err) => {
    new Notification({
      title: '发现版本更新错误：',
      body: err.message,
    }).show();
    _clearInterval();
  });

  return {
    watch,
  };
};
