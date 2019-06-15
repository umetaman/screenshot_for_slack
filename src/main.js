var electron = require("electron");
var BrowserWindow = electron.BrowserWindow;
var app = electron.app;
var MyApp = /** @class */ (function () {
    function MyApp(app) {
        this.app = app;
        this.mainWindow = null;
        app.on("ready", this.onReady);
    }
    MyApp.prototype.onReady = function () {
        var _this = this;
        this.mainWindow = new BrowserWindow({
            x: 0,
            y: 0,
            width: 300,
            height: 120,
            minWidth: 150,
            minHeight: 65,
            titleBarStyle: "hidden",
            transparent: true,
            frame: false,
            webPreferences: {
                nodeIntegration: true
            }
        });
        this.mainWindow.loadFile("index.html");
        this.mainWindow.on("closed", function () {
            _this.mainWindow = null;
        });
    };
    return MyApp;
}());
var myApp = new MyApp(app);
