import { resolve } from 'node:path'

import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import { pluginExposeRenderer } from './vite.base.config';

// plugin
import vue from '@vitejs/plugin-vue';
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;

  console.log({ forgeEnv });
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    plugins: [pluginExposeRenderer(name), vue(), createHtmlPlugin()],
    resolve: {
      preserveSymlinks: true,
      alias: [
        {
          find: /@\//,
          replacement: resolve(root, '.', 'render/')
        },
        {
          find: /#\//,
          replacement: resolve(root, '.', 'types/')
        }
      ]
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: generateModifyVars()
        }
      }
    },
    clearScreen: false,
  } as UserConfig;
});


// less global variable
function generateModifyVars () {

  return {
    
  }
}
