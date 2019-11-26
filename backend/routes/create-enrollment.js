const express = require('express');
const router = express.Router();
const registration = require('../services/ms-speaker-registration.js');
const multer = require('multer');
let upload = multer();
let type = upload.single('voice_sample');

router.post('/', type, async function(req, res, next) {
    res.setHeader("Content-type", 'application/json');
    await registration.createEnrollment(req.file, req.cookies.guid, res);
});

module.exports = router;