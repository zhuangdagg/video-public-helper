import { createApp } from 'vue';

import App from './App.vue';

import './style/index.less';

// plugin
import { setupStore } from './store';
import { setupI18n } from '@/locales/setupI18n';
import { setupRouter } from './router';

async function bootstrap() {
  const app = createApp(App);

  setupStore(app);

  setupI18n(app);

  setupRouter(app);

  app.mount('#app');
}

bootstrap();
