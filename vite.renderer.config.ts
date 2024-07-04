import { resolve } from 'node:path';

import dayjs from 'dayjs';
import { readPackageJSON } from 'pkg-types';

import type { ConfigEnv, UserConfig, PluginOption } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import { pluginExposeRenderer } from './vite.base.config';

import { generate } from '@ant-design/colors';
// @ts-ignore: typo
/* import { getThemeVariables } from 'ant-design-vue/dist/theme'; */
import { theme } from 'ant-design-vue/lib';
import convertLegacyToken from 'ant-design-vue/lib/theme/convertLegacyToken';

// plugin
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import purgeIcons from 'vite-plugin-purge-icons';
import { createHtmlPlugin } from 'vite-plugin-html';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import compressPlugin from 'vite-plugin-compression';
import UnoCSS from 'unocss/vite';
import { createAppConfigPlugin } from './vite-plugins/appConfig';

// https://vitejs.dev/config
export default defineConfig(async (env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;

  const { root, mode, forgeConfigSelf, command } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';
  console.log(forgeEnv, '-- forge env');
  const isBuild = forgeEnv.command === 'build';
  const { VITE_BUILD_COMPRESS } = loadEnv(mode, root);

  const plugins: PluginOption[] = [
    pluginExposeRenderer(name),
    vue(),
    vueJsx(),
    purgeIcons(),
    createHtmlPlugin(),
    UnoCSS(),
    configSvgIconsPlugin({ isBuild }),
    await createAppConfigPlugin({ root, isBuild }),
  ];
  if (isBuild) {
    // plugins.push(configCompressPlugin({ compress: VITE_BUILD_COMPRESS, deleteOriginFile: true }));
  }
  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
      minify: command === 'build',
      chunkSizeWarningLimit: 1500,
    },
    // server: {
    //   proxy: {
    //     '/proxy': {
    //       // target: 'http://127.0.0.1:8000',
    //       target: 'http://139.9.39.205:8000',
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(new RegExp('^/proxy'), ''),
    //       secure: false,
    //     },
    //   },
    // },
    plugins,
    resolve: {
      preserveSymlinks: true,
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        {
          find: /@\//,
          replacement: resolve(root, '.', 'render') + '/',
        },
        {
          find: /#\//,
          replacement: resolve(root, '.', 'types/') + '/',
        },
      ],
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: generateModifyVars(),
        },
      },
    },
    define: await createDefineData(root),
    clearScreen: false,
  } as UserConfig;
});

// less global variable
function generateModifyVars() {
  const { defaultAlgorithm, defaultSeed } = theme;
  const primaryColor = '#0960bd';
  const palettes = generate(primaryColor, { theme: 'default' });
  const primary = palettes[5];
  const primaryColorObj: Record<string, string> = {};

  for (let index = 0; index < 10; index++) {
    primaryColorObj[`primary-${index + 1}`] = palettes[index];
  }
  // const modifyVars = getThemeVariables();
  const mapToken = defaultAlgorithm(defaultSeed);
  const v3Token = convertLegacyToken(mapToken);
  return {
    ...v3Token,
    // reference:  Avoid repeated references
    hack: `true; @import (reference) "${resolve('render/design/config.less')}";`,
    'primary-color': primary,
    ...primaryColorObj,
    'info-color': primary,
    'processing-color': primary,
    'success-color': '#55D187', //  Success color
    'error-color': '#ED6F6F', //  False color
    'warning-color': '#EFBD47', //   Warning color
    'font-size-base': '14px', //  Main font size
    'border-radius-base': '2px', //  Component/float fillet
    'link-color': primary, //   Link color
  };
}

async function createDefineData(root: string) {
  try {
    const pkgJson = await readPackageJSON(root);
    const { dependencies, devDependencies, name, version } = pkgJson;

    const __APP_INFO__ = {
      pkg: { dependencies, devDependencies, name, version },
      lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };
    return {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    };
  } catch (error) {
    return {};
  }
}

function configSvgIconsPlugin({ isBuild }: { isBuild: boolean }) {
  const svgIconsPlugin = createSvgIconsPlugin({
    iconDirs: [resolve(process.cwd(), 'render/assets/icons')],
    svgoOptions: isBuild,
  });
  return svgIconsPlugin as PluginOption;
}

function configCompressPlugin({
  compress,
  deleteOriginFile = false,
}: {
  compress: string;
  deleteOriginFile?: boolean;
}): PluginOption[] {
  const compressList = compress.split(',');

  const plugins: PluginOption[] = [];

  if (compressList.includes('gzip')) {
    plugins.push(
      compressPlugin({
        ext: '.gz',
        deleteOriginFile,
      }),
    );
  }

  if (compressList.includes('brotli')) {
    plugins.push(
      compressPlugin({
        ext: '.br',
        algorithm: 'brotliCompress',
        deleteOriginFile,
      }),
    );
  }
  return plugins;
}
