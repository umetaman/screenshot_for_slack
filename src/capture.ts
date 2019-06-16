const electron = require("electron");
const desktopCapture = electron.desktopCapturer;
const Config = require("electron-config");
const config = new Config();

//OSのシェル操作と同等の機能を使えるように
const shell = electron.shell;

//ファイルの入出力
const fileStream = require("fs");
const OS = require("os");
const path = require("path");

//キャプチャのボタン
const captureBtn = document.getElementById("capture_btn");
//デバッグ用の表示
const debugMsg = document.getElementById("debug_msg");

function showMsgToConsole(msg: string){
    debugMsg.textContent = msg;
}

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
                //メインスクリーン、または1番目のスクリーンを対象とする
                if(source.name == "Entire Screen" || source.name == "Screen 1"){
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
                        }
                        )
                }
            });
        }
    );

    return _savePath;
}

function postToSlackChennel(imgPath: string): boolean{
    
}

//キャプチャのボタンにClickイベントを仕掛ける
captureBtn.addEventListener("click", () => {
    const _imgPath = saveScreenImage();
});