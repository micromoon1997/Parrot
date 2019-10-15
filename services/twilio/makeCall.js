const {
  accountSid,
  authToken
} = require("../../keys");
const client = require('twilio')(accountSid, authToken);

// TODO: retrieve webex meeting
const call = async (toPhoneNumber, fromPhoneNumber, record) => {
  console.log(accountSid + authToken);
  const data = await client
      .calls
      .create({
         record,
        //  recordingStatusCallback: 'http://638b0a52.ngrok.io/done',
        //  recordingStatusCallbackMethod: 'GET',
        //  recordingStatusCallbackMethod: ['in-progress','completed'],
         url: 'http://demo.twilio.com/docs/voice.xml',
         to: toPhoneNumber,
         from: fromPhoneNumber
       });
  
  return data.sid;
};

module.exports = call;