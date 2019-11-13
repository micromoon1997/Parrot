const {getDatabase} = require('../database');

const updateDatabase = async ({
    relativePath,
    meetingId
}) => {
    const db = getDatabase();
    db.collection('meetings').updateOne(
        {meetingId},
        {$set: {recordingFileUrl: relativePath} },
      );
};

module.exports = updateDatabase;

