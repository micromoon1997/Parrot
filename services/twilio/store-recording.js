const fs = require("fs");

const storeRecording = async ({recording, meetingId}) => {
    const relativePath = `./Recordings/${meetingId}.wav`;
    recording.pipe(fs.createWriteStream(relativePath));
    return relativePath;
};

module.exports = storeRecording;