const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const {getDatabase} = require('../database');

const fetchRecordingSid = async meetingId => {
    try {
        const db = getDatabase();

        const {callSid} = await db.collection('meetings').findOne({meetingId});
        const recordings = await client.recordings.list({callSid, limit: 20});

        return recordings[0].sid;
    } catch (err) {
        console.log(`Fail to fetch recording sid:${err}`);
    }

};

module.exports = fetchRecordingSid;

