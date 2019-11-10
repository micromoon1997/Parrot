const express = require('express');
const router = express.Router();
const registration = require('../services/ms-speaker-registration.js');

router.post('/', function(req, res,next) {
    try {
        registration.createProfile();
        res.sendStatus(200);
    } catch(err) {
        console.log(err)
    }
});

module.exports = router;