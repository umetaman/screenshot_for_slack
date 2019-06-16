'use strict';

const builder = require("electron-builder");
const fs = require("fs");
const packagejson = JSON.parse(fs.readFileSync("./package.json", "utf8"));

builder.build({
    platform: "mac",
    config: {
        "appId": `com.umetaman.${packagejson.name}`,
        "mac": {
            "target": "zip"
        }
    }
});