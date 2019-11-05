const express = require('express');
const router = express.Router();
const { getClient } = require('../services/outlook/ms-graph-client');
const meetingHelper = require('../services/outlook/meeting');

/* POST /email */
router.post('/', async function (req, res, next) {
  const validationToken = req.query.validationToken;
  if (validationToken) {
    res
      .status(200)
      .send(req.query.validationToken);
    console.log('Notification URL updated.');
  } else {
    for (const notification of req.body.value) {
      const meetingId = notification.resourceData.id;
      const client = getClient();
      const result = await client
        .api(`/me/events/${meetingId}`)
        .get();
      await meetingHelper.updateMeeting(result);
    }
    res.sendStatus(202);
  }
});

module.exports = router;
