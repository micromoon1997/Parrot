const express = require('express');
const router = express.Router();
const registration = require('../services/ms-speaker-registration.js');
const multer = require('multer');
let upload = multer();
let type = upload.single('voice_sample');

router.post('/', type, async function(req, res, next) {
    await registration.createEnrollment(req.file, req.cookies.guid, res);
    res.setHeader("Content-type", 'application/json');
});

module.exports = router;