const googleClient = require('../../../services/transcribe/google-speaker-diarization');
const {clearWavFile} = require('../../../services/transcribe/clear-temporary-files');

describe('Google client', function () {
    after(function () {
        clearWavFile(`${__dirname}/../../../tmp`);
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
