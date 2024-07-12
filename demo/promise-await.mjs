import fs from 'node:fs';
import path from 'node:path';

async function sleep(time) {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log('sleep:', time);
      resolve();
    }, time);
  });
}

async function execLongTimeTask() {
  const tasks = [4000, 2000].map(async (time) => sleep(time));
  // await [3000, ]
  await Promise.all(tasks);
  console.log('long time task finish');
}

(async function main() {
  // await execLongTimeTask();
  fs.rmSync(path.join(process.cwd(), './demo/download'), { recursive: true, force: true });
  fs.mkdirSync(path.join(process.cwd(), './demo/download'));
})();
