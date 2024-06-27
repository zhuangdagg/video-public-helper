export const darkModeEnum = {
  toggle: 'dark-mode:toggle',
  system: 'dark-mode:system',
};

export const playwrightEnum = {
  login: 'playwright:login',
  publish: 'playwright:publish',
};

/**
 * @example window.darkMode.toggle()
 */
export const handleKeys: Record<string, object> = {
  darkMode: darkModeEnum,
  playwright: playwrightEnum,
};
