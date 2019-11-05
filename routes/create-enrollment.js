const express = require('express');
const router = express.Router();
const registration = require('../services/ms-speaker-registration.js');
const multer = require('multer');
let upload = multer();
let type = upload.single('voice_sample');

router.post('/', type, function(req, res, next) {

    // TODO: add error handling
    registration.createEnrollment(req.file, res);
});

module.exports = router;