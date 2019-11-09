const schedule = require('node-schedule');
const makeCall = require("./twilio/make-call");
const fetchRecordingSid = require("./twilio/fetch-recording-sid");
const fetchRecording = require("./twilio/fetch-recording");

// TODO: Store in database for testRecording
let callSid;

const scheduleCall = ({meetingId, time, toPhoneNumber, fromPhoneNumber}) => {
    schedule.scheduleJob(time, async () => {
      callSid = await makeCall({meetingId, toPhoneNumber, fromPhoneNumber, record: true});
    });
};

const testRecording = async meetingId => {
    const recordingSid = await fetchRecordingSid(callSid);
    await fetchRecording({recordingSid, meetingId});
};

module.exports = {
  scheduleCall: scheduleCall,
  testRecording: testRecording
};