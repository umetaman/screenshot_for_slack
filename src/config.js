var Config = require("electron-config");
var config = new Config;
var backBtn = document.getElementById("back_btn");
backBtn.addEventListener("click", function () {
    //inputの内容を保存する
    var _apiKey = document.forms.settings_form.slack_api_key.value;
    var _channelUrl = document.forms.settings_form.channel_url.value;
    config.set("apiElements.apiKey", _apiKey);
    config.set("apiElements.channelUrl", _channelUrl);
});
