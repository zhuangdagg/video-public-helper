export const darkModeEnum = {
  toggle: 'dark-mode:toggle',
  system: 'dark-mode:system',
};

export const playwrightEnum = {
  login: 'playwright:login',
  publish: 'playwright:publish',
};

// 推特视频下载
export const videoDownload = {
  download: 'videoDownload:download',
};

export const showDialog = {
  directorySelect: 'showDialog:directorySelect',
  openFile: 'showDialog:openFile',
};

export const systemInfo = {
  getEnv: 'systemInfo:getEnv',
  getCwd: 'systemInfo:getCwd',
};

/**
 * @example window.darkMode.toggle()
 */
export const handleKeys: Record<string, object> = {
  darkMode: darkModeEnum,
  playwright: playwrightEnum,
  videoDownload,
  showDialog,
  systemInfo,
};
