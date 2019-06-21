var electron = require("electron");
var desktopCapture = electron.desktopCapturer;
var Config = require("electron-config");
var config = new Config();
//ファイルの入出力
var fileStream = require("fs");
var OS = require("os");
var path = require("path");
//OSの通知を使う
function notififyScreenshot(msg, imagePath) {
    var _notifier = new Notification("Screenshot for Slack", {
        body: msg,
        silent: true
    });
    _notifier.onclick = function () {
        console.log("OnClickEvent.");
        //OSのShellを使ってファイルを開く
        var _shell = electron.shell;
        _shell.openItem(imagePath);
    };
}
//デバッグ用の表示
var debugMsg = document.getElementById("debug_msg");
function showMsgToConsole(msg) {
    debugMsg.textContent = msg;
}
//SlackのAPIを使うためのクラス
var request = require("request");
var SlackAPI = /** @class */ (function () {
    function SlackAPI(key, channelUrl) {
        this.key = key;
        this.channelUrl = channelUrl;
        this.SLACK_UPLOAD_URL = "https://slack.com/api/files.upload";
        this.apiKey = "";
        this.channelID = "";
        this.apiKey = key;
        var _channelUrlSplitted = channelUrl.split('/');
        this.channelID = _channelUrlSplitted[_channelUrlSplitted.length - 1];
    }
    SlackAPI.prototype.postImage = function (imagePath, imageTitle) {
        //邪悪な命名
        var _tmp = imagePath.split('/');
        var _fileName = _tmp[_tmp.length - 1];
        showMsgToConsole(imagePath);
        var _options = {
            url: this.SLACK_UPLOAD_URL,
            formData: {
                token: this.apiKey,
                title: imageTitle,
                filename: _fileName,
                filetype: "auto",
                channels: this.channelID,
                file: fileStream.createReadStream(imagePath)
            }
        };
        request.post(_options, function (error, response) {
            console.log(JSON.parse(response));
        });
    };
    return SlackAPI;
}());
//キャプチャのボタン
var captureBtn = document.getElementById("capture_btn");
function saveScreenImage() {
    var _savePath = "";
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
            console.log(source.name);
            //メインスクリーン、または1番目のスクリーンを対象とする
            if (source.name == "Entire screen" || source.name == "Screen 1") {
                //保存するディレクトリの取得
                var _date = new Date();
                var _imageFileName_1 = "screenshot_" + _date.getTime().toString() + ".png";
                _savePath = path.join(OS.tmpdir(), _imageFileName_1);
                //ファイルにPNG形式で書き込む
                fileStream.writeFile(_savePath, source.thumbnail.toPNG(), function (error) {
                    //エラーが来たときは強制終了
                    if (error) {
                        // console.log(error);
                        return console.log(error);
                    }
                    var _msg = "次のディレクトリに保存しました。\n" + _savePath;
                    showMsgToConsole(_msg);
                    var _a = config.get("apiElements"), apiKey = _a.apiKey, channelUrl = _a.channelUrl;
                    var slack = new SlackAPI(apiKey, channelUrl);
                    slack.postImage(_savePath, _imageFileName_1);
                    //スクリーンショットの通知
                    notififyScreenshot("Saved current screen.", _savePath);
                    return _savePath;
                });
            }
        });
    });
    return _savePath;
}
//キャプチャのボタンにClickイベントを仕掛ける
captureBtn.addEventListener("click", function () {
    var _imgPath = saveScreenImage();
});
//プロセス間通信
var ipcRenderer = electron.ipcRenderer;
ipcRenderer.on("ctrl-shift-m", function (arg) {
    saveScreenImage();
});
