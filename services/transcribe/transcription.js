const { getDatabase } = require('../database');
const { getUntaggedTranscription } = require('../transcribe/google-speaker-diarization');
const { tagTranscription } = require('../ms-speaker-registration');
const { clearWavFile } = require('./clear-temp-files');
const { sendTranscriptionToManager } = require('../outlook/meeting');

async function getProfileIds(meeting) {
    const profileIds = [];
    const db = getDatabase();
    for (const participant of meeting.participants) {
        const email = participant.emailAddress.address;
        if (email !== 'wavesbot319@outlook.com') {
            const query = {email: email};
            const person = await db.collection('people').findOne(query);
            profileIds.push(person.azureSpeakerRecognitionGuid);
            // TODO handle un-enrolled participants
        }
    }
    return profileIds;
}

async function startTranscription(meetingId) {
    const db = getDatabase();
    const meeting = await db.collection('meetings').findOne({meetingId: meetingId});
    const speakerCount = meeting.participants.length - 1; // account for parrot itself
    const profileIds = await getProfileIds(meeting);
    const untaggedTranscription = await getUntaggedTranscription(meetingId, speakerCount);
    await tagTranscription(meetingId, profileIds, untaggedTranscription);
    await sendTranscriptionToManager(meetingId);
    clearWavFile(`${__appRoot}/services/transcribe/output`);
}



module.exports = {
    startTranscription: startTranscription
};