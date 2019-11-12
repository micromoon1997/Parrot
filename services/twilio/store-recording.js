const fs = require("fs");
const resolve = require('path').resolve;

const storeRecording = async ({recording, meetingId}) => {
    //const relativePath = `./Recordings/${meetingId}.wav`;
    const relativePath = `${__dirname}/../transcribe/Recordings/${meetingId}.wav`;
    const path = resolve(relativePath);
    console.log(path);
    recording.pipe(fs.createWriteStream(path));
    return path;
};

module.exports = storeRecording;