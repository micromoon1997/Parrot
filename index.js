var express = require('express');
const call = require("./services/twilio/makeCall");
const fetchRecordingSid = require("./services/twilio/fetchRecordingSid");
const fetchRecording = require("./services/twilio/fetchRecording");
var app = express();
const port = 3000;

let callSid;
let recordingSid;

app.get('/call/:toPhoneNumber', async (req, res) => {
    const {toPhoneNumber} = req.params;
    console.log(`To Phone Number: ${toPhoneNumber}`);

    callSid = await call(toPhoneNumber, '+12564144266', true);
    console.log(`Call Sid: ${callSid}`);

    recordingSid = await fetchRecordingSid(callSid);
    console.log(`Recording Sid: ${recordingSid}`);

    await fetchRecording(recordingSid);
    res.send("DONE!");
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));