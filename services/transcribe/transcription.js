const { getDatabase } = require('../database');
const { getUntaggedTranscription } = require('../transcribe/google-speaker-diarization');
const { tagTranscription } = require('../ms-speaker-registration');

async function getProfileIDs(meeting) {
  const profileIds = [];
  for (const participant of meeting.participants) {
    const email = participant.emailAddress.address;
    const query = {email: email};
    const person = await db.collection('people').findOne(query);
    profileIds.push(person.ASRGuid);
    // TODO handle un-enrolled participants
  }
  return profileIds;
}

async function startTranscription(meetingId) {
  const db = getDatabase();
  const meeting = db.collection('meetings').findOne({ meetingId: meetingId });
  const recordingFileUrl = meeting.recordingFileUrl;
  const speakerCount = meeting.participants.length;
  const profileIds = await getProfileIDs(meeting);
  const untaggedTranscription = await getUntaggedTranscription(recordingFileUrl, speakerCount);
  await tagTranscription(meetingId, profileIds, untaggedTranscription);
}

module.exports = {
  startTranscription: startTranscription
};