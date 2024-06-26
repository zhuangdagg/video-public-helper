import { darkModeEnum, handleKeys } from 'main/handle/handleMap';
import { UserInfo } from 'main/handle/playwright/login';
export {};
declare global {
  // TODO: 完善类型声明
  interface Window {
    darkMode: {
      toggle: () => Promise<string>;
      system: () => void;
    };
    playwright: {
      login: (key: string) => Promise<UserInfo>;
    };
  }
}
