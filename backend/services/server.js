const open = require('open');
const schedule = require('node-schedule');
const fs = require('fs');
const subscribeService = require('../services/outlook/subsription');
const meetingService = require('../services/outlook/meeting');
const authService = require('../services/outlook/auth');



async function checkRefreshToken() {
  const refreshToken = process.env.OUTLOOK_AUTH_REFRESH_TOKEN;
  if (!refreshToken) {
    await open(authService.getAuthUrl());
    return false;
  } else {
    return true;
  }
}

async function checkServerStatus() {
  await subscribeService.deleteAllSubscriptions();
  await subscribeService.checkSubscription();
  await meetingService.checkUpcomingMeetings();
  schedule.scheduleJob('0 */1 * * *', () => {
    subscribeService.checkSubscription();
  });
}

function checkFileStorageFolders() {
  const folders = [
      'tmp',
      'transcriptions',
  ];
  for (let folderName of folders) {
    const dir = './' + folderName;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }
}

module.exports = {
  checkRefreshToken: checkRefreshToken,
  checkServerStatus: checkServerStatus,
  checkFileStorageFolders: checkFileStorageFolders
};