const fs = require('fs');
const client = require('../helpers/ms-graph-client');

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
    const result = await client
      .api('/me/events')
      .filter(`start/dateTime ge '${(new Date()).toISOString()}'`)
      .get();
    for (const meeting of result.value) {
      updateMeeting(meeting);
    }
  } catch (err) {
    console.log(err);
  }
}

function updateMeeting(meeting) {
  const meetingId = meeting.id;
  const data = fs.readFileSync('database.json');
  const meetings = JSON.parse(data);
  let index;
  for (let i = 0; i < meetings.length; i++) {
    if (meetings[i].id === meetingId) {
      index = i;
      break;
    }
  }
  if (index === undefined) {
    meetings.push({id: meetingId});
    index = meetings.length - 1;
  }
  if (meetings[index].changeKey === meeting.changeKey) {
    return;
  }
  meetings[index].changeKey = meeting.changeKey;
  meetings[index].start = meeting.start;
  meetings[index].end = meeting.end;
  meetings[index].location = meeting.location;
  meetings[index].participants = meeting.attendees;
  meetings[index].meetingManager = meeting.organizer;
  meetings[index].phoneNumber = parseNumber(meeting.body.content);
  meetings[index].code = parseCode(meeting.body.content);
  fs.writeFileSync('database.json', JSON.stringify(meetings, null, 2));
  console.log('Database updated.');
}

module.exports = {
  updateMeeting: updateMeeting,
  checkUpcomingMeetings: checkUpcomingMeetings
};