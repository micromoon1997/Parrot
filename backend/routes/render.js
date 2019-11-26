const express = require('express');
const router = express.Router();
const {getMeetings} = require('../services/outlook/meeting');
const {getTranscription} = require('../services/transcribe/getTranscription');

/* GET /call */
router.get('/meetings', async (req, res) => {
    const meetings = await getMeetings();
    res.send(meetings);
});

router.get('/transcription/:transcriptionId', async (req, res) => {
    const {transcriptionId} = req.params;
    const transcription = await getTranscription(transcriptionId);
    res.send(transcription);
});

module.exports = router;