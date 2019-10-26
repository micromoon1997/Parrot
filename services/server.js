const open = require('open');
const schedule = require('node-schedule');
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

module.exports = {
  checkRefreshToken: checkRefreshToken,
  checkServerStatus: checkServerStatus
};