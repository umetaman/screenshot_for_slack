namespace Setting{

    namespace Slack{
        const request = require("request");

        export class Channel{
            public _id: string = "";
            public _name: string = "";

            constructor(public id: string, public name: string){
                this._id = id;
                this._name = name;
            }
        }

        export class API{
            private SLACK_UPLOAD_URL: string = "https://slack.com/api/files.upload";
            private SLACK_CHANNEL_LIST_URL: string = "https://slack.com/api/channels.list";
            public apiKey: string = "";
            public channels: Channel[] = [];
        
            constructor(public key: string){
                this.apiKey = key;
            }

            public setChannels(){
                let _options = {
                    url: this.SLACK_CHANNEL_LIST_URL,
                    formData: {
                        token: this.apiKey
                    }
                }

                request.post(_options, (error, response) => {
                    if(error){
                        return console.log(error);
                    }
                    
                    let _channels = JSON.parse(response.body).channels;

                    for(let i = 0; i < _channels.length; i++){
                        this.channels.push(new Channel(_channels[i].id, _channels[i].name));
                        console.log(`push => id: ${_channels[i].id}, name: ${_channels[i].name}`);
                    }

                    return this.channels;
                });
            }
        
            public postImage(channelId: string, imagePath: string, imageTitle: string) {
                //邪悪な命名
                let _tmp = imagePath.split('/');
                const _fileName = _tmp[_tmp.length - 1];

                const _fileStream = require("fs");
        
                let _options = {
                    url: this.SLACK_UPLOAD_URL,
                    formData: {
                        token: this.apiKey,
                        title: imageTitle,
                        filename: _fileName,
                        filetype: "auto",
                        channels: channelId,
                        file: _fileStream.createReadStream(imagePath)
                    }
                }
        
                request.post(_options, (error, response) => {
                    console.log(JSON.parse(response));
                })
            }
        }
    }
}

