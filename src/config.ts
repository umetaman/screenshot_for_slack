const Config = require("electron-config");
const config = new Config;

const backBtn = document.getElementById("back_btn");

backBtn.addEventListener("click", () => {
    //inputの内容を保存する
    const _apiKey = document.forms.settings_form.slack_api_key.value;
    const _channelUrl = document.forms.settings_form.channel_url.value;

    config.set("apiElements.apiKey", _apiKey);
    config.set("apiElements.channelUrl", _channelUrl);
})