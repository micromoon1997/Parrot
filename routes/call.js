const express = require('express');
const router = express.Router();
const call = require("../services/twilio/make-call");
const fetchRecordingSid = require("../services/twilio/fetch-recording-sid");
const fetchRecording = require("../services/twilio/fetch-recording");

let callSid;

/* GET /call */
<<<<<<< HEAD
router.get('/:toPhoneNumber', async (req, res, next) => {
=======
router.get('/call/:toPhoneNumber', async (req, res) => {
>>>>>>> chore(routes): remove console logs
    const {toPhoneNumber} = req.params;
    callSid = await call({toPhoneNumber, fromPhoneNumber: '+12564144266', record: true});
    res.status(200);
});

router.get('/done', async res => {
    const recordingSid = await fetchRecordingSid(callSid);
    await fetchRecording({recordingSid, meetingId: 1111});
    res.status(200);
});

module.exports = router;