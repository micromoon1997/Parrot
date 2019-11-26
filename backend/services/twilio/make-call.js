const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// TODO: retrieve webex meeting
const makeCall = async ({
  meetingId,
  toPhoneNumber,
  fromPhoneNumber,
  record,
  dialCode,
}) => {
  console.log(dialCode);
  try {
    const data = await client
      .calls
      .create({
        record,
        recordingStatusCallback: `${process.env.SERVER_ADDRESS}/call/done/${meetingId}`,
        recordingStatusCallbackMethod: 'GET',
        recordingStatusCallbackEvent: ['completed'],
        url: 'https://handler.twilio.com/twiml/EHa4832ab1c46be891eab82389260ed373',
        to: toPhoneNumber,
        from: fromPhoneNumber,
        sendDigits: dialCode ? `ww${dialCode}#` : undefined
      });

    return data.sid;
  } catch (err) {
    console.log(`Call failed with error:${err}`);
  }
};

module.exports = makeCall;