const axios = require("axios");
const fs = require("fs");

const fetchRecording = async recordingSid => {
    const instance = axios.create({
        baseURL: `https://api.twilio.com/2010-04-01/Accounts/AC7eb8544826d02708e322eb3a9b3d0a6e`,
        timeout: 5000,
        responseType: 'stream',
        headers: {
            'Content-Type': 'audio/x-wav'
        }
    });
    
    async function recursiveRetry() {
        await instance.get(`/Recordings/${recordingSid}`).then((response) => {
            response.data.pipe(fs.createWriteStream('test.wav'));
        });
    }

    while (true) {
        try {
            await recursiveRetry();
            console.log("DONE!");
            break;
        } catch(e) {
            console.log(`error: ${e}`);
            // do nothing
        }
    }
};

module.exports = fetchRecording;