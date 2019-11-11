const {getDatabase} = require('../database');

const updateDatabase = async ({
    relativePath,
    meetingId
}) => {
    const db = getDatabase();
    db.collection('meetings').updateOne(
        {meetingId},
        {$set: {path: relativePath} },
      );
};

module.exports = updateDatabase;

