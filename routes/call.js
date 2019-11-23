const express = require('express');
const router = express.Router();
const { startTranscription } = require('../services/transcribe/transcription');
const {
    fetchRecording,
    fetchRecordingSid,
    storeRecording
} = require('../services/twilio');

/* GET /call */
router.get('/done/:meetingId', async (req, res) => {
    const {meetingId} = req.params;

    const recordingSid = await fetchRecordingSid(meetingId);
    const recording = await fetchRecording({recordingSid});
    await storeRecording({recording, meetingId});
    await startTranscription(meetingId);

    res.status(200);
});

module.exports = router;