var path = require("path");
var electron = require("electron");
var globalShortcut = electron.globalShortcut;
var Menu = electron.Menu;
var BrowserWindow = electron.BrowserWindow;
var app = electron.app;
//プロセス間通信
var ipcMain = electron.ipcMain;
var MyApp = /** @class */ (function () {
    function MyApp(app) {
        var _this = this;
        this.app = app;
        this.mainWindow = null;
        app.on("ready", function () {
            globalShortcut.register("CommandOrControl+Shift+M", function () {
                _this.mainWindow.webContents.send("ctrl-shift-m", "Hello! from Main.");
            });
            _this.onReady();
            _this.initWindowMenu();
        });
    }
    MyApp.prototype.onReady = function () {
        var _this = this;
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
        this.mainWindow.on("closed", function () {
            _this.mainWindow = null;
        });
    };
    MyApp.prototype.initWindowMenu = function () {
        var _menuStruct = [
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
                        click: function () {
                            var _window = require("electron").BrowserWindow.getFocusedWindow();
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
                        click: function () {
                            var _window = require("electron").BrowserWindow.getFocusedWindow();
                            _window.loadFile("settings.html");
                        }
                    }
                ]
            }
        ];
        var _menu = Menu.buildFromTemplate(_menuStruct);
        Menu.setApplicationMenu(_menu);
    };
    return MyApp;
}());
var myApp = new MyApp(app);
