import { convertVersion, createWindowsInstaller } from 'electron-winstaller';
import { readPackageJSON } from 'pkg-types';
import path from 'node:path';
import fs from 'node:fs';

console.log(process.cwd());
const root = process.cwd();
async function getSquirrelWindowsOption() {
  const pkgJson = await readPackageJSON(root);
  const { name, version } = pkgJson;
  return {
    appDirectory: path.join(root, `./out/${name}-win32-x64`),
    outputDirectory: path.join(root, './out/make/squirrel.windows/x64'),
    authors: pkgJson.author || 'zhuang',
    noMsi: true,
    setupExe: `${name}-${convertVersion(version)} Setup.exe`,
    iconUrl: path.join(root, './public/logo.ico'),
    setupIcon: path.join(root, './public/logo.ico'),
    // exe: '视频发布管理.exe',
  };
}
async function make() {
  const spiner = useSpin();
  try {
    const options = await getSquirrelWindowsOption();
    console.log('clear output directory...');
    fs.rmSync(options.outputDirectory, { recursive: true, force: true });
    console.log('making...');
    spiner.open();
    await createWindowsInstaller(options);
    spiner.close();
    console.log('make success!');
  } catch (e) {
    console.error(e);
  } finally {
    spiner.close();
  }
}

make();

function useSpin() {
  const c = '|/-\\';
  let i = 0;
  let timer = null;
  const open = () => {
    timer = setInterval(() => {
      i = ++i % c.length;
      process.stdout.write(`\r ${c[i]}`);
    }, 500);
  };

  const close = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
      process.stdout.clearLine();
    }
  };

  return {
    open,
    close,
  };
}
