const express = require('express');
const fs = require('fs');
const router = express.Router();
const client = require('../services/ms-graph-client');
const meetingHelper = require('../services/meeting');

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
      const result = await client
        .api(`/me/events/${meetingId}`)
        .get();
      meetingHelper.updateMeeting(result);
    }
    res.sendStatus(202);
  }
});

module.exports = router;
