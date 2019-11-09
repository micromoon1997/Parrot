const express = require('express');
const router = express.Router();
// const makeCall = require("../services/twilio/make-call");
const {testRecording} = require("../services/schedule-call");

// router.get('/call/:toPhoneNumber', async (req, res) => {
//     const {toPhoneNumber} = req.params;
//     callSid = await makeCall({meetingId: 1111, toPhoneNumber, fromPhoneNumber: '+12564144266', record: true});
//     res.status(200);
// });

/* GET /call */
router.get('/done/:meetingId', async (req, res) => {
    const {meetingId} = req.params;
    testRecording(meetingId);
    res.status(200);
});

module.exports = router;