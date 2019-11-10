const express = require('express');
const router = express.Router();
const registration = require('../services/ms-speaker-registration.js');
const multer = require('multer');
let upload = multer();
let type = upload.single('voice_sample');

router.post('/', type, function(req, res, next) {
    try {
        registration.createEnrollment(req.file, res);
        res.setHeader("Content-type", 'application/json');
        res.sendStatus(200);
    } catch(err) {
        console.log(err)
    }
});

module.exports = router;