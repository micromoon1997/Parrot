const accountSid = process.env.TWILLIO_ACCOUNT_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const {getDatabase} = require('../database');

const fetchRecordingSid = async meetingId => {
    const db = getDatabase();

    const {callSid} = await db.collection('meetings').findOne({meetingId});
    const recordings = await client.recordings.list({callSid, limit: 20});
    
    return recordings[0].sid;
};

module.exports = fetchRecordingSid;

