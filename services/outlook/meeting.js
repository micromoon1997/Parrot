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
    console.log(err);
  }
}

async function updateMeeting(meeting) {
  const meetingId = meeting.id;
  const db = await getDatabase();
  try {
    const record = await db.collection('meetings').findOne({ meetingId: meetingId });
    if (record && record.changeKey === meeting.changeKey) {
      return;
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
  } catch (e) {
    console.error('Fail to update database:' + e);
  }
}

module.exports = {
  updateMeeting: updateMeeting,
  checkUpcomingMeetings: checkUpcomingMeetings
};