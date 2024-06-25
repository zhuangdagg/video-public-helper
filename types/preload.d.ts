export {};
declare global {
  interface Window {
    darkMode: {
      toggle: () => Promise<string>;
      system: () => void;
    };
    playwright: {
      login: () => Promise<void>;
    };
  }
}
