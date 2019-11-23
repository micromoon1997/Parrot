const azureClient = require('../../services/ms-speaker-registration');

describe("Azure cognitive service client", function () {
    it('should tag transcription', async function () {
        const meetingId = 'test2';
        // Vincent, Yan and Desta respectively
        const profileIds = ['4d83796d-bcce-4664-b336-7b80a25f11b6', 'b84adae5-881b-4dc4-b2ae-4c18b35839f7', 'b84adae5-881b-4dc4-b2ae-4c18b35839f7'];
        const untaggedTranscription = 'Meeting Minutes\n' +
            '\n' +
            'speaker3: Good morning Professor Austin early\n' +
            'speaker2: morning James. I\'m doing well, and you I\'m great.\n' +
            'speaker3: Thank you. This is my friend Emma. She\'s thinking about applying to this college. She has a few questions. Would you mind solely us about this process, please?\n' +
            'speaker2: Hello Emma. It\'s presently 2. I\'m more than happy to we speak with you. Please stop by my office next week\n' +
            'speaker1: and Sophia to meet you faster. Thank you so much for helping\n' +
            'speaker2: the message. Hopefully I will be able to answer over your question.\n';
        // await azureClient.tagTranscription(meetingId, profileIds, untaggedTranscription);
    })
});