import { contextBridge, ipcRenderer , IpcMainInvokeEvent } from 'electron'

contextBridge.exposeInMainWorld('darkMode', {
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
    system: () => ipcRenderer.invoke('dark-mode:system')
})