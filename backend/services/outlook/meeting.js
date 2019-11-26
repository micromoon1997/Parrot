const { getClient } = require('./ms-graph-client');
const { getDatabase } = require('../database');

function parseNumber(content) {
  const re = new RegExp(/\[meeting phone number:\s*([0-9]*?)\]/, 'i');
  const matches =  content.match(re);
  if (matches) {
    return matches[1];
  }
}

function parseCode(content) {
  const re = new RegExp(/\[meeting code:\s*([0-9]*?)\]/, 'i');
  const matches =  content.match(re);
  if (matches) {
    return matches[1];
  }
}

async function checkUpcomingMeetings() {
  try {
    const client = getClient();
    const result = await client
      .api('/me/events')
      .filter(`start/dateTime ge '${(new Date()).toISOString()}'`)
      .get();
    for (const meeting of result.value) {
      await updateMeeting(meeting);
    }
  } catch (err) {
    console.log(`Fail to get upcoming meetings: ${err}`);
  }
}

async function getMeetings() {
  const db = await getDatabase();
  try {
    const meetings = await db.collection('meetings').find({}).toArray();
    return meetings;
  } catch (e) {
    console.error('Fail to get meeting from database:' + e);
  }
}

async function updateMeeting(meeting) {
  const meetingId = meeting.id;
  const db = await getDatabase();
  try {
    const record = await db.collection('meetings').findOne({ meetingId: meetingId });
    if (record && record.changeKey === meeting.changeKey) {
      return false;
    }
    const newValues = {
      changeKey: meeting.changeKey,
      isCancelled: meeting.isCancelled,
      start: meeting.start,
      end: meeting.end,
      location: meeting.location,
      participants: meeting.attendees,
      meetingManager: meeting.organizer,
      phoneNumber: parseNumber(meeting.body.content),
      code: parseCode(meeting.body.content)
    };
    await db.collection('meetings').updateOne({ meetingId: meetingId },  { $set: newValues }, { upsert: true });
    console.log('Database updated.');
    return true;
  } catch (e) {
    console.error('Fail to update database:' + e);
  }
}

async function checkParticipantsEnrollment(meetingId) {
  const db = getDatabase();
  const unenrolledParticipantEmails = [];
  const meeting = await db.collection('meetings').findOne({meetingId});
  for (let participant of meeting.participants) {
    const email = participant.emailAddress.address;
    if (email === 'wavesbot319@outlook.com') {
      continue;
    }
    const person = await db.collection('people').findOne({email});
    if (!person || !person.azureSpeakerRecognitionGuid) {
      unenrolledParticipantEmails.push(email);
    }
  }
  if (unenrolledParticipantEmails.length > 0) {
    await sendEnrollmentNotification(unenrolledParticipantEmails);
  }
}

async function sendEnrollmentNotification(emails) {
  const toRecipients = [];
  for (let email of emails) {
    toRecipients.push({
      emailAddress: {
        address: email
      }
    });
  }
  const content = {
    message: {
      subject: 'Please Enroll Your Voice',
      body: {
        contentType: 'text',
        content:
            `You haven't enrolled your voice. To let the transcription agent work properly,
            please use the following link to enroll your voice before the meeting as soon as possible.\n
            ${process.env.SERVER_ADDRESS}/enroll`
      },
      toRecipients: toRecipients
    }
  };
  try {
    const client = getClient();
    await client
        .api('/me/sendMail')
        .post(content);
    console.log('Voice enrollment notification has been sent to following emails:');
    console.log(toRecipients);
  } catch (err) {
    console.error('Fail to send enrollment notification:\n');
    console.error(err);
  }
}

module.exports = {
  getMeetings: getMeetings,
  updateMeeting: updateMeeting,
  checkUpcomingMeetings: checkUpcomingMeetings,
  checkParticipantsEnrollment: checkParticipantsEnrollment
};