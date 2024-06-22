import { createApp } from 'vue'

import App from './App.vue'

import './style/index.less'

// plugin
import { setupStore } from '@/store/index'

async function bootstrap () {
    const app = createApp(App)

    setupStore(app);

    app.mount('#app');
}

bootstrap();

