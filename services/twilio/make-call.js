const accountSid = process.env.TWILLIO_ACCOUNT_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;
const recordingStatusCallbackBaseurl = process.env.SERVER_ADDRESS;
const client = require('twilio')(accountSid, authToken);

// TODO: retrieve webex meeting
const call = async ({
  toPhoneNumber,
  fromPhoneNumber,
  record
}) => {
  const data = await client
      .calls
      .create({
         record,
         recordingStatusCallback: `${recordingStatusCallbackBaseurl}/call/done`,
         recordingStatusCallbackMethod: 'GET',
         recordingStatusCallbackEvent: ['completed'],
         url: 'http://demo.twilio.com/docs/voice.xml',
         to: toPhoneNumber,
         from: fromPhoneNumber
       });
  
  return data.sid;
};

module.exports = call;