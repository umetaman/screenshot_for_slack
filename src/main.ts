const electron = require("electron");
const BrowserWindow: Electron.BrowserWindow = electron.BrowserWindow;
const app: Electron.App = electron.app;

class MyApp{
    
    mainWindow: Electron.BrowserWindow = null;

    constructor(public app: Electron.App){
        app.on("ready", this.onReady);
    }

    onReady(){
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
        this.mainWindow.on("closed", () => {
            this.mainWindow = null;
        });
    }

}

const myApp: MyApp = new MyApp(app);