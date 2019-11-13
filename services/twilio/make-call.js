const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// TODO: retrieve webex meeting
const makeCall = async ({
  meetingId,
  toPhoneNumber,
  fromPhoneNumber,
  record,
}) => {
  try {
    const data = await client
      .calls
      .create({
        record,
        recordingStatusCallback: `${process.env.SERVER_ADDRESS}/call/done/${meetingId}`,
        recordingStatusCallbackMethod: 'GET',
        recordingStatusCallbackEvent: ['completed'],
        url: 'http://demo.twilio.com/docs/voice.xml',
        to: toPhoneNumber,
        from: fromPhoneNumber
      });
    return data.sid;
  } catch (err) {
    console.log(`Call failed with error:${err}`);
  }
};

module.exports = makeCall;