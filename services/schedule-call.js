const schedule = require('node-schedule');
const { makeCall } = require('./twilio');
const { getDatabase } = require('./database');

const scheduleCall = async (meetingId) => {
    const db = getDatabase();
    const meeting = await db.collection('meetings').findOne({meetingId});
    if (!meeting) {
      console.log(`Fail to schedule call because no meeting was found with meeting id:${meetingId}`);
      return;
    }
    const toPhoneNumber = meeting.phoneNumber;
    const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const date = new Date(meeting.start.dateTime + 'Z');
    const job = schedule.scheduledJobs[meetingId];
    if (job) {
      job.cancel();
    }
    schedule.scheduleJob(meetingId, date, async () => {
      console.log(`Calling to meeting:${meetingId}`);
      const callSid = await makeCall({meetingId, toPhoneNumber, fromPhoneNumber, record: true});
      await db.collection('meetings').updateOne(
        {meetingId: meetingId},
        {$set: {callSid} },
      );
    });
};

module.exports = {
  scheduleCall
};