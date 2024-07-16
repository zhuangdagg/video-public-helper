import { app, BrowserWindow, Menu } from 'electron';
import path from 'node:path';

import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';

import './handle';
import { useUpdateManage } from './utils/update';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// 隐藏原生菜单
Menu.setApplicationMenu(null);

let mainWindow: BrowserWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 1024,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
  if (true || __DEV__) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }

  return mainWindow;
};

// load extension
app.whenReady().then(() => {
  const mainWindow = createWindow();
  if (__DEV__) {
    // install VUE devtool in chrome
    installExtension(VUEJS3_DEVTOOLS)
      .then((name) => console.log(`${name} extension install successful`))
      .catch(console.error);
    const updateMgr = useUpdateManage(mainWindow);
    updateMgr.watch();
  } else {
    const updateMgr = useUpdateManage(mainWindow);
    updateMgr.watch();
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

export { mainWindow };
