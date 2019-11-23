const express = require('express');
const router = express.Router();
const {getMeetings} = require('../services/outlook/meeting');

/* GET /call */
router.get('/meetings', async (req, res) => {
    const meetings = await getMeetings();
    res.send(meetings);
});

module.exports = router;