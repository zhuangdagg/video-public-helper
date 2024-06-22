import type { App } from 'vue';
import type { I18nOptions } from 'vue-i18n';

import { createI18n } from 'vue-i18n';

export let i18n: ReturnType<typeof createI18n>;

const message = {
  hello: '你好',
};

async function createI18nOptions(): Promise<I18nOptions> {
  return {
    legacy: false,
    locale: 'zh_CN',
    messages: {
      zh_CN: message,
    },
    sync: true, //If you don’t want to inherit locale from global scope, you need to set sync of i18n component option to false.
    silentTranslationWarn: true, // true - warning off
    missingWarn: false,
    silentFallbackWarn: true,
  };
}

// setup i18n instance with glob
export async function setupI18n(app: App) {
  const options = await createI18nOptions();
  i18n = createI18n(options);
  app.use(i18n);
}
