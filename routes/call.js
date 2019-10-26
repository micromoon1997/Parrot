const express = require('express');
const router = express.Router();
const call = require("../services/twilio/make-call");
const fetchRecordingSid = require("../services/twilio/fetch-recording-sid");
const fetchRecording = require("../services/twilio/fetch-recording");

let callSid;
let recordingSid;

/* GET /call */
router.get('/:toPhoneNumber', async (req, res, next) => {
    const {toPhoneNumber} = req.params;
    console.log(`To Phone Number: ${toPhoneNumber}`);

    callSid = await call(toPhoneNumber, '+12564144266', true);
    console.log(`Call Sid: ${callSid}`);

    recordingSid = await fetchRecordingSid(callSid);
    console.log(`Recording Sid: ${recordingSid}`);

    await fetchRecording(recordingSid);
    res.send("DONE!");
});

module.exports = router;