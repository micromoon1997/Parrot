const {
      accountSid,
      authToken
} = require("../../keys");
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

