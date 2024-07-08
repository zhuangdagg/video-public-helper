import { contextBridge, ipcRenderer } from 'electron';

import { handleKeys } from './handle/handleMap';

function createPreload() {
  const IPC_INFO = [] as any;
  Object.keys(handleKeys).forEach((field) => {
    const methods: Record<string, Function> = {};
    Object.entries(handleKeys[field]).forEach(([method, invoke]) => {
      IPC_INFO.push({ field, method, invoke });
      methods[method] = (...args: any[]) => ipcRenderer.invoke(invoke, ...args);
    });

    contextBridge.exposeInMainWorld(field, methods);
  });
  console.log('preload.js loaded handler:');
  console.log({ IPC_INFO });
}

createPreload();

// 版本更新listener
contextBridge.exposeInMainWorld('systemMessage', {
  onVersionCheck: (cb: any) => ipcRenderer.on('version-check', cb),
});
