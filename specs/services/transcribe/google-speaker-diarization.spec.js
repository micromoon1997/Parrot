const fs = require('fs');
const path = require('path');
const googleClient = require('../../../services/transcribe/google-speaker-diarization');
const removeHelper = require('../../../services/transcribe/clear-temporary-files');

describe('Google client', function () {
    after(function () {
        removeHelper.clearWavFile(`${__dirname}/../../../tmp`);
        // removeFilesFromFolder(`${__dirname}/../../../services/transcribe/output`);
        // removeFilesFromFolder(`${__dirname}/../../../services/transcribe/output/tempdir`);
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
