const electron = require("electron");
const desktopCapture = electron.desktopCapturer;
const Config = require("electron-config");
const config = new Config();

//ファイルの入出力
const fileStream = require("fs");
const OS = require("os");
const path = require("path");

//OSの通知を使う
function notififyScreenshot(msg: string, imagePath: string){
    
    const _notifier = new Notification("Screenshot for Slack", {
        body: msg,
        silent: true,
    });

    _notifier.onclick = () => {
        console.log("OnClickEvent.");

        //OSのShellを使ってファイルを開く
        const _shell = electron.shell;
        _shell.openItem(imagePath);
    };
}

//デバッグ用の表示
const debugMsg = document.getElementById("debug_msg");

function showMsgToConsole(msg: string){
    debugMsg.textContent = msg;
}

//キャプチャのボタン
const captureBtn = document.getElementById("capture_btn");

function saveScreenImage(): string{
    let _savePath: string = "";

    showMsgToConsole("スクリーンショットを取得中...");

    //スクリーンショットの設定
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    let _options = {
        types: ["screen"],
        thumbnailSize: {
            width: width,
            height: height
        }
    };

    //デスクトップを撮影
    desktopCapture.getSources(
        _options,
        (error, sources) => {
            //エラーが来た場合は強制終了
            if(error){
                // console.log(error);
                return console.log(error);
            }

            //取得したSourceを総当たり
            sources.forEach(source => {
                console.log(source.name);
                //メインスクリーン、または1番目のスクリーンを対象とする
                if(source.name == "Entire screen" || source.name == "Screen 1"){
                    //保存するディレクトリの取得
                    const _date = new Date();
                    let _imageFileName = "screenshot_" + _date.getTime().toString() + ".png";
                    _savePath = path.join(OS.tmpdir(), _imageFileName);
                
                    //ファイルにPNG形式で書き込む
                    fileStream.writeFile(
                        _savePath,
                        source.thumbnail.toPNG(),
                        (error) => {
                            //エラーが来たときは強制終了
                            if(error){
                                // console.log(error);
                                return console.log(error);
                            }

                            const _msg = "次のディレクトリに保存しました。\n" + _savePath;
                            showMsgToConsole(_msg);

                            const {apiKey, channelUrl} = config.get("apiElements");
                            const slack: SlackAPI = new SlackAPI(apiKey, channelUrl);
                            slack.postImage(_savePath, _imageFileName);
                            
                            //スクリーンショットの通知
                            notififyScreenshot("Saved current screen.", _savePath);

                            return _savePath;
                        }
                        )
                }
            });
        }
    );

    return _savePath;
}

//キャプチャのボタンにClickイベントを仕掛ける
captureBtn.addEventListener("click", () => {
    const _imgPath = saveScreenImage();
});


//プロセス間通信
const ipcRenderer = electron.ipcRenderer;
ipcRenderer.on("ctrl-shift-m", (arg) => {
    saveScreenImage();
})