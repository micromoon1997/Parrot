const fs = require('fs');
const path = require('path');
const googleClient = require('../../../services/transcribe/google-speaker-diarization');

function removeFilesFromFolder(dirPath) {
    fs.readdir(dirPath, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            }
        }
    });
}

describe('Google client', function () {
    this.timeout(30000);
    after(function () {
        removeFilesFromFolder(`${__dirname}/../../../services/transcribe/output`);
        removeFilesFromFolder(`${__dirname}/../../../services/transcribe/output/tempdir`);
    });

    it('should get untagged transcription', async function () {
        const meetingId = 'test2.wav';
        const speakerCount = 3;
        const untaggedTranscription = await googleClient.getUntaggedTranscription(meetingId, speakerCount);
        console.log(untaggedTranscription);
    });

    it('should create google cloud write stream', function () {
        // TODO
    })
});
