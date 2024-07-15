import { darkModeEnum, handleKeys } from 'main/handle/handleMap';
import { UserInfo } from 'main/handle/playwright/login';
import { VideoPublishInfo, VideoPublishResult } from './video-plation-publish';
import { VideoDownloadConfig } from 'main/handle/playwright/videoDownload';
import { onLogType } from 'main/utils/log';
export {};

export enum VersionCheckResult {
  'updateDownloaded' = 'update-downloaded',
  'updateNotAvailable' = 'update-not-available',
  'updateAvailable' = 'update-available',
  'error' = 'error',
}

declare global {
  // TODO: 完善类型声明
  interface Window {
    darkMode: {
      toggle: () => Promise<string>;
      system: () => void;
    };
    playwright: {
      login: (key: string) => Promise<UserInfo>;
      publish: (publishInfo: VideoPublishInfo) => Promise<VideoPublishResult[]>;
    };
    videoDownload: {
      download: (config: VideoDownloadConfig) => Promise<string>;
    };
    /**
     * 系统信息监听
     */
    systemMessage: {
      /**
       * 监听应用版本更新
       * @param cb
       * @returns
       */
      onVersionCheck: (
        cb: (evt: any, status: VersionCheckResult, detail?: any) => void,
      ) => () => void;
      onLog: (
        type: onLogType,
        cb: (evt: Electron.IpcRendererEvent, message: string) => void,
      ) => () => void;
    };

    showDialog: {
      directorySelect: () => Promise<Electron.OpenDialogReturnValue>;
      openFile: (filePath: string) => Promise<boolean>;
    };

    systemInfo: {
      getEnv: () => Promise<NodeJS.ProcessEnv>;
      getCwd: () => Promise<string>;
    };
  }
}
