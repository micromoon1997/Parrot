const express = require('express');
const router = express.Router();
const { startTranscription } = require('../services/transcribe/transcription');
const {
    fetchRecording,
    fetchRecordingSid,
    storeRecording,
    updateDatabase
} = require('../services/twilio');

/* GET /call */
router.get('/done/:meetingId', async (req, res) => {
    const {meetingId} = req.params;

    const recordingSid = await fetchRecordingSid(meetingId);
    const recording = await fetchRecording({recordingSid, meetingId});
    await storeRecording({recording, meetingId});
    // await updateDatabase({relativePath, meetingId});
    await startTranscription(meetingId);
    res.status(200);
});

module.exports = router;