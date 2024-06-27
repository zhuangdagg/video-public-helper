export function useIPC() {
  const darkMode = {
    toggle: window.darkMode?.toggle,
    system: window.darkMode?.system,
  };
  return {
    darkMode,
    accountLogin: window.playwright?.login,
    /** 平台内容发布 */
    plationPublish: window.playwright?.publish,
  };
}
