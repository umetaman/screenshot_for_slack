var Setting;
(function (Setting) {
    var Slack;
    (function (Slack) {
        var request = require("request");
        var Channel = /** @class */ (function () {
            function Channel(id, name) {
                this.id = id;
                this.name = name;
                this._id = "";
                this._name = "";
                this._id = id;
                this._name = name;
            }
            return Channel;
        }());
        Slack.Channel = Channel;
        var API = /** @class */ (function () {
            function API(key) {
                this.key = key;
                this.SLACK_UPLOAD_URL = "https://slack.com/api/files.upload";
                this.SLACK_CHANNEL_LIST_URL = "https://slack.com/api/channels.list";
                this.apiKey = "";
                this.channels = [];
                this.apiKey = key;
            }
            API.prototype.setChannels = function () {
                var _this = this;
                var _options = {
                    url: this.SLACK_CHANNEL_LIST_URL,
                    formData: {
                        token: this.apiKey
                    }
                };
                request.post(_options, function (error, response) {
                    if (error) {
                        return console.log(error);
                    }
                    var _channels = JSON.parse(response.body).channels;
                    for (var i = 0; i < _channels.length; i++) {
                        _this.channels.push(new Channel(_channels[i].id, _channels[i].name));
                        console.log("push => id: " + _channels[i].id + ", name: " + _channels[i].name);
                    }
                    return _this.channels;
                });
            };
            API.prototype.postImage = function (channelId, imagePath, imageTitle) {
                //邪悪な命名
                var _tmp = imagePath.split('/');
                var _fileName = _tmp[_tmp.length - 1];
                var _fileStream = require("fs");
                var _options = {
                    url: this.SLACK_UPLOAD_URL,
                    formData: {
                        token: this.apiKey,
                        title: imageTitle,
                        filename: _fileName,
                        filetype: "auto",
                        channels: channelId,
                        file: _fileStream.createReadStream(imagePath)
                    }
                };
                request.post(_options, function (error, response) {
                    console.log(JSON.parse(response));
                });
            };
            return API;
        }());
        Slack.API = API;
    })(Slack || (Slack = {}));
})(Setting || (Setting = {}));
