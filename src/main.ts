const path = require("path");
const electron = require("electron");
const globalShortcut = electron.globalShortcut;
const Menu = electron.Menu;
const BrowserWindow: Electron.BrowserWindow = electron.BrowserWindow;
const app: Electron.App = electron.app;
//プロセス間通信
const ipcMain = electron.ipcMain;

class MyApp{
    
    mainWindow: Electron.BrowserWindow = null;

    constructor(public app: Electron.App){
        app.on("ready", () => {
            globalShortcut.register("CommandOrControl+Shift+M", () => {
                this.mainWindow.webContents.send("ctrl-shift-m", "Hello! from Main.");
            })
            this.onReady();
            this.initWindowMenu();
        });
    }

    public onReady(){
        this.mainWindow = new BrowserWindow({
            x: 0,
            y: 0,
            width: 400,
            height: 250,
            webPreferences: {
                nodeIntegration: true
            }
        });

        this.mainWindow.loadFile("index.html");
        this.mainWindow.webContents.openDevTools();
        this.mainWindow.on("closed", () => {
            this.mainWindow = null;
        });
    }

    public initWindowMenu() {
        const _menuStruct = [
            {
                label: "Edit",
                submenu: [
                    {
                        label: "Undo",
                        accelerator: "CmdOrCtrl+Z",
                        selector: "undo:"
                    },
                    {
                        label: "Redo",
                        accelerator: "Shift+CmdOrCtrl+Z",
                        selector: "redo:"
                    },
                    {
                        type: "separator"
                    },
                    {
                        label: "Cut",
                        accelerator: "CmdOrCtrl+X",
                        selector: "cut:"
                    },
                    {
                        label: "Copy",
                        accelerator: "CmdOrCtrl+C",
                        selector: "copy:"
                    },
                    {
                        label: "Paste",
                        accelerator: "CmdOrCtrl+V",
                        selector: "paste:"
                    },
                    {
                        label: "Select All",
                        accelerator: "CmdOrCtrl+A",
                        selector: "selectAll:"
                    },
                    {
                        type: "separator"
                    },
                    {
                        label: "Quit",
                        accelerator: "CommandOrControl+Q",
                        click(){
                            const _window = require("electron").BrowserWindow.getFocusedWindow();
                            _window.close();
                        }
                    }
                ]
            },
            {
                label: "Help",
                submenu: [
                    {
                        label: "Settings",
                        click(){
                            const _window = require("electron").BrowserWindow.getFocusedWindow();
                            _window.loadFile("settings.html");
                        }
                    }
                ]
            }
        ];

        const _menu = Menu.buildFromTemplate(_menuStruct);
        Menu.setApplicationMenu(_menu);
    }
}

const myApp: MyApp = new MyApp(app);