const express = require('express');
const router = express.Router();
const registration = require('../services/ms-speaker-registration.js');
const multer = require('multer');
let upload = multer();
// let type = ;
// console.log(type);

router.post('/', upload.single('voice_sample'), function(req, res, next) {
    console.log("here");
    console.log(req.file);
    registration.createEnrollment(req.file);
    res.sendStatus(200);
});

module.exports = router;