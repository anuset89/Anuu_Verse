const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { setupDatabase } = require('../src/utils/database');
const { getConfig } = require('../config/api-config');

let mainWindow;

function createWindow() {
    const config = getConfig();

    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        icon: path.join(__dirname, '../build/icon.png'),
                                   webPreferences: {
                                       nodeIntegration: false,
                                       contextIsolation: true,
                                       enableRemoteModule: false,
                                       preload: path.join(__dirname, 'preload.js')
                                   },
                                   titleBarStyle: 'default',
                                   show: false
    });

    // Cargar app
    const startUrl = process.env.ELECTRON_START_URL ||
    `file://${path.join(__dirname, '../dist/index.html')}`;

    mainWindow.loadURL(startUrl);

    // Mostrar cuando esté lista
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    // Menú mínimo
    mainWindow.setMenuBarVisibility(false);
}

// Inicializar
app.whenReady().then(async () => {
    try {
        await setupDatabase();
        console.log('✅ Base de datos lista');
        createWindow();
    } catch (error) {
        console.error('❌ Error inicializando:', error);
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
