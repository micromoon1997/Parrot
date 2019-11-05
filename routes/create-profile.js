const express = require('express');
const router = express.Router();
const registration = require('../services/ms-speaker-registration.js');

router.post('/', function(req, res,next) {

    // TODO: add error handling
    registration.createProfile();
    res.sendStatus(200);
});

module.exports = router;