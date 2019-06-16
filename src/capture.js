var electron = require("electron");
var desktopCapture = electron.desktopCapturer;
var Config = require("electron-config");
var config = new Config();
//OSのシェル操作と同等の機能を使えるように
var shell = electron.shell;
//ファイルの入出力
var fileStream = require("fs");
var OS = require("os");
var path = require("path");
//キャプチャのボタン
var captureBtn = document.getElementById("capture_btn");
//デバッグ用の表示
var debugMsg = document.getElementById("debug_msg");
//保存していたパラメータの取得
var _a = config.get("apiElements"), apiKey = _a.apiKey, channelUrl = _a.channelUrl;
function showMsgToConsole(msg) {
    debugMsg.textContent = msg;
}
function saveScreenImage() {
    showMsgToConsole("スクリーンショットを取得中...");
    //スクリーンショットの設定
    var _a = electron.screen.getPrimaryDisplay().workAreaSize, width = _a.width, height = _a.height;
    var _options = {
        types: ["screen"],
        thumbnailSize: {
            width: width,
            height: height
        }
    };
    //デスクトップを撮影
    desktopCapture.getSources(_options, function (error, sources) {
        //エラーが来た場合は強制終了
        if (error) {
            // console.log(error);
            return console.log(error);
        }
        //取得したSourceを総当たり
        sources.forEach(function (source) {
            //メインスクリーン、または1番目のスクリーンを対象とする
            if (source.name == "Entire Screen" || source.name == "Screen 1") {
                //保存するディレクトリの取得
                var _date = new Date();
                var _imageFileName = "screenshot_" + _date.getTime().toString() + ".png";
                var _savePath_1 = path.join(OS.tmpdir(), _imageFileName);
                //ファイルにPNG形式で書き込む
                fileStream.writeFile(_savePath_1, source.thumbnail.toPNG(), function (error) {
                    //エラーが来たときは強制終了
                    if (error) {
                        // console.log(error);
                        return console.log(error);
                    }
                    var _msg = "次のディレクトリに保存しました。\n" + _savePath_1;
                    showMsgToConsole(_msg);
                });
            }
        });
    });
}
//キャプチャのボタンにClickイベントを仕掛ける
captureBtn.addEventListener("click", function () {
    saveScreenImage();
});
