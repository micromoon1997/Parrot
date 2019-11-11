const axios = require("axios");
const fs = require("fs");

const fetchRecording = async ({
    recordingSid,
    meetingId,
}) => {
    const instance = axios.create({
        baseURL: `https://api.twilio.com/2010-04-01/Accounts/AC7eb8544826d02708e322eb3a9b3d0a6e`,
        timeout: 5000,
        responseType: 'stream',
        headers: {
            'Content-Type': 'audio/x-wav'
        }
    });

    const {data} = await instance.get(`/Recordings/${recordingSid}`);
    return data;
};

module.exports = fetchRecording;