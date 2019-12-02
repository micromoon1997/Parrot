const axios = require("axios");

const fetchRecording = async ({
    recordingSid
}) => {
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const instance = axios.create({
            baseURL: `https://api.twilio.com/2010-04-01/Accounts/${accountSid}`,
            timeout: 5000,
            responseType: 'stream',
            headers: {
                'Content-Type': 'audio/x-wav'
            }
        });

        const {data} = await instance.get(`/Recordings/${recordingSid}`);
        return data;
    } catch (err) {
        console.log(`Fail to fetch recording:${err}`);
    }
};

module.exports = fetchRecording;