const { contextBridge, ipcRenderer } = require('electron');

// APIs seguras para el renderer
contextBridge.exposeInMainWorld('electronAPI', {
    // Aquí puedes añadir funciones seguras
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
                                openExternal: (url) => ipcRenderer.invoke('open-external', url)
});
