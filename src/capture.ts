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

//デバッグ用の表示
const debugMsg = document.getElementById("debug_msg");

function showMsgToConsole(msg: string){
    debugMsg.textContent = msg;
}

//SlackのAPIを使うためのクラス
const request = require("request");

class SlackAPI{
    private SLACK_UPLOAD_URL: string = "https://slack.com/api/files.upload";
    public apiKey: string = "";
    public channelID: string = "";

    constructor(public key: string, public channelUrl: string){
        this.apiKey = key;
        
        let _channelUrlSplitted = channelUrl.split('/');
        this.channelID = _channelUrlSplitted[_channelUrlSplitted.length - 1];
    }

    public postImage(imagePath: string, imageTitle: string) {
        //邪悪な命名
        let _tmp = imagePath.split('/');
        const _fileName = _tmp[_tmp.length - 1];

        showMsgToConsole(imagePath);

        let _options = {
            url: this.SLACK_UPLOAD_URL,
            formData: {
                token: this.apiKey,
                title: imageTitle,
                filename: _fileName,
                filetype: "auto",
                channels: this.channelID,
                file: fileStream.createReadStream(imagePath)
            }
        }

        request.post(_options, (error, response) => {
            console.log(JSON.parse(response));
        })
    }
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