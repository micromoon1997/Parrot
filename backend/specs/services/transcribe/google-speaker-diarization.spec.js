const expect = require('chai').expect;
const googleClient = require('../../../services/transcribe/google-speaker-diarization');
const {clearWavFile} = require('../../../services/transcribe/clear-temporary-files');

describe('Google client', function () {
    after(function () {
        clearWavFile(`${__appRoot}/tmp`);
    });

    it('should get untagged transcription', async function () {
        const meetingId = 'test2.wav';
        const speakerCount = 3;
        const untaggedTranscription = await googleClient.getUntaggedTranscription(meetingId, speakerCount);
        expect(untaggedTranscription).to.be.a('string');
    });

    it('should create google cloud write stream', function () {
        const stream = googleClient.createGoogleCloudWriteStream('123');
        expect(stream).to.be.an('object');
        expect(stream).to.have.a.property('writable', true);
    })
});
