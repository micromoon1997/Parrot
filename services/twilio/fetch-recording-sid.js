// const {
//       accountSid,
//       authToken
// } = require("../../keys");
const accountSid = process.env.TWILLIO_ACCOUNT_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const fetchRecordingSid = async callSid => {
      let recordings = null;

      async function recursiveRetry() {
            const recordings = await client
            .recordings
            .list({callSid, limit: 20});

            return recordings;
      }

      while(recordings === null || recordings.length === 0) {
            recordings = await recursiveRetry();
      }
      
      return recordings[0].sid;
};

module.exports = fetchRecordingSid;

