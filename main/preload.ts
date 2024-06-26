import { contextBridge, ipcRenderer } from 'electron';

import { handleKeys } from './handle/handleMap';

function createPreload() {
  Object.keys(handleKeys).forEach((field) => {
    const methods: Record<string, Function> = {};
    Object.entries(handleKeys[field]).forEach(([method, invoke]) => {
      console.log({ field, method, invoke });
      methods[method] = (...args: any[]) => ipcRenderer.invoke(invoke, ...args);
    });

    contextBridge.exposeInMainWorld(field, methods);
  });
}

createPreload();

// contextBridge.exposeInMainWorld('playwright', {
//   login: (args: any) => ipcRenderer.invoke('playwright:login', args),
// });
