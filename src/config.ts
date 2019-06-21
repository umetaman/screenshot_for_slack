const Config = require("electron-config");
const config = new Config;

const backBtn = document.getElementById("back_btn");

let apiInput, channelInput;

window.onload = () => {
    apiInput = document.forms.api_form.slack_api_key;
    channelInput = document.forms.channel_select_form.channel_select;
}

function initForm(){
    
}

backBtn.addEventListener("click", () => {
    //inputの内容を保存する
    const _apiKey = document.forms.settings_form.slack_api_key.value;
    const _channelUrl = document.forms.settings_form.channel_url.value;

    config.set("apiElements.apiKey", _apiKey);
    config.set("apiElements.channelUrl", _channelUrl);
})

// function resetSettingsForm(){
//     const {apiKey, channelUrl} = config.get("apiElements");

//     console.log(apiKey + ", " + channelUrl);

//     document.forms.settings_form.slack_api_key.value = apiKey;
//     document.forms.settings_form.channel_url.value = channelUrl;
// }

// window.onload = () => {
//     resetSettingsForm()
// };
