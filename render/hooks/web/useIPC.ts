export function useIPC() {
  const darkMode = {
    toggle: window.darkMode?.toggle,
    system: window.darkMode?.system,
  };

  const systemInfo = {
    getEnv: window.systemInfo?.getEnv,
    getCwd: window.systemInfo?.getCwd,
  };

  return {
    darkMode,
    systemInfo,
    accountLogin: window.playwright?.login,
    /** 平台内容发布 */
    plationPublish: window.playwright?.publish,

    directorySelect: window.showDialog?.directorySelect,
    openFile: window.showDialog?.openFile,
    /** 推特视频下载 */
    downloadVideo: window.videoDownload?.download,

    // 监听回调定义
    onVersionCheck: window.systemMessage?.onVersionCheck,
    onLog: window.systemMessage?.onLog,
  };
}
