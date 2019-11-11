const schedule = require('node-schedule');
const {makeCall} = require('./twilio');
const {getDatabase} = require('./database');

const scheduleCall = ({meetingId, time, toPhoneNumber, fromPhoneNumber}) => {
    schedule.scheduleJob(time, async () => {
      const db = getDatabase();
      const callSid = await makeCall({meetingId, toPhoneNumber, fromPhoneNumber, record: true});
      db.collection('meetings').updateOne(
        {meetingId: meetingId},
        {$set: {callSid} },
      );
    });
};

module.exports = {
  scheduleCall
};