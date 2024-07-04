import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
// import { MakerDeb } from '@electron-forge/maker-deb';
// import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';

import { PublisherERS } from '@electron-forge/publisher-electron-release-server';
import path from 'node:path';

const config: ForgeConfig = {
  packagerConfig: {
    // name: 'video-publish-assistant',
    asar: false, // TODO: 目前asar 打包会报错， 可手动 asar
    tmpdir: '../temp', // 避免无权限问题
    icon: path.join(__dirname, './public/logo'),
    overwrite: true,
    electronZipDir: path.join(__dirname, './electron-download/'),
    // ignore: [],
    beforeAsar: [
      (buildPath, electronVersion, platform, arch, cb) => {
        console.log({ buildPath, electronVersion, platform, arch });
        cb();
      },
    ],
    afterAsar: [
      (buildPath, electronVersion, platform, arch, cb) => {
        console.log('after asar');
        cb();
      },
    ],
  },
  rebuildConfig: {},
  makers: [
    // TODO: 报错，请在运行 npm run package 后，执行 npm run make:win32 进行构建
    new MakerSquirrel({
      // certificateFile: './cert.pfx',
      // certificatePassword: '',
      authors: 'blunt',

      description: 'a video publish assistant in china',
      loadingGif: './public/logo.png',
      iconUrl: './public/logo.ico',
      setupIcon: './public/logo.ico',
    }),
    // new MakerZIP({

    // }, ['win32']),
    // new MakerDeb({}),
  ],
  publishers: [
    new PublisherERS({
      baseUrl: 'http://localhost',
      username: 'admin',
      password: 'zhuang',
    }),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'main/index.ts',
          config: 'vite.main.config.ts',
        },
        {
          entry: 'main/preload.ts',
          config: 'vite.preload.config.ts',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: true,
      [FuseV1Options.EnableCookieEncryption]: false,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: true,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: false,
      [FuseV1Options.OnlyLoadAppFromAsar]: false,
    }),

    // new AutoUnpackNativesPlugin({}),
  ],
};

export default config;
